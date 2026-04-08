import { applyTransform } from "./core/transform";

const canvas = document.getElementById("canvas");

let selected = null;
let dragging = null;
let offsetX = 0;
let offsetY = 0;

const textInput = document.getElementById("prop-text");
const borderInput = document.getElementById("prop-border");
const bgInput = document.getElementById("prop-bg");
const colorInput = document.getElementById("prop-color");

// Manejar la UI

document.getElementById("btn-div").addEventListener("click", () => {
  createElement("div");
});

document.getElementById("btn-button").addEventListener("click", () => {
  createElement("button");
});

document.getElementById("btn-h1").addEventListener("click", () => {
  createElement("h1");
});

// Crear elementos
function createElement(type) {

  const el = document.createElement(type);

  el.classList.add("draggable");
  el.innerText = type;

  el.style.left = "50px";
  el.style.top = "50px";

  canvas.appendChild(el);

  makeDraggable(el);
}

// Hacer draggable
function makeDraggable(el) {
  el.addEventListener("mousedown", (e) => {
    dragging = el;

    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });

  el.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".selected")
      .forEach(el => el.classList.remove("selected"));

    el.classList.add("selected");
    selected = el;

    loadInspector(el);
  });
}

function loadInspector(el) {
  textInput.value = el.innerText || "";

  borderInput.checked = el.style.border !== "none";

  bgInput.value = rgbToHex(el.style.backgroundColor || "#ffffff");

  colorInput.value = rgbToHex(el.style.color || "#000000");

  // 👇 ocultar bg si es h1
  if (el.tagName === "H1") {
    bgInput.disabled = true;
  } else {
    bgInput.disabled = false;
  }
}

textInput.addEventListener("input", () => {
  if (selected) {
    selected.innerText = textInput.value;
  }
});

borderInput.addEventListener("change", () => {
  if (selected) {
    selected.style.border = borderInput.checked
      ? "1px solid black"
      : "none";
  }
});

bgInput.addEventListener("input", () => {
  if (selected && selected.tagName !== "H1") {
    selected.style.backgroundColor = bgInput.value;
  }
});

colorInput.addEventListener("input", () => {
  if (selected) {
    selected.style.color = colorInput.value;
  }
});

function rgbToHex(rgb) {
  if (!rgb) return "#ffffff";

  if (rgb.startsWith("#")) return rgb;

  const result = rgb.match(/\d+/g);
  if (!result) return "#ffffff";

  return "#" + result.map(x =>
    parseInt(x).toString(16).padStart(2, "0")
  ).join("");
}

// 🧲 Movimiento global
document.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  applyTransform(e);
});

// 🛑 Soltar
document.addEventListener("mouseup", () => {
  dragging = null;
});