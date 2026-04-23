import { state } from "./state.js";
import { emit } from "./events.js";

let canvas;

export function initViewport() {
  canvas = document.getElementById("canvas");

  setupZoom();
  setupPan();
  updateViewport();
}

export function updateViewport() {
  canvas.style.transform =
    `translate(${state.canvasOffsetX}px, ${state.canvasOffsetY}px) scale(${state.canvasZoom})`;

  canvas.style.transformOrigin = "0 0";

  emit("selectionChanged", state.selected);
}

function setupZoom() {
  const viewport = document.getElementById("canvas-viewport");

  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    const oldZoom = state.canvasZoom;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

    const newZoom = Math.min(
      Math.max(0.25, oldZoom * zoomFactor),
      4
    );

    const rect = viewport.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX =
      (mouseX - state.canvasOffsetX) / oldZoom;

    const worldY =
      (mouseY - state.canvasOffsetY) / oldZoom;

    state.canvasZoom = newZoom;

    state.canvasOffsetX =
      mouseX - worldX * newZoom;

    state.canvasOffsetY =
      mouseY - worldY * newZoom;

    updateViewport();
  });
}

// Pan the canvas by holding space and dragging the mouse
function setupPan() {
  let startX = 0;
  let startY = 0;

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      state.isPanning = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      state.isPanning = false;
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    if (!state.isPanning) return;

    startX = e.clientX - state.canvasOffsetX;
    startY = e.clientY - state.canvasOffsetY;

    const move = (ev) => {
      state.canvasOffsetX = ev.clientX - startX;
      state.canvasOffsetY = ev.clientY - startY;

      updateViewport();
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}