import { state } from "./state.js";

export function applyTransform(e, el, offsetX, offsetY, canvas) {
  if (!el) return;

  switch (state.tool) {
    case "move":
      moveElement(e, el, offsetX, offsetY, canvas);
      break;

    case "rotate":
      rotateElement(e, el);
      break;

    case "resize":
      resizeElement(e, el, canvas);
      break;
  }
}

function moveElement(e, el, offsetX, offsetY, canvas) {
  const rect = canvas.getBoundingClientRect();

  el.style.left = (e.clientX - rect.left - offsetX) + "px";
  el.style.top = (e.clientY - rect.top - offsetY) + "px";
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

function resizeElement(e, el) {
  const rect = el.getBoundingClientRect();

  const newWidth = e.clientX - rect.left;
  const newHeight = e.clientY - rect.top;

  el.style.width = newWidth + "px";
  el.style.height = newHeight + "px";
}