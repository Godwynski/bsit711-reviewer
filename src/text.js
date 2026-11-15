const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
// Escape first, then allow only **bold**, *italic* and `code` from reviewer text.
export function mdInline(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ESC[c])
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}
