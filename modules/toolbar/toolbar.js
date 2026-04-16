import { state } from "../../core/state.js";
import { emit, on } from "../../core/events.js";

let container;
let buttons = [];

// Este módulo se encarga de la barra de herramientas superior (mover, rotar, redimensionar)
export async function initToolbar() {
  container = document.getElementById("upper-panel");

  const html = await fetch("./modules/toolbar/toolbar.html")
    .then(res => res.text());

  container.innerHTML = html;

  loadToolbarCSS();
  cacheElements();
  bindEvents();
  updateActiveTool();

  on("toolChanged", updateActiveTool);
}

export function loadToolbarCSS() {
  if (!document.querySelector('link[href="./modules/toolbar/toolbar.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./modules/toolbar/toolbar.css";
    document.head.appendChild(link);
  }
}

function cacheElements() {
  buttons = container.querySelectorAll("[data-tool]");
}

function bindEvents() {
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;

      state.tool = tool;

      emit("toolChanged", tool);
    });
  });
}

function updateActiveTool() {
  buttons.forEach(btn => {
    btn.classList.toggle(
      "active-tool",
      btn.dataset.tool === state.tool
    );
  });
}