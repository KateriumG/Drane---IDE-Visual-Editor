import { state } from "../../core/state.js";
import { applyTransform } from "../../core/transform.js";
import { selectElement } from "../../core/selection.js";
import { on } from "../../core/events.js";


let  canvas;
let dragging = null;
let offsetX = 0;
let offsetY = 0;

let dragData = {};

// Este módulo se encarga del área central donde se crean y manipulan los elementos
export function initCanvas() {
  canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", (e) => {
  if (!state.selected) return;

  if (state.tool === "move" ||
      state.tool === "rotate" ||
      state.tool === "resize") {

    const rect = state.selected.getBoundingClientRect();

    dragging = state.selected;

    dragData = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startLeft: parseFloat(state.selected.style.left) || 0,
      startTop: parseFloat(state.selected.style.top) || 0,
      startWidth: rect.width,
      startHeight: rect.height,
      startRotation: parseFloat(state.selected.dataset.rotation || 0),
      startAngle: getMouseAngle(e, rect)
    };
  }
});

  // Escuchar eventos de transformación iniciados desde los handles
  on("startTransform", ({element, mouseX, mouseY}) => {
  dragging = element;

  const rect = element.getBoundingClientRect();

  const currentRotation =
  parseFloat(element.dataset.rotation || 0);

  // Calcular el ángulo inicial considerando la rotación actual
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const startAngle = Math.atan2(
    mouseY - centerY,
    mouseX - centerX
  ) * 180 / Math.PI;

  // Guardar datos iniciales para la transformación
  dragData = {
    startMouseX: mouseX,
    startMouseY: mouseY,
    startLeft: parseFloat(element.style.left) || 0,
    startTop: parseFloat(element.style.top) || 0,
    startWidth: rect.width,
    startHeight: rect.height,
    startRotation : parseFloat(element.dataset.rotation || 0),
    startAngle : startAngle
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

  el.addEventListener("mousedown", (e) => {
  selectElement(el);

  if (state.tool !== "select") return;

  dragging = el;

  const rect = el.getBoundingClientRect();

  dragData = {
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startLeft: parseFloat(el.style.left) || 0,
    startTop: parseFloat(el.style.top) || 0,
    startWidth: rect.width,
    startHeight: rect.height,
    startRotation: parseFloat(el.dataset.rotation || 0),
    startAngle: getMouseAngle(e, rect)
  };
});

  canvas.appendChild(el);

  makeInteractive(el);

  state.elements.push(el);
}

// interacción
function makeInteractive(el) {
  el.addEventListener("mousedown", (e) => {
    selectElement(el);

    if (state.tool !== "select") return;

    const rect = el.getBoundingClientRect();


   // Guardar datos iniciales para el movimiento
    dragData = {
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startLeft: parseFloat(el.style.left) || 0,
    startTop: parseFloat(el.style.top) || 0,
    startWidth: rect.width,
    startHeight: rect.height,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
    startRotation: parseFloat(el.dataset.rotation || 0),
    startAngle: getMouseAngle(e, rect)
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


function getMouseAngle(e, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return Math.atan2(
    e.clientY - centerY,
    e.clientX - centerX
  ) * 180 / Math.PI;
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
    state.handleDirection = null;
  });

  canvas.addEventListener("click", () => {
    selectElement(null);
  });
}