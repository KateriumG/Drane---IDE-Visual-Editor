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
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    const zoomAmount = e.deltaY * -0.001;

    state.canvasZoom += zoomAmount;

    state.canvasZoom = Math.min(
      Math.max(0.25, state.canvasZoom),
      3
    );

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