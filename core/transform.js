import { state } from "./state.js";

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
    case "move":
      moveElement(e, el, dragData);
      break;

    case "rotate":
      rotateElement(e, el, dragData);
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

  let width = dragData.startWidth;
  let height = dragData.startHeight;
  let left = dragData.startLeft;
  let top = dragData.startTop;

  const minSize = 20;

  switch (state.handleDirection) {
    case "br":
      width = Math.max(minSize, dragData.startWidth + dx);
      height = Math.max(minSize, dragData.startHeight + dy);
      break;

    case "tr":
      width = Math.max(minSize, dragData.startWidth + dx);

      const newHeightTR = dragData.startHeight - dy;
      if (newHeightTR >= minSize) {
        height = newHeightTR;
        top = dragData.startTop + dy;
      }
      break;

    case "bl":
      const newWidthBL = dragData.startWidth - dx;
      if (newWidthBL >= minSize) {
        width = newWidthBL;
        left = dragData.startLeft + dx;
      }

      height = Math.max(minSize, dragData.startHeight + dy);
      break;

    case "tl":
      const newWidthTL = dragData.startWidth - dx;
      if (newWidthTL >= minSize) {
        width = newWidthTL;
        left = dragData.startLeft + dx;
      }

      const newHeightTL = dragData.startHeight - dy;
      if (newHeightTL >= minSize) {
        height = newHeightTL;
        top = dragData.startTop + dy;
      }
      break;
  }

    width = Math.max(minSize, width);
  height = Math.max(minSize, height);

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