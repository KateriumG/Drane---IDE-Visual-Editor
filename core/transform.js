import { state } from "./state.js";

export function applyTransform(e, el, offsetX, offsetY, canvas) {
  if (!el) return;

  if (state.tool === "select" || state.tool === "move") {
    const rect = canvas.getBoundingClientRect();

    el.style.left = (e.clientX - rect.left - offsetX) + "px";
    el.style.top = (e.clientY - rect.top - offsetY) + "px";
  }
}