import { state } from "../../core/state.js";
import { on,emit } from "../../core/events.js";
import { selectElement } from "../../core/selection.js";

let list;

export async function initHierarchy() {
    const container = document.getElementById("bottomLeft-panel");
  
    const html = await fetch("./modules/hierarchy/hierarchy.html")
      .then(res => res.text());
  
    container.innerHTML = html;
  
    list = document.getElementById("hierarchy-list");

    const rootDrop = document.getElementById("hierarchy-root-drop");

    rootDrop.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    rootDrop.addEventListener("drop", (e) => {
      e.preventDefault();

      const draggedId = e.dataTransfer.getData("text/plain");

      const draggedEl = state.elements.find(
        item => item.dataset.elementId === draggedId
      );

      if (!draggedEl) return;

      draggedEl.dataset.parentId = "";

      emit("selectionChanged", state.selected);
    });
  
    on("selectionChanged", renderHierarchy);
  
    loadHierarchyCSS();
    renderHierarchy();
  }

  function loadHierarchyCSS(){
    if (!document.querySelector('link[href="./modules/hierarchy/hierarchy.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./modules/hierarchy/hierarchy.css";
        document.head.appendChild(link);
    }
  }

  function renderHierarchy() {
    if (!list) return;
  
    list.innerHTML = "";
    
  
    const roots = state.elements.filter(el => !el.dataset.parentId);
  
    roots.forEach(el => {
      list.appendChild(createTreeItem(el));
    });
  }

  // Crear un elemento de la jerarquía para un elemento dado
  function createTreeItem(el) {

    // Estructura del árbol: dropTop + content + dropBottom
    const wrapper = document.createElement("div");
    wrapper.className = "tree-wrapper";

    const dropTop = document.createElement("div");
    dropTop.className = "drop-zone";

    const content = document.createElement("div");
    content.className = "hierarchy-item";

    const dropBottom = document.createElement("div");
    dropBottom.className = "drop-zone";


    if (state.selected === el) {
      content.classList.add("active");
    }
  
    content.textContent = el.tagName.toLowerCase();
    content.draggable = true;

    wrapper.appendChild(dropTop);
    wrapper.appendChild(content);
    wrapper.appendChild(dropBottom);



  
    // Permitir soltar otros elementos antes de este elemento para reordenar
    dropTop.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropTop.classList.add("active");
    });

    dropTop.addEventListener("dragleave", () => {
      dropTop.classList.remove("active");
    });

    dropTop.addEventListener("drop", (e) => {
      e.preventDefault();

       const draggedEl = getDraggedElement(e);
  if (!draggedEl || draggedEl === el) return;
  if (isChildOf(el, draggedEl)) return;

      dropTop.classList.remove("active");

      reorderElement(e, el, "before");
    });




    // Permitir soltar otros elementos dentro de este elemento para hacerlos hijos
    content.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", el.dataset.elementId);
    });

    content.addEventListener("dragover", (e) => {
  e.preventDefault(); // 🔥 ESTO ES LO QUE FALTA
});

    content.addEventListener("dragenter", () => {
      content.classList.add("active");
    });

    content.addEventListener("drop", (e) => {
      e.preventDefault();
      content.classList.remove("active");

      const draggedEl = getDraggedElement(e);
      if (!draggedEl || draggedEl === el) return;
      if (isChildOf(el, draggedEl)) return;

      draggedEl.dataset.parentId = el.dataset.elementId;

      emit("selectionChanged", state.selected);
    });

    content.addEventListener("click", () => {
      selectElement(el);
    });

    content.addEventListener("dragleave", () => {
      content.classList.remove("active");
    });


    // Permitir soltar otros elementos después de este elemento para reordenar
    dropBottom.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropBottom.classList.add("active");
    });
    dropBottom.addEventListener("drop", (e) => {
      e.preventDefault();

        const draggedEl = getDraggedElement(e);
  if (!draggedEl || draggedEl === el) return;
  if (isChildOf(el, draggedEl)) return;

      dropBottom.classList.remove("active");

      reorderElement(e, el, "after");
    });
    dropBottom.addEventListener("dragleave", () => {
      dropBottom.classList.remove("active");
    });

    const children = state.elements.filter(
      child => child.dataset.parentId === el.dataset.elementId
    ); 

    if (children.length > 0) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-children";

      children.forEach(child => {
        childrenContainer.appendChild(createTreeItem(child));
      });

    wrapper.appendChild(childrenContainer);
  }

    return wrapper;
  }

  function getDraggedElement(e) {
    const id = e.dataTransfer.getData("text/plain");

    return state.elements.find(
      item => item.dataset.elementId === id
    );
  } 

function isChildOf(parent, child) {
  let current = parent;

  while (current) {
    if (current === child) return true;

    current = state.elements.find(
      item => item.dataset.elementId === current.dataset.parentId
    );
  }

  return false;
}

  function reorderElement(e, targetEl, position) {
    const draggedEl = getDraggedElement(e);
    if (!draggedEl || draggedEl === targetEl) return;

    if (isChildOf(targetEl, draggedEl)) return;

    draggedEl.dataset.parentId = targetEl.dataset.parentId;

    const fromIndex = state.elements.indexOf(draggedEl);
    let toIndex = state.elements.indexOf(targetEl);

    if (position === "after") {
      toIndex++;
    }

    moveInArray(state.elements, fromIndex, toIndex);

    emit("selectionChanged", state.selected);
  }

  // Función auxiliar para mover un elemento dentro de un array
function moveInArray(array, fromIndex, toIndex) {
  const item = array.splice(fromIndex, 1)[0];

  if (fromIndex < toIndex) {
    toIndex--;
  }

  array.splice(toIndex, 0, item);
}