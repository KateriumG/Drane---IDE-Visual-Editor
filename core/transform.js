import { state } from "./state.js";

// Este módulo se encarga de aplicar las transformaciones (mover, rotar, redimensionar)
export function applyTransform(e, el, dragData, canvas) {
  if (!el) return;

  switch (state.tool) {
    case "move":
      moveElement(e, el, dragData);
      break;

    case "rotate":
      rotateElement(e, el);
      break;

    case "resize":
      resizeElement(e, el, dragData);
      break;
  }
}

function moveElement(e, el, dragData) {
  const dx = e.clientX - dragData.startMouseX;
  const dy = e.clientY - dragData.startMouseY;

  el.style.left = dragData.startLeft + dx + "px";
  el.style.top = dragData.startTop + dy + "px";
}

function rotateElement(e, el) {
  const rect = el.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const angle = Math.atan2(
    e.clientY - centerY,
    e.clientX - centerX
  ) * 180 / Math.PI;

  el.style.transform = `rotate(${angle}deg)`;
}

function resizeElement(e, el, dragData) {
  const dx = e.clientX - dragData.startMouseX;
  const dy = e.clientY - dragData.startMouseY;

  el.style.width = dragData.startWidth + dx + "px";
  el.style.height = dragData.startHeight + dy + "px";
}