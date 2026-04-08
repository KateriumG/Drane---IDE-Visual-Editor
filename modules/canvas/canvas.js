import { state } from "../../core/state.js";
import { applyTransform } from "../../core/transform.js";
import { selectElement } from "../../core/selection.js";

let canvas;
let dragging = null;
let offsetX = 0;
let offsetY = 0;

export function initCanvas() {
  canvas = document.getElementById("canvas");

  setupUI();
  setupGlobalEvents();
}

// botones crear
function setupUI() {
  document.getElementById("btn-div")
    .addEventListener("click", () => createElement("div"));

  document.getElementById("btn-button")
    .addEventListener("click", () => createElement("button"));

  document.getElementById("btn-h1")
    .addEventListener("click", () => createElement("h1"));
}

// crear elementos
function createElement(type) {
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
    dragging = el;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
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

    applyTransform(e, dragging, offsetX, offsetY, canvas);
  });

  document.addEventListener("mouseup", () => {
    dragging = null;
  });

  canvas.addEventListener("click", () => {
    selectElement(null);
  });
}