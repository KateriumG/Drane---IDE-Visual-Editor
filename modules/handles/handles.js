import { on,emit } from "../../core/events.js";
import { state } from "../../core/state.js";


let handlesContainer = null;

// Este módulo se encarga de mostrar los handles de transformación (mover, rotar, redimensionar)
export function initHandles() {
  handlesContainer = document.createElement("div");
  handlesContainer.id = "transform-handles";

    loadHandlesCSS();

  document.getElementById("canvas").appendChild(handlesContainer);

  on("selectionChanged", updateHandles);
  on("toolChanged", refreshHandlesVisibility);
}

function refreshHandlesVisibility() {
  if (!state.selected) {
    handlesContainer.style.display = "none";
    return;
  }

  if (state.tool !== "select") {
    handlesContainer.style.display = "none";
    return;
  }

  updateHandles(state.selected);
}

function loadHandlesCSS(){
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./modules/handles/handles.css";
    document.head.appendChild(link);
}

function createHandles() {
  handlesContainer.innerHTML = "";

  const corners = ["tl", "tr", "bl", "br"];

  corners.forEach(pos => {
    const handle = document.createElement("div");
    handle.className = `resize-handle ${pos}`;

    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();

      state.handleAction = "resize";
      state.handleDirection = pos;

      emit("startTransform", { 
        element: state.selected,
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
    });

    handlesContainer.appendChild(handle);
  });

  const rotate = document.createElement("div");
  rotate.className = "rotate-handle";

  rotate.addEventListener("mousedown", (e) => {
    e.stopPropagation();

    state.handleAction = "rotate";
    state.handleDirection = "rotate";

    emit("startTransform", {
        element: state.selected,
        mouseX: e.clientX,
        mouseY: e.clientY
    });
  });

  handlesContainer.appendChild(rotate);
}

// Actualiza la posición y visibilidad de los handles según el elemento seleccionado
function updateHandles(el) {
  if (!el || state.tool !== "select") {
    handlesContainer.style.display = "none";
    return;
  }

  createHandles();

  const rect = el.getBoundingClientRect();
  const canvasRect = document.getElementById("canvas").getBoundingClientRect();

  handlesContainer.style.display = "block";
  handlesContainer.style.left = rect.left - canvasRect.left + "px";
  handlesContainer.style.top = rect.top - canvasRect.top + "px";
  handlesContainer.style.width = rect.width + "px";
  handlesContainer.style.height = rect.height + "px";
}