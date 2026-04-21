import { state } from "../../core/state.js";
import { on } from "../../core/events.js";
import { rgbToHex } from "../../utils/dom.js";

let textInput, borderInput, bgInput, colorInput;

// Este módulo se encarga del panel lateral derecho que muestra las propiedades del elemento seleccionado
export async function initInspector() {
  const container = document.getElementById("right-panel");

  const html = await fetch("./modules/inspector/inspector.html")
    .then(res => res.text());

  container.innerHTML = html;

  cacheElements();
  bindEvents();

  on("selectionChanged", updateInspector);
}

export function cacheElements() {
  textInput = document.getElementById("prop-text");
  borderInput = document.getElementById("prop-border");
  bgInput = document.getElementById("prop-bg");
  colorInput = document.getElementById("prop-color");
}

function bindEvents() {
  textInput.addEventListener("input", () => {
    if (state.selected) {
      state.selected.innerText = textInput.value;
      emit("sceneChanged");
    }
  });

  borderInput.addEventListener("change", () => {
    if (state.selected) {
      state.selected.style.border = borderInput.checked
        ? "1px solid black"
        : "none";
    }
  });

  bgInput.addEventListener("input", () => {
    if (state.selected && state.selected.tagName !== "H1") {
      state.selected.style.backgroundColor = bgInput.value;
    }
  });

  colorInput.addEventListener("input", () => {
    if (state.selected) {
      state.selected.style.color = colorInput.value;
    }
  });
}

function updateInspector(el) {
  if (!el) return;

  textInput.value = el.innerText || "";
  borderInput.checked = el.style.border !== "none";
  bgInput.value = rgbToHex(el.style.backgroundColor || "#ffffff");
  colorInput.value = rgbToHex(el.style.color || "#000000");

  bgInput.disabled = el.tagName === "H1";
}