import { state } from "./state.js";
import { emit } from "./events.js";

// Este módulo se encarga de aplicar las transformaciones (mover, rotar, redimensionar)
export function applyTransform(e, el, dragData, canvas) {
  if (!el) return;

    if (state.handleAction === "resize") {
    resizeElement(e, el, dragData);
    return;
  }

  if (state.handleAction === "rotate") {
    rotateElement(e, el, dragData);
    return;
  }

  switch (state.tool) {
    case "select":
      moveElement(e, el, dragData);
      break;
    case "move":
      moveElement(e, el, dragData);
      break;

    case "rotate":
      rotateElement(e, el, dragData);
      break;

    case "resize":
      globalResize(e, el, dragData)
      break;
  }
  emit("selectionChanged", el);
  emit("sceneChanged");
}

function moveElement(e, el, dragData) {
  const dx = e.clientX - dragData.startMouseX;
  const dy = e.clientY - dragData.startMouseY;

  el.style.left = dragData.startLeft + dx + "px";
  el.style.top = dragData.startTop + dy + "px";
}

function rotateElement(e, el, dragData) {
  const rect = el.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const currentAngle = Math.atan2(
    e.clientY - centerY,
    e.clientX - centerX
  ) * 180 / Math.PI;

  const deltaAngle = currentAngle - dragData.startAngle;

  const finalAngle = dragData.startRotation + deltaAngle;

  el.dataset.rotation = finalAngle;
  el.style.transform = `rotate(${finalAngle}deg)`;
}

function resizeElement(e, el, dragData) {
  const dx = e.clientX - dragData.startMouseX;
  const dy = e.clientY - dragData.startMouseY;

  const threshold = 2;

if (Math.abs(dx) < threshold) dx = 0;
if (Math.abs(dy) < threshold) dy = 0;

  let width = dragData.startWidth;
  let height = dragData.startHeight;
  let left = dragData.startLeft;
  let top = dragData.startTop;

  const minSize = 20;

  if (state.handleDirection === "br") {
    width = Math.max(minSize, dragData.startWidth + dx);
    height = Math.max(minSize, dragData.startHeight + dy);
  }
  if (state.handleDirection === "tr") {
    width = Math.max(minSize, dragData.startWidth + dx);

    const newHeight = dragData.startHeight - dy;
    height = Math.max(minSize, newHeight);

    top = dragData.startTop + (dragData.startHeight - height);
  }
  if (state.handleDirection === "bl") {
    const newWidth = dragData.startWidth - dx;
    width = Math.max(minSize, newWidth);

    left = dragData.startLeft + (dragData.startWidth - width);

    height = Math.max(minSize, dragData.startHeight + dy);
  }
  if (state.handleDirection === "tl") {
    const newWidth = dragData.startWidth - dx;
    width = Math.max(minSize, newWidth);

    const newHeight = dragData.startHeight - dy;
    height = Math.max(minSize, newHeight);

    left = dragData.startLeft + (dragData.startWidth - width);
    top = dragData.startTop + (dragData.startHeight - height);
  }

  el.style.width = width + "px";
  el.style.height = height + "px";
  el.style.left = left + "px";
  el.style.top = top + "px";

}

function globalResize(e, el, dragData) {
  const dx = e.clientX - dragData.startMouseX;
  const dy = e.clientY - dragData.startMouseY;

  const minSize = 20;

  el.style.width =
    Math.max(minSize, dragData.startWidth + dx) + "px";

  el.style.height =
    Math.max(minSize, dragData.startHeight + dy) + "px";
}