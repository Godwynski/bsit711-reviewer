# Exam Reviewer: A Scene Graph Framework (05 Handout 1)

## 1. Key Terms

| Term | Short definition (handout wording, simplified) | Memory hook |
| :--- | :--- | :--- |
| **Scene graph** | A data structure at the heart of a 3D graphics framework that organizes 3D scene contents in a hierarchical or tree-like structure. | Family tree for 3D objects |
| **Tree** | A graphical representation of a hierarchical structure made of nodes linked to their successors. | Upside-down branching hierarchy |
| **Node** | An element in a tree; in a scene graph, each node represents a 3D object in 3D space. | One box/circle in the diagram |
| **Parent node** | The predecessor of a node in a tree. | Node directly above |
| **Child node** | The successor of a node; each child node has exactly 1 parent (except the root). | Node directly below |
| **Root node** | The topmost node of a tree, which has no parent. | Top of the hierarchy (the `Scene`) |
| **Transform** | Collectively refers to an object's current location, orientation, and scale. | **L-O-S**: Location, Orientation, Scale |
| **Model matrix** | A single matrix storing accumulated transformations (product of matrices) representing an object's transform relative to its parent. | Local transform vs. parent |
| **World transformation** | An object's transform relative to the root node, calculated as the product of its model matrix and all its ancestors' model matrices. | Multiply all the way up to Root |
| **Connection** | An arrow from a child object to a parent object representing an occurrence of that object in the parent; one object can have multiple connections. | Reuse link / arrow |
| **Modeling transformation** | A transformation associated with each arrow connecting a child to a parent that places the child into the parent; differs per copy. | Per-arrow placement |
| **Compound object** | Simple geometric shapes grouped under a shared parent node so they can be transformed as a single unit (e.g., 5 boxes forming a table). | Many parts, one parent |
| **`Object3D` class** | The base node class representing 3D objects; stores a transform matrix, a list of child references, and a parent reference. | Base node with 3 items |
| **`Scene`** | Sample class name for the root node of the scene graph. | Topmost container |
| **`Group`** | Sample class name for interior nodes used for grouping purposes. | Folder / container node |
| **`Mesh`** | Sample class name for nodes corresponding to objects that can be rendered; stores a transformation matrix and a VAO reference. | Renderable 3D object |
| **`Camera`** | Sample class name for the virtual camera used to render the point of view. | Viewer's eye |
| **`Light`** | Sample class name for a virtual light source that affects shading and shadows. | Scene illumination |
| **`Geometry`** | Sample class name for the general shape and vertex-related properties of each mesh. | Shape & vertex data |
| **`Material`** | Sample class name for the general appearance of an object; repository for shader code, uniform objects, and render settings. | Look & shader settings |
| **`Renderer`** | Sample class name for general initialization tasks and image rendering. | Draws the scene |
| **Vertex Array Object (VAO)** | Referenced by each `Mesh`; associates vertex buffers (via `Attribute` objects in `Geometry`) with attribute variables (in `Material` shaders). | Bridge between `Geometry` and `Material` |
| **`Attribute` objects** | Stored in `Geometry`; describe vertex properties (e.g., position, color) and store references to vertex buffers. | Per-vertex data holders |
| **Texture coordinates** | Data stored by `Geometry` used for applying images to shapes. | Image-mapping coords |
| **Normal vectors** | Data stored by `Geometry` used in lighting calculations. | Surface direction for lighting |
| **Total number of vertices** | Calculated by `Geometry`; equal to the length of the data array stored in any attribute. | Attribute array length |
| **Shader code (and program reference)** | Stored in `Material`; compiled by base `Material` functions to define how an object is shaded/rendered. | GPU program instructions |
| **Uniform objects** | Stored in `Material` (dictionary); correspond to uniform variables defined in shaders. | Shared shader variables |
| **Render settings** | Stored in `Material` (dictionary); properties set via function calls such as geometric primitive type (points, lines, triangles), point size, and line width. | Drawing mode & thickness |

---

## 2. Look-Alike / Confusing Terms

### Group 1: Model Matrix vs. World Transformation vs. Modeling Transformation
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Model matrix** | Single matrix storing accumulated location, orientation, and scale. | Transform relative to the **parent** object. | "relative to its parent", "accumulated transformations", "location, orientation, and scale" |
| **World transformation** | Product of an object's model matrix and all its ancestors' model matrices. | Transform relative to the **root** of the scene graph. | "relative to the root", "ancestors", "product of... model matrix and each of its ancestors" |
| **Modeling transformation** | Transformation associated with each arrow from child to parent. | Places a specific **copy** of a child object into its parent. | "each arrow", "multiple copies", "places the child object into its parent" |

> **Trap:** Do not confuse **model matrix** (relative to parent) with **world transformation** (relative to root via all ancestors).

---

### Group 2: `Scene` vs. `Group` vs. `Mesh` (Tree Node Roles)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **`Scene`** | Root node of the scene graph. | Topmost node; has **no parent**. | "root node", "topmost", "no parent" |
| **`Group`** | Interior node used for grouping purposes. | Organizes/groups children (e.g., compound object). | "interior nodes", "grouping purposes", "transform as a single unit" |
| **`Mesh`** | Node corresponding to an object that can be rendered. | Directly **renderable**; holds a VAO reference and transformation matrix. | "can be rendered", "reference to a VAO", "different positions and orientations" |

> **Trap:** `Group` and `Scene` are both node roles, but `Scene` is the **root** while `Group` is an **interior** grouping node; `Mesh` is the role identified as renderable.

---

### Group 3: `Geometry` vs. `Material` vs. `VAO`
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **`Geometry`** | Class for general shape and vertex-related properties. | Stores `Attribute` objects (position, color), texture coordinates, and normal vectors. | "general shape", "vertex-related properties", "normal vectors", "texture coordinates" |
| **`Material`** | Class for general appearance of an object. | Stores shader code/program reference, uniform objects, and render settings. | "general appearance", "shader code", "uniform objects", "render settings" |
| **VAO (Vertex Array Object)** | Object referenced by each `Mesh`. | **Connects** `Geometry` vertex buffers to `Material` shader attribute variables. | "associates vertex buffers... to attribute variables", "reused and rendered with different materials" |

> **Trap:** `Geometry` stores vertex buffer references (via `Attribute`), `Material` stores shader attribute variables, and the **VAO** links the two.

---

### Group 4: `Attribute` Objects vs. Uniform Objects vs. Render Settings
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **`Attribute` objects** | Vertex property descriptors stored in `Geometry`. | Per-vertex data (position, color) referencing vertex buffers. | "vertex properties", "position and color", "length of the data array" |
| **Uniform objects** | Shader variable wrappers stored in `Material`. | Correspond to uniform variables defined in shaders (e.g., mesh, camera, perspective matrices). | "uniform variables", "copied by the renderer", "sent to the GPU" |
| **Render settings** | Drawing configuration stored in `Material`. | Properties set by calling functions (primitive type, point size, line width). | "set by calling functions", "points, lines, or triangles", "point size", "line width" |

> **Trap:** `Attribute` objects belong to **`Geometry`**, whereas both **uniform objects** and **render settings** belong to **`Material`**.

---

### Group 5: Parent Node vs. Child Node vs. Root Node
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Parent node** | Predecessor of a node. | Has one or more child nodes below it. | "predecessor", "above", "shared by five nodes" |
| **Child node** | Successor of a node. | Has **exactly 1** parent (except root). | "successor", "exactly one parent" |
| **Root node** | Topmost node of the tree. | The **only** node with **no parent**. | "topmost node", "except for a special node" |

> **Trap:** A single *object* in a scene graph can have multiple connections to parent objects, even though in a strict tree each child node has only one parent.

---

## 3. Likely Distractors

| Major Term | 3 Most Likely Wrong Choices | How to Tell Them Apart in One Line |
| :--- | :--- | :--- |
| **Model matrix** | World transformation, Modeling transformation, Transform | Model matrix is relative to the **parent**; world is relative to the **root**; modeling transformation is per-arrow; transform is the 3-part concept (location, orientation, scale). |
| **World transformation** | Model matrix, Modeling transformation, Perspective transformation | World transformation multiplies model matrices up through **all ancestors to the root**, unlike a single local model matrix or scene-wide perspective. |
| **`Scene`** | `Group`, `Mesh`, `Renderer` | `Scene` is the **root node**; `Group` is an interior grouping node; `Mesh` is renderable; `Renderer` executes the drawing process. |
| **`Group`** | `Scene`, `Mesh`, `Object3D` | `Group` is specifically an **interior node for grouping**; `Scene` is the root; `Mesh` is rendered; `Object3D` is the base class. |
| **`Mesh`** | `Geometry`, `Material`, `Group` | `Mesh` is the renderable **node** holding a VAO and transform; `Geometry` is shape/vertices; `Material` is appearance/shaders; `Group` only groups. |
| **`Geometry`** | `Material`, `Mesh`, `VAO` | `Geometry` holds **vertex/shape data** (attributes, normals, UVs), not shaders (`Material`), node transforms (`Mesh`), or buffer-to-shader bindings (`VAO`). |
| **`Material`** | `Geometry`, `Renderer`, `Mesh` | `Material` is the **appearance repository** (shaders, uniforms, render settings), whereas `Renderer` runs the draw loop and `Geometry` holds vertex data. |
| **VAO** | `Attribute`, `Geometry`, `Material` | VAO is the **connector** owned by `Mesh` that links `Geometry` vertex buffers to `Material` shader attributes. |
| **`Renderer`** | `Material`, `Camera`, `Scene` | `Renderer` performs initialization and drawing using a `Scene` and `Camera` as parameters, rather than being a node or appearance container. |
| **Texture coordinates** | Normal vectors, `Attribute` (position/color), Render settings | Texture coordinates **apply images to shapes**, while normal vectors handle **lighting calculations**. |
| **Normal vectors** | Texture coordinates, Transform, Uniform objects | Normal vectors are stored in `Geometry` for **lighting calculations**, not image mapping or object placement. |
| **Render settings** | Uniform objects, `Attribute` objects, Shader code | Render settings are **function-configured drawing properties** (primitive type, point size, line width), not shader variables or vertex arrays. |

---

## 4. Lists, Sequences & "Which is NOT"

1. **3 properties collectively called the `transform` (stored in the model matrix):**
   - Location
   - Orientation
   - Scale
   - *Fake "NOT" swap-in:* Color, vertex count, or normal vectors.

2. **3 items contained in the base `Object3D` node class:**
   - A matrix to store its transform data
   - A list of references to child objects
   - A reference to a parent object
   - *Fake "NOT" swap-in:* Shader code, a VAO reference, or render settings.

3. **8 classes extending `Object3D` / roles in the scene graph framework:**
   1. `Scene` (Root node)
   2. `Group` (Interior nodes used for grouping purposes)
   3. `Mesh` (Nodes corresponding to objects that can be rendered)
   4. `Camera` (Virtual camera for rendering the point of view)
   5. `Light` (Virtual light source that affects shading and shadows)
   6. `Geometry` (General shape and vertex-related properties of each mesh)
   7. `Material` (General appearance of an object)
   8. `Renderer` (General initialization tasks and image rendering)
   - *Fake "NOT" swap-in:* `VAO`, `Attribute`, or `Uniform`.

4. **3 types of data stored in/described by `Geometry`:**
   - `Attribute` objects describing vertex properties (such as **position** and **color**)
   - Texture coordinates (for applying images to shapes)
   - Normal vectors (for use in lighting calculations)
   - *Note:* `Geometry` also calculates the **total number of vertices** (length of the data array in any attribute).
   - *Fake "NOT" swap-in:* Uniform objects, render settings, or shader program reference.

5. **2 ways `Geometry` subclasses supply attribute data:**
   - **Listed directly** (e.g., rectangles and boxes)
   - **Calculated from mathematical formulas** (e.g., polygons, cylinders, and spheres)
   - *Fake "NOT" swap-in:* Copied by the renderer from the camera.

6. **3 types of information stored in the `Material` class:**
   - Shader code (and the associated program reference)
   - Uniform objects
   - Render settings
   - *Fake "NOT" swap-in:* Vertex buffers, normal vectors, or child object references.

7. **3 examples of render settings:**
   - Type of geometric primitives (points, lines, or triangles)
   - Point size
   - Line width
   - *Fake "NOT" swap-in:* Perspective transformation, texture coordinates, or normal vectors.

8. **2 functions/tasks performed by the base `Material` class:**
   - Initializing dictionaries to store uniform objects and render setting data
   - Defining functions to compile shader program code and locate uniform variable references
   - *Fake "NOT" swap-in:* Calculating total vertex count or binding a VAO.

9. **3 things supplied by `Material` subclasses/extensions:**
   - Actual shader code
   - Collection of uniform objects corresponding to uniform variables defined in the shaders
   - Collection of render setting variables applicable to the type of geometric primitive being rendered
   - *Fake "NOT" swap-in:* List of child nodes or mathematical formulas for spheres.

10. **2 parameters required by the `Renderer` rendering function:**
    - A `scene` object
    - A `camera` object
    - *Fake "NOT" swap-in:* A `Light` object, a `Material` object, or a `Geometry` object.

11. **4 tasks performed by the `Renderer` for each mesh before calling the drawing function (in order):**
    1. Activating the correct shader program
    2. Binding a vertex array object (VAO)
    3. Configuring render settings
    4. Sending values to be used in uniform variables
    - *Fake "NOT" swap-in:* Compiling shader code or listing vertex attribute data.

12. **3 required uniform variables (stored outside `Material`, copied by `Renderer` before sending to GPU):**
    1. Transformation of a mesh
    2. Transformation of the virtual camera used for viewing the scene
    3. Perspective transformation applied to all objects in the scene
    - *Fake "NOT" swap-in:* Normal vectors, point size, or line width.

---

## 5. Situational Practice Questions

1. A 3D engine developer needs to organize every object in a virtual room using a hierarchical data structure with parent-child links. Which core structure is this?
   A. Model matrix
   B. Scene graph
   C. Vertex Array Object
   D. Render settings

2. An artist builds a table using five boxesâ€”one flat top and four legsâ€”and wants to move and rotate the entire table as a single unit by transforming only one parent node. Which concept does this demonstrate?
   A. Compound object
   B. World transformation
   C. Render settings
   D. Normal vectors

3. In a scene graph, a wheel object is connected twice to a cart parent, and a line object is connected 12 times to the wheel. Each copy appears in a different spot on the parent. What differs for each arrow/copy?
   A. The child object's vertex data
   B. The root node
   C. The modeling transformation
   D. The `Geometry` class

4. A developer needs to know a wheel's exact position, orientation, and scale relative to the **root** of the scene graph, not just relative to the cart it is attached to. Which calculation is needed?
   A. Model matrix
   B. World transformation
   C. Render settings
   D. Attribute array length

5. A node's model matrix stores three properties collectively known as its "transform." Which of the following is NOT one of those three properties?
   A. Location
   B. Orientation
   C. Scale
   D. Color

6. Which class represents the topmost node of a scene graph that has no parent?
   A. `Group`
   B. `Scene`
   C. `Mesh`
   D. `Object3D`

7. A programmer creates a base node class (`Object3D`) for 3D objects. Which of the following is NOT one of the three items it must contain?
   A. A matrix to store its transform data
   B. A list of references to child objects
   C. A reference to a parent object
   D. A reference to a vertex array object (VAO)

8. A designer wants an interior node to organize several meshes together. Which sample class fits this role?
   A. `Group`
   B. `Mesh`
   C. `Scene`
   D. `Geometry`

9. A developer wants to reuse the exact same box vertex data across five different parts of a table, while giving each part a different surface appearance. Which object in each `Mesh` links the `Geometry` vertex buffers to the `Material` shader attribute variables?
   A. Uniform object
   B. Vertex Array Object (VAO)
   C. Model matrix
   D. `Renderer`

10. Which class is responsible for storing `Attribute` objects (like position and color), texture coordinates, and normal vectors?
    A. `Material`
    B. `Mesh`
    C. `Geometry`
    D. `Renderer`

11. An engineer is writing a `Geometry` subclass for a **sphere** and a **cylinder**. How should the attribute data for these shapes be generated?
    A. Listed directly in the class
    B. Calculated from mathematical formulas
    C. Copied from the `Camera` transform
    D. Loaded from render settings

12. A `Geometry` object has a position attribute array containing 36 entries. How does the `Geometry` class determine the total number of vertices?
    A. By multiplying position, color, and normal array lengths
    B. By checking the length of the data array stored in any attribute
    C. By reading the `Renderer` uniform variables
    D. By counting the number of `Material` render settings

13. A technical artist wants to apply an image onto a 3D rectangle and ensure the surface reacts accurately to a `Light` source. Which two pieces of data must the `Geometry` class store?
    A. Uniform objects and shader code
    B. Texture coordinates and normal vectors
    C. Point size and line width
    D. Parent reference and child list

14. Which class serves as a repository for shader code (and program reference), uniform objects, and render settings?
    A. `Geometry`
    B. `Renderer`
    C. `Material`
    D. `Light`

15. A developer needs to change a mesh's drawing mode from `triangles` to `lines` and adjust the `line width`. Which part of `Material` controls these properties?
    A. Uniform objects
    B. Render settings
    C. Shader program reference
    D. `Attribute` objects

16. Which of the following tasks is handled by the **base** `Material` class rather than its extensions?
    A. Supplying the actual shader code for a specific primitive
    B. Compiling shader program code and locating uniform variable references
    C. Calculating vertex positions from mathematical formulas
    D. Binding a VAO before drawing

17. A programmer calls the `Renderer`'s rendering function. Which two parameters must be passed to it?
    A. A `Geometry` object and a `Material` object
    B. A `Scene` object and a `Camera` object
    C. A `Mesh` object and a `Light` object
    D. A `Group` object and a `VAO`

18. Before calling the drawing function for a mesh, the `Renderer` performs four preparation tasks. Which of the following is NOT one of those tasks?
    A. Activating the correct shader program
    B. Binding a vertex array object
    C. Configuring render settings
    D. Calculating the total number of vertices

19. Most shaders require three uniform variables whose matrix values are stored outside the `Material` and copied in by the `Renderer` before sending to the GPU. Which of the following is NOT one of those three required uniform variables?
    A. Transformation of a mesh
    B. Transformation of the virtual camera
    C. Perspective transformation applied to all objects
    D. Normal vectors of the geometry

20. *(Definition Reversal)* "A virtual light source that affects the shading and shadows of objects in the scene." Which class role is this?
    A. `Camera`
    B. `Light`
    C. `Material`
    D. `Renderer`

21. *(Definition Reversal)* "A single matrix storing the accumulated transformations applied to an object relative to its parent object." Which term is this?
    A. World transformation
    B. Model matrix
    C. Modeling transformation
    D. Perspective transformation

22. In a tree with root `A`, `A` has children `B, C, D`; `B` has children `E, F`; and `D` has child `G`. Which nodes are **parent nodes**?
    A. A, B, C, D
    B. A, B, D
    C. B, C, D, E, F, G
    D. Only A

---

## 6. Last-Minute Cram Sheet

- A **scene graph** organizes 3D scene contents in a **tree-like** structure; every child node has **exactly 1 parent** except the **root node** (`Scene`), which has none.
- **Transform** = **location, orientation, and scale**, stored relative to the parent in a single **model matrix**.
- **World transformation** = transform relative to the **root**, calculated by multiplying the object's model matrix with those of **all its ancestors**.
- Multiple copies of a child object reuse the **same object**, while each arrow's **modeling transformation** differs.
- **`Object3D`** stores **3 items**: a transform matrix, a list of child references, and a parent reference.
- **8 framework roles**: `Scene` (root), `Group` (interior grouping), `Mesh` (renderable), `Camera` (POV), `Light` (shading/shadows), `Geometry` (shape/vertices), `Material` (appearance), `Renderer` (init & drawing).
- Each **`Mesh`** references a **VAO**, which links **`Geometry` vertex buffers** (via `Attribute`) to **`Material` shader attribute variables**.
- **`Geometry`** stores `Attribute` objects (position, color), **texture coordinates** (images), and **normal vectors** (lighting); total vertices = length of any attribute's data array.
- **`Geometry` subclasses**: rectangles/boxes list attribute data **directly**; polygons/cylinders/spheres use **mathematical formulas**.
- **`Material`** stores **3 items**: shader code (with program reference), **uniform objects**, and **render settings** (primitive type, point size, line width).
- Base **`Material`** initializes uniform/render-setting dictionaries, compiles shaders, and locates uniform references; extensions supply actual shader code, uniforms, and render settings.
- **`Renderer`**'s render function requires **2 parameters**: `scene` and `camera`.
- Before drawing each mesh, **`Renderer`** (1) activates shader program, (2) binds VAO, (3) configures render settings, (4) sends uniform values.
- **3 required uniform variables** copied by `Renderer` from outside `Material` before sending to GPU: **mesh transform**, **camera transform**, and **perspective transform**.

---

## Answer Key

1. **B â€” Scene graph.** The scene graph is the hierarchical, tree-like data structure at the heart of a 3D graphics framework. (A model matrix only stores one node's transform, not the whole scene hierarchy.)
2. **A â€” Compound object.** Grouping simple shapes under one shared parent node lets them be transformed as a single unit. (World transformation is a matrix calculation to the root, not the grouping structure itself.)
3. **C â€” The modeling transformation.** Each arrow connecting a child to a parent has its own modeling transformation while the child object itself stays the same. (The vertex data and `Geometry` are reused.)
4. **B â€” World transformation.** World transformation is the product of an object's model matrix and those of all its ancestors up to the root. (The model matrix alone is only relative to the immediate parent.)
5. **D â€” Color.** Transform refers strictly to location, orientation, and scale; color is a vertex property stored in `Attribute` objects.
6. **B â€” `Scene`.** `Scene` is the root node at the top of the tree with no parent. (`Group` is an interior node used for grouping.)
7. **D â€” A reference to a vertex array object (VAO).** `Object3D` stores transform matrix, child list, and parent reference; a VAO reference is stored by `Mesh`.
8. **A â€” `Group`.** `Group` is an interior node used for grouping purposes. (`Mesh` is for renderable objects, and `Scene` is the root.)
9. **B â€” Vertex Array Object (VAO).** A VAO associates vertex buffers (from `Geometry` attributes) to shader attribute variables (in `Material`). (Uniform objects hold shader uniform variables, not vertex buffer links.)
10. **C â€” `Geometry`.** `Geometry` holds vertex-related properties including `Attribute` objects, texture coordinates, and normal vectors. (`Material` holds shaders, uniforms, and render settings.)
11. **B â€” Calculated from mathematical formulas.** Polygons, cylinders, and spheres calculate attribute data from formulas, whereas rectangles and boxes list it directly.
12. **B â€” By checking the length of the data array stored in any attribute.** `Geometry` calculates total vertices directly from the length of an attribute's data array.
13. **B â€” Texture coordinates and normal vectors.** Texture coordinates apply images to shapes, and normal vectors are used in lighting calculations. (Uniforms and shaders belong to `Material`.)
14. **C â€” `Material`.** `Material` is the repository for shader code/program reference, uniform objects, and render settings. (`Renderer` executes the draw process using these.)
15. **B â€” Render settings.** Render settings control function-set properties such as geometric primitive type (points, lines, triangles), point size, and line width. (Uniform objects hold shader uniform values like matrices.)
16. **B â€” Compiling shader program code and locating uniform variable references.** The base `Material` class initializes dictionaries, compiles shaders, and locates uniforms, while extensions supply the actual shader code.
17. **B â€” A `Scene` object and a `Camera` object.** The `Renderer`'s rendering function requires these two parameters. (`Mesh` and `Light` live inside the `Scene`.)
18. **D â€” Calculating the total number of vertices.** Vertex count is calculated by `Geometry`, not by the `Renderer` during its pre-draw loop. (The other three are explicit pre-draw `Renderer` tasks.)
19. **D â€” Normal vectors of the geometry.** Normal vectors are stored in `Geometry`; the three required external uniforms are mesh transform, camera transform, and perspective transform.
20. **B â€” `Light`.** `Light` is the virtual light source affecting shading and shadows. (`Camera` controls the point of view.)
21. **B â€” Model matrix.** The model matrix stores the transform relative to the parent object, whereas world transformation is relative to the root.
22. **B â€” A, B, D.** Only A, B, and D have child nodes (successors); C, E, F, and G have no children.
