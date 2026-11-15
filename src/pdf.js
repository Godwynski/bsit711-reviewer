/**
 * Clamps a 1-based page number to [1, totalPages].
 */
export function clampPage(page, totalPages) {
  const total = Math.max(1, Math.floor(Number(totalPages) || 1));
  const p = Math.floor(Number(page) || 1);
  return Math.min(total, Math.max(1, p));
}

/**
 * Clamps a PDF zoom factor to [min, max].
 */
export function clampZoom(zoom, min = 0.5, max = 3.0) {
  const n = Number(zoom);
  if (!Number.isFinite(n)) return 1;
  return Math.min(max, Math.max(min, Math.round(n * 100) / 100));
}

/**
 * Computes fit-width PDF scale given container width and unscaled page width.
 */
export function computeFitScale(containerWidth, pageBaseWidth, padding = 16) {
  const avail = Math.max(240, (Number(containerWidth) || 320) - padding);
  const base = Math.max(100, Number(pageBaseWidth) || 612);
  return clampZoom(avail / base, 0.35, 3.0);
}

/**
 * Computes crisp canvas backing-store DPR for devicePixelRatio and pinch scale.
 */
export function computeRenderDpr(deviceDpr = 1, pinchScale = 1, maxDpr = 4.0) {
  const base = Math.max(1, Number(deviceDpr) || 1);
  const pinch = Math.max(1, Number(pinchScale) || 1);
  return Math.min(maxDpr, Math.round(base * pinch * 100) / 100);
}

/**
 * Given page slot offsets ({ page, top, height }) and scroll position,
 * returns the 1-based page number most prominent in the viewport.
 */
export function computeVisiblePage(pageRects, scrollTop, viewportHeight) {
  if (!Array.isArray(pageRects) || pageRects.length === 0) return 1;
  const focusY = (Number(scrollTop) || 0) + Math.max(80, (Number(viewportHeight) || 400) * 0.35);
  let bestPage = pageRects[0].page || 1;
  let bestDist = Infinity;

  for (const r of pageRects) {
    const top = Number(r.top) || 0;
    const height = Math.max(1, Number(r.height) || 1);
    const bottom = top + height;
    if (focusY >= top && focusY <= bottom) {
      return r.page;
    }
    const center = top + height / 2;
    const dist = Math.abs(center - focusY);
    if (dist < bestDist) {
      bestDist = dist;
      bestPage = r.page;
    }
  }
  return bestPage;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Mounts the continuous-scroll PDF viewer with fullscreen pinch-to-zoom overlay.
 */
export async function mountPdfViewer(mountEl, { pdfUrl, pdfFile, pdfKey, store, loadPdfJs }) {
  mountEl.innerHTML = `
    <div class="tui-box pdf-shell">
      <div class="tui-title">pdf viewer</div>
      <div class="pdf-toolbar">
        <div class="pdf-nav-group">
          <button type="button" class="tui-btn pdf-icon-btn" data-pdf="prev" aria-label="Previous page">&lt;</button>
          <span data-pdf="status" class="pdf-page-indicator" aria-live="polite">loading...</span>
          <button type="button" class="tui-btn pdf-icon-btn" data-pdf="next" aria-label="Next page">&gt;</button>
        </div>
        <div class="pdf-zoom-group">
          <button type="button" class="tui-btn pdf-icon-btn" data-pdf="zoom-out" aria-label="Zoom out">-</button>
          <button type="button" class="tui-btn pdf-icon-btn" data-pdf="zoom-in" aria-label="Zoom in">+</button>
          <button type="button" class="tui-btn" data-pdf="fit">fit</button>
        </div>
        <div class="pdf-action-group">
          <button type="button" class="tui-btn tui-btn-primary" data-pdf="fullscreen">[ fullscreen ]</button>
          <details class="pdf-overflow">
            <summary class="tui-btn pdf-icon-btn" aria-label="More PDF actions">&middot;&middot;&middot;</summary>
            <div class="pdf-overflow-menu">
              <a class="pdf-overflow-item" href="${escHtml(pdfUrl)}" target="_blank" rel="noopener">open in tab</a>
              <a class="pdf-overflow-item" href="${escHtml(pdfUrl)}" download="${escHtml(pdfFile)}">download pdf</a>
            </div>
          </details>
        </div>
      </div>
      <div class="pdf-canvas-wrap" data-pdf="wrap" tabindex="0" aria-label="PDF pages"></div>
    </div>
  `;

  const statusEl = mountEl.querySelector('[data-pdf="status"]');
  const wrapEl = mountEl.querySelector('[data-pdf="wrap"]');
  const overflowDetails = mountEl.querySelector('.pdf-overflow');

  let pdfDoc = null;
  let totalPages = 1;
  let currentPage = store && pdfKey ? store.getPdfPage(pdfKey) : 1;
  let userScale = null; // null => fit-width
  let baseWidth = 612;
  let baseHeight = 792;
  let destroyed = false;
  let saveTimer = null;

  const inlineState = {
    slots: [],
    observer: null,
    tasks: new Map(),
    renderedScale: new Map(),
    renderGen: new Map(),
    activeRender: new Map(),
  };

  let fsState = null;

  function persistPage(page) {
    if (!store || !pdfKey) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      store.setPdfPage(pdfKey, page);
    }, 200);
  }

  function updateStatusText() {
    if (!pdfDoc) return;
    const text = `${currentPage} / ${totalPages}`;
    if (statusEl) statusEl.textContent = text;
    if (fsState?.statusEl) fsState.statusEl.textContent = text;
  }

  function getTargetScale(containerEl, multiplier = 1) {
    const fit = computeFitScale(containerEl.clientWidth || 320, baseWidth, 20);
    const base = userScale !== null ? userScale : fit;
    return clampZoom(base * multiplier, 0.4, 4.0);
  }

  function cancelTasks(tasksMap) {
    for (const task of tasksMap.values()) {
      try {
        task.cancel();
      } catch {
        // ignore
      }
    }
    tasksMap.clear();
  }

  async function renderSlot(slot, scale, dpr, stateObj) {
    if (!pdfDoc || destroyed) return;
    const pageNum = Number(slot.dataset.page);
    const renderKey = `${scale.toFixed(2)}@${dpr.toFixed(2)}`;
    if (stateObj.renderedScale.get(pageNum) === renderKey && !stateObj.activeRender.has(pageNum)) {
      return;
    }

    const gen = (stateObj.renderGen.get(pageNum) || 0) + 1;
    stateObj.renderGen.set(pageNum, gen);

    const prevTask = stateObj.tasks.get(pageNum);
    if (prevTask) {
      try {
        prevTask.cancel();
      } catch {
        // ignore
      }
    }

    const prevPromise = stateObj.activeRender.get(pageNum);
    if (prevPromise) {
      await prevPromise.catch(() => {});
    }

    if (destroyed || stateObj.renderGen.get(pageNum) !== gen) return;
    if (stateObj.renderedScale.get(pageNum) === renderKey) return;

    const runPromise = (async () => {
      const page = await pdfDoc.getPage(pageNum);
      if (destroyed || stateObj.renderGen.get(pageNum) !== gen) return;

      const viewport = page.getViewport({ scale });
      const cssW = Math.floor(viewport.width);
      const cssH = Math.floor(viewport.height);
      slot.style.width = `${cssW}px`;
      slot.style.height = `${cssH}px`;

      let canvas = slot.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.setAttribute('data-pdf', 'canvas');
        slot.appendChild(canvas);
      }

      const backingW = Math.max(1, Math.floor(viewport.width * dpr));
      const backingH = Math.max(1, Math.floor(viewport.height * dpr));
      if (canvas.width !== backingW || canvas.height !== backingH) {
        canvas.width = backingW;
        canvas.height = backingH;
      }
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const task = page.render({ canvasContext: ctx, viewport });
      stateObj.tasks.set(pageNum, task);

      try {
        await task.promise;
        if (stateObj.renderGen.get(pageNum) === gen) {
          stateObj.renderedScale.set(pageNum, renderKey);
          slot.classList.add('is-rendered');
        }
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') throw err;
      } finally {
        if (stateObj.tasks.get(pageNum) === task) {
          stateObj.tasks.delete(pageNum);
        }
      }
    })();

    stateObj.activeRender.set(pageNum, runPromise);
    try {
      await runPromise;
    } finally {
      if (stateObj.activeRender.get(pageNum) === runPromise) {
        stateObj.activeRender.delete(pageNum);
      }
    }
  }

  function buildSlots(containerEl, stateObj, scale) {
    if (stateObj.observer) {
      stateObj.observer.disconnect();
      stateObj.observer = null;
    }
    cancelTasks(stateObj.tasks);
    stateObj.renderedScale.clear();
    containerEl.innerHTML = '';
    stateObj.slots = [];

    const estW = Math.floor(baseWidth * scale);
    const estH = Math.floor(baseHeight * scale);

    for (let p = 1; p <= totalPages; p++) {
      const slot = document.createElement('div');
      slot.className = 'pdf-page-slot';
      slot.dataset.page = String(p);
      slot.style.width = `${estW}px`;
      slot.style.height = `${estH}px`;
      containerEl.appendChild(slot);
      stateObj.slots.push(slot);
    }
  }

  function layoutSlotsForScale(stateObj, scale) {
    stateObj.renderedScale.clear();
    const estW = Math.floor(baseWidth * scale);
    const estH = Math.floor(baseHeight * scale);
    for (const slot of stateObj.slots) {
      slot.style.width = `${estW}px`;
      slot.style.height = `${estH}px`;
      const c = slot.querySelector('canvas');
      if (c) {
        c.style.width = `${estW}px`;
        c.style.height = `${estH}px`;
      }
    }
  }

  function observeAndRenderVisible(containerEl, stateObj, getScaleFn, getDprFn) {
    const renderPageAndNeighbors = (p) => {
      const scale = getScaleFn();
      const dpr = getDprFn();
      for (const np of [p - 1, p, p + 1]) {
        if (np >= 1 && np <= totalPages) {
          const slot = stateObj.slots[np - 1];
          if (slot) renderSlot(slot, scale, dpr, stateObj);
        }
      }
    };

    if (typeof IntersectionObserver !== 'undefined') {
      stateObj.observer = new IntersectionObserver(
        (entries) => {
          const scale = getScaleFn();
          const dpr = getDprFn();
          for (const entry of entries) {
            if (entry.isIntersecting) {
              renderSlot(entry.target, scale, dpr, stateObj);
            }
          }
        },
        { root: containerEl, rootMargin: '400px 0px', threshold: 0.01 }
      );
      for (const slot of stateObj.slots) {
        stateObj.observer.observe(slot);
      }
    }

    renderPageAndNeighbors(currentPage);
    return renderPageAndNeighbors;
  }

  function getSlotRects(containerEl, slots) {
    const baseTop = containerEl.scrollTop - containerEl.getBoundingClientRect().top;
    return slots.map((s) => {
      const r = s.getBoundingClientRect();
      return {
        page: Number(s.dataset.page),
        top: r.top + baseTop,
        height: r.height,
      };
    });
  }

  function scrollToPage(containerEl, slots, targetPage, behavior = 'smooth') {
    const p = clampPage(targetPage, totalPages);
    currentPage = p;
    updateStatusText();
    persistPage(p);
    const slot = slots[p - 1];
    if (slot) {
      const top =
        slot.getBoundingClientRect().top -
        containerEl.getBoundingClientRect().top +
        containerEl.scrollTop -
        8;
      containerEl.scrollTo({ top: Math.max(0, top), behavior });
    }
  }

  let renderInlineNeighbors = () => {};

  function attachScrollSync(containerEl, stateObj, onPageUpdate) {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!pdfDoc || destroyed) return;
        const rects = getSlotRects(containerEl, stateObj.slots);
        const visible = computeVisiblePage(rects, containerEl.scrollTop, containerEl.clientHeight);
        if (visible !== currentPage) {
          currentPage = visible;
          updateStatusText();
          persistPage(currentPage);
        }
        onPageUpdate(visible);
      });
    };
    containerEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      containerEl.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }

  // --- Fullscreen Mode ---
  function closeFullscreen() {
    if (!fsState) return;
    const state = fsState;
    fsState = null;

    if (state.observer) state.observer.disconnect();
    cancelTasks(state.tasks);
    clearTimeout(state.hideTimer);
    clearTimeout(state.pinchTimer);
    state.cleanupListeners();

    if (document.fullscreenElement === state.overlay) {
      document.exitFullscreen?.().catch(() => {});
    }
    state.overlay.remove();
    document.body.classList.remove('pdf-fs-lock');

    // Sync inline viewer to page viewed in fullscreen
    if (pdfDoc && inlineState.slots.length) {
      scrollToPage(wrapEl, inlineState.slots, currentPage, 'auto');
      renderInlineNeighbors(currentPage);
    }
    mountEl.querySelector('[data-pdf="fullscreen"]')?.focus({ preventScroll: true });
  }

  function openFullscreen() {
    if (!pdfDoc || fsState) return;

    const overlay = document.createElement('div');
    overlay.className = 'pdf-fs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Fullscreen PDF viewer');
    overlay.innerHTML = `
      <div class="pdf-fs-controls" data-pdf="fs-controls">
        <span class="pdf-fs-status" data-pdf="fs-status">${currentPage} / ${totalPages}</span>
        <span class="pdf-fs-hint">pinch to zoom &middot; double-tap 2x</span>
        <button type="button" class="tui-btn pdf-fs-close" data-pdf="fs-close" aria-label="Close fullscreen">X</button>
      </div>
      <div class="pdf-fs-scroll" data-pdf="fs-scroll" tabindex="0"></div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('pdf-fs-lock');

    const controlsEl = overlay.querySelector('[data-pdf="fs-controls"]');
    const statusFsEl = overlay.querySelector('[data-pdf="fs-status"]');
    const scrollEl = overlay.querySelector('[data-pdf="fs-scroll"]');
    const closeBtn = overlay.querySelector('[data-pdf="fs-close"]');

    let zoomMultiplier = 1; // 1 = fit-width, 2 = 2x double-tap
    let pinchDprScale = 1;

    const getFsScale = () => {
      const fit = computeFitScale(scrollEl.clientWidth || window.innerWidth, baseWidth, 12);
      return clampZoom(fit * zoomMultiplier, 0.4, 4.0);
    };
    const getFsDpr = () => computeRenderDpr(window.devicePixelRatio || 1, pinchDprScale, 4.0);

    const state = {
      overlay,
      statusEl: statusFsEl,
      slots: [],
      observer: null,
      tasks: new Map(),
      renderedScale: new Map(),
      renderGen: new Map(),
      activeRender: new Map(),
      hideTimer: null,
      pinchTimer: null,
      cleanupListeners: () => {},
    };
    fsState = state;

    const showControls = (autoHide = true) => {
      controlsEl.classList.remove('is-hidden');
      clearTimeout(state.hideTimer);
      if (autoHide) {
        state.hideTimer = setTimeout(() => {
          controlsEl.classList.add('is-hidden');
        }, 2500);
      }
    };

    const hideControlsOnScroll = () => {
      controlsEl.classList.add('is-hidden');
      clearTimeout(state.hideTimer);
    };

    const initialScale = getFsScale();
    buildSlots(scrollEl, state, initialScale);
    const renderFsNeighbors = observeAndRenderVisible(scrollEl, state, getFsScale, getFsDpr);

    // Jump to current page in fullscreen if past page 1
    if (currentPage > 1) {
      scrollToPage(scrollEl, state.slots, currentPage, 'auto');
      renderFsNeighbors(currentPage);
    }
    showControls(true);

    const detachScrollSync = attachScrollSync(scrollEl, state, (p) => {
      renderFsNeighbors(p);
    });

    const onScrollHide = () => hideControlsOnScroll();
    scrollEl.addEventListener('scroll', onScrollHide, { passive: true });

    // Tap to reveal controls; double-tap to toggle fit-width / 2x
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let pointerStart = null;

    const toggleDoubleTapZoom = () => {
      const anchorPage = currentPage;
      zoomMultiplier = zoomMultiplier > 1.2 ? 1 : 2;
      const newScale = getFsScale();
      layoutSlotsForScale(state, newScale);
      scrollToPage(scrollEl, state.slots, anchorPage, 'auto');
      renderFsNeighbors(anchorPage);
      showControls(true);
    };

    const onPointerDown = (e) => {
      if (e.target.closest('[data-pdf="fs-controls"]')) return;
      pointerStart = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const onPointerUp = (e) => {
      if (e.target.closest('[data-pdf="fs-controls"]')) return;
      if (!pointerStart) return;
      const dx = Math.abs(e.clientX - pointerStart.x);
      const dy = Math.abs(e.clientY - pointerStart.y);
      const elapsed = Date.now() - pointerStart.time;
      pointerStart = null;
      if (dx > 14 || dy > 14 || elapsed > 400) return; // dragged, not tapped

      const now = Date.now();
      const tapDx = Math.abs(e.clientX - lastTapX);
      const tapDy = Math.abs(e.clientY - lastTapY);
      if (now - lastTapTime < 300 && tapDx < 32 && tapDy < 32) {
        lastTapTime = 0;
        toggleDoubleTapZoom();
      } else {
        lastTapTime = now;
        lastTapX = e.clientX;
        lastTapY = e.clientY;
        if (controlsEl.classList.contains('is-hidden')) {
          showControls(true);
        } else {
          hideControlsOnScroll();
        }
      }
    };

    const onDblClick = (e) => {
      if (e.target.closest('[data-pdf="fs-controls"]')) return;
      // Only handle mouse dblclick (touch double-tap is handled by pointerup)
      if (e.pointerType === 'touch') return;
      toggleDoubleTapZoom();
    };

    scrollEl.addEventListener('pointerdown', onPointerDown);
    scrollEl.addEventListener('pointerup', onPointerUp);
    scrollEl.addEventListener('dblclick', onDblClick);

    // Re-render at higher DPR after native pinch-zoom settles
    const onVisualViewportChange = () => {
      const vvScale = window.visualViewport?.scale || 1;
      clearTimeout(state.pinchTimer);
      state.pinchTimer = setTimeout(() => {
        if (!fsState || destroyed) return;
        const clamped = Math.min(3.5, Math.max(1, vvScale));
        if (Math.abs(clamped - pinchDprScale) >= 0.15) {
          pinchDprScale = clamped;
          renderFsNeighbors(currentPage);
        }
      }, 180);
    };

    window.visualViewport?.addEventListener('resize', onVisualViewportChange);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeFullscreen();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    const onFullscreenChange = () => {
      // If user exited native fullscreen via browser UI, keep or close cleanly
      if (!document.fullscreenElement && fsState && fsState._usedNativeFs) {
        closeFullscreen();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    closeBtn.addEventListener('click', closeFullscreen);

    state.cleanupListeners = () => {
      detachScrollSync();
      scrollEl.removeEventListener('scroll', onScrollHide);
      scrollEl.removeEventListener('pointerdown', onPointerDown);
      scrollEl.removeEventListener('pointerup', onPointerUp);
      scrollEl.removeEventListener('dblclick', onDblClick);
      window.visualViewport?.removeEventListener('resize', onVisualViewportChange);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };

    // Request native Fullscreen API when available (optional enhancement, works without it)
    if (typeof overlay.requestFullscreen === 'function') {
      overlay
        .requestFullscreen()
        .then(() => {
          if (fsState === state) state._usedNativeFs = true;
        })
        .catch(() => {
          // Fallback overlay already covers screen
        });
    }
  }

  // --- Toolbar handlers ---
  mountEl.querySelector('[data-pdf="prev"]').addEventListener('click', () => {
    if (!pdfDoc || currentPage <= 1) return;
    scrollToPage(wrapEl, inlineState.slots, currentPage - 1);
  });

  mountEl.querySelector('[data-pdf="next"]').addEventListener('click', () => {
    if (!pdfDoc || currentPage >= totalPages) return;
    scrollToPage(wrapEl, inlineState.slots, currentPage + 1);
  });

  const applyInlineZoom = (nextUserScale) => {
    if (!pdfDoc) return;
    const anchor = currentPage;
    userScale = nextUserScale;
    const scale = getTargetScale(wrapEl);
    layoutSlotsForScale(inlineState, scale);
    scrollToPage(wrapEl, inlineState.slots, anchor, 'auto');
    renderInlineNeighbors(anchor);
  };

  mountEl.querySelector('[data-pdf="zoom-in"]').addEventListener('click', () => {
    if (!pdfDoc) return;
    const curr = userScale !== null ? userScale : getTargetScale(wrapEl);
    applyInlineZoom(clampZoom(curr + 0.25));
  });

  mountEl.querySelector('[data-pdf="zoom-out"]').addEventListener('click', () => {
    if (!pdfDoc) return;
    const curr = userScale !== null ? userScale : getTargetScale(wrapEl);
    applyInlineZoom(clampZoom(curr - 0.25));
  });

  mountEl.querySelector('[data-pdf="fit"]').addEventListener('click', () => {
    applyInlineZoom(null);
  });

  mountEl.querySelector('[data-pdf="fullscreen"]').addEventListener('click', openFullscreen);

  const onDocClick = (e) => {
    if (overflowDetails?.open && !overflowDetails.contains(e.target)) {
      overflowDetails.open = false;
    }
  };
  document.addEventListener('click', onDocClick);
  overflowDetails?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      overflowDetails.open = false;
    });
  });

  const onResize = () => {
    if (!pdfDoc || destroyed || userScale !== null) return;
    const anchor = currentPage;
    const scale = getTargetScale(wrapEl);
    layoutSlotsForScale(inlineState, scale);
    renderInlineNeighbors(anchor);
  };
  window.addEventListener('resize', onResize);

  let detachInlineScroll = () => {};

  try {
    const pdfjs = await loadPdfJs();
    const res = await fetch(pdfUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = new Uint8Array(await res.arrayBuffer());
    const loadingTask = pdfjs.getDocument({
      data,
      verbosity: pdfjs.VerbosityLevel?.ERRORS ?? 0,
    });
    pdfDoc = await loadingTask.promise;
    if (destroyed) return () => {};

    totalPages = pdfDoc.numPages || 1;
    currentPage = clampPage(currentPage, totalPages);

    const firstPage = await pdfDoc.getPage(1);
    if (destroyed) return () => {};
    const vp1 = firstPage.getViewport({ scale: 1 });
    baseWidth = vp1.width || 612;
    baseHeight = vp1.height || 792;

    const initialScale = getTargetScale(wrapEl);
    buildSlots(wrapEl, inlineState, initialScale);
    const getInlineScale = () => getTargetScale(wrapEl);
    const getInlineDpr = () => computeRenderDpr(window.devicePixelRatio || 1, 1, 3.0);

    renderInlineNeighbors = observeAndRenderVisible(
      wrapEl,
      inlineState,
      getInlineScale,
      getInlineDpr
    );
    updateStatusText();

    if (currentPage > 1) {
      scrollToPage(wrapEl, inlineState.slots, currentPage, 'auto');
      renderInlineNeighbors(currentPage);
    }

    detachInlineScroll = attachScrollSync(wrapEl, inlineState, (p) => {
      renderInlineNeighbors(p);
    });
  } catch (err) {
    if (!destroyed) {
      if (statusEl) statusEl.textContent = 'error';
      wrapEl.innerHTML = `<div class="card-meta" style="padding:16px;">Unable to render PDF inline (${escHtml(
        err?.message || 'offline'
      )}). Use the &middot;&middot;&middot; menu to open in a tab or download.</div>`;
    }
  }

  return () => {
    destroyed = true;
    clearTimeout(saveTimer);
    closeFullscreen();
    detachInlineScroll();
    document.removeEventListener('click', onDocClick);
    window.removeEventListener('resize', onResize);
    if (inlineState.observer) inlineState.observer.disconnect();
    cancelTasks(inlineState.tasks);
  };
}
