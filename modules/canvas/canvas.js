import { state } from "../../core/state.js";
import { applyTransform } from "../../core/transform.js";
import { selectElement } from "../../core/selection.js";
import { on } from "../../core/events.js";


let canvas;
let dragging = null;
let offsetX = 0;
let offsetY = 0;

let dragData = {};

// Este módulo se encarga del área central donde se crean y manipulan los elementos
export function initCanvas() {
  canvas = document.getElementById("canvas");

  on("startTransform", ({element, mouseX, mouseY}) => {
  dragging = element;

  const rect = element.getBoundingClientRect();

  dragData = {
    startMouseX: mouseX,
    startMouseY: mouseY,
    startLeft: parseFloat(element.style.left) || 0,
    startTop: parseFloat(element.style.top) || 0,
    startWidth: rect.width,
    startHeight: rect.height
  };
});

  setupGlobalEvents();
}

// crear elementos
export function createElement(type) {
  const el = document.createElement(type);

  el.classList.add("draggable");
  el.innerText = type;

  el.style.left = "50px";
  el.style.top = "50px";

  canvas.appendChild(el);

  makeInteractive(el);

  state.elements.push(el);
}

// interacción
function makeInteractive(el) {
  el.addEventListener("mousedown", (e) => {
    selectElement(el);

    const rect = el.getBoundingClientRect();

    dragData = {
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startLeft: parseFloat(el.style.left) || 0,
    startTop: parseFloat(el.style.top) || 0,
    startWidth: rect.width,
    startHeight: rect.height,
    offsetX: e.offsetX,
    offsetY: e.offsetY
  };


    if (state.tool !== "select") {
      dragging = el;
    }
  });

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(el);
  });

}

// eventos globales
function setupGlobalEvents() {
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    applyTransform(e, dragging, dragData, canvas);
  });

  document.addEventListener("mouseup", () => {
    dragging = null;
    state.handleAction = null;
  });

  canvas.addEventListener("click", () => {
    selectElement(null);
  });
}