import { state } from "../../core/state.js";
import { emit, on } from "../../core/events.js";

let container;
let buttons = [];

export async function initToolbar() {
  container = document.getElementById("upper-panel");

  const html = await fetch("./modules/toolbar/toolbar.html")
    .then(res => res.text());

  container.innerHTML = html;

  cacheElements();
  bindEvents();
  updateActiveTool();

  on("toolChanged", updateActiveTool);
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