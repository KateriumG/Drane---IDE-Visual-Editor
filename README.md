# Drane — Visual Web Editor

Drane es un editor visual inspirado en Godot, pero diseñado para crear páginas web mediante HTML, CSS y JavaScript.

En lugar de escribir todo manualmente:

* arrastras elementos
* editas propiedades
* organizas jerarquías
* guardas escenas

---

# Estructura del proyecto

```bash
drane/
├── core/
│   ├── state.js
│   ├── events.js
│   ├── selection.js
│   ├── transform.js
│   ├── hierarchy-sync.js
│   └── scene.js
│
├── modules/
│   ├── header/
│   ├── canvas/
│   ├── inspector/
│   ├── hierarchy/
│   ├── handles/
│   └── palette/
│
├── utils/
│   └── helpers.js
│
├── main.js
└── index.html
```

---

# Qué hace cada carpeta

---

## /core

Contiene la lógica principal del editor.

### state.js

Guarda el estado global del editor.

Ejemplo:

```js
state.selected
state.elements
state.tool
```

Aquí se cambia el comportamiento global.

---

### events.js

Sistema de comunicación entre módulos.

Permite:

```js
emit("selectionChanged")
on("selectionChanged")
```

Sirve para que los módulos hablen entre sí sin depender unos de otros.

---

### selection.js

Controla qué elemento está seleccionado.

Responsable de:

* seleccionar
* deseleccionar
* actualizar UI relacionada

---

### transform.js

Aplica transformaciones.

Responsable de:

* mover
* rotar
* resize

---

### hierarchy-sync.js

Sincroniza:

```text
Hierarchy UI → DOM real
```

Convierte parent/child en elementos reales dentro del canvas.

---

### scene.js

Guarda y carga escenas.

Responsable de:

* serializar
* guardar
* restaurar

---

# /modules

Cada panel del editor es un módulo independiente.

---

## header/

Barra superior del editor.

Contiene:

* Scene
* Layout / Code
* Test
* Assets
* Settings

---

## canvas/

Zona central del editor.

Responsable de:

* crear elementos
* mostrar elementos
* manipular elementos

---

## inspector/

Panel derecho.

Permite modificar:

* texto
* colores
* borde
* tamaño
* propiedades futuras

---

## hierarchy/

Panel izquierdo.

Permite:

* parentar
* desparentar
* reordenar elementos

---

## handles/

Handles visuales.

Responsable de:

* resize handles
* rotate handle
* overlay visual

---

## palette/

Panel para crear nuevos elementos.

Ejemplo:

* div
* button
* h1

---

# Dónde modificar cada cosa

---

## Para agregar un nuevo elemento

Ir a:

```bash
modules/palette/
```

y luego conectar en:

```bash
modules/canvas/canvas.js
```

---

## Para agregar nuevas propiedades

Ir a:

```bash
modules/inspector/
```

---

## Para cambiar cómo se mueve un objeto

Ir a:

```bash
core/transform.js
```

---

## Para cambiar la jerarquía

Ir a:

```bash
modules/hierarchy/
```

y

```bash
core/hierarchy-sync.js
```

---

## Para guardar más información

Ir a:

```bash
core/scene.js
```

---

# Flujo del editor

El flujo interno es:

```text
User action
   ↓
Module
   ↓
emit(event)
   ↓
Core updates state
   ↓
Other modules react
```

Ejemplo:

```text
click element
↓
selection.js
↓
emit("selectionChanged")
↓
handles.js updates
inspector.js updates
hierarchy.js updates
```

---

# Cómo añadir nuevas herramientas

Las herramientas se controlan desde:

```bash
state.tool
```

Valores actuales:

```js
"select"
"move"
"rotate"
"resize"
```

Para añadir una nueva:

1. agregar en toolbar
2. agregar en state
3. agregar en transform.js
4. actualizar handles si es necesario

---

# Regla importante del proyecto

Nunca mezclar lógica de módulos.

---

## Correcto

Canvas:

```text
solo dibuja y transforma
```

Hierarchy:

```text
solo organiza estructura
```

Inspector:

```text
solo cambia propiedades
```

---

## Incorrecto

No poner:

```text
lógica del hierarchy dentro del canvas
```

porque vuelve el proyecto difícil de mantener.

---

# Cómo guardar escenas

Las escenas se guardan como JSON.

Ejemplo:

```json
[
  {
    "tag": "div",
    "left": "100px",
    "top": "50px",
    "parentId": ""
  }
]
```

---

# Qué hacer después

Siguientes mejoras recomendadas:

* exportar HTML real
* editor de código
* sistema de plugins
* prefabs/components
* undo/redo
* multi-select
* grid snapping
* zoom del canvas

---

# Filosofía del proyecto

Drane debe funcionar como:

```text
Godot para páginas web
```

Objetivo:

```text
Diseñar visualmente
sin perder control del código
```

---

# Regla final

Antes de tocar algo:

pregunta siempre:

```text
¿Esto pertenece al core o a un módulo?
```

Si la respuesta es clara,
la arquitectura seguirá limpia.
