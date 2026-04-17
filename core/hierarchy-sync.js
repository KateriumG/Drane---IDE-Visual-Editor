import { state } from "./state.js";

export function syncDOMHierarchy() {
    const canvas = document.getElementById("canvas");

    if (!canvas) return;

    const positions = new Map();

  state.elements.forEach(el => {
    positions.set(el.dataset.elementId, {
      left: el.style.left,
      top: el.style.top
    });
  });

    canvas.innerHTML = "";

    const roots = state.elements.filter(
        el => !el.dataset.parentId
    );

    roots.forEach(el => {
        buildDOM(el, canvas, positions);
    });
}

function buildDOM(el, parent, positions) {
    parent.appendChild(el);

    const pos = positions.get(el.dataset.elementId);

    if (pos) {
        el.style.left = pos.left;
        el.style.top = pos.top;
    }

    const children = state.elements.filter(
        child => child.dataset.parentId === el.dataset.elementId
    );

    children.forEach(child => {
        buildDOM(child, el, positions);
    });
}

export function convertToLocalPosition(child, parent) {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const localLeft = childRect.left - parentRect.left;
  const localTop = childRect.top - parentRect.top;

  child.style.left = localLeft + "px";
  child.style.top = localTop + "px";
}

export function convertToGlobalPosition(child) {
  const parent = child.parentElement;
  const canvas = document.getElementById("canvas");

  if (!parent || parent === canvas) return;

  const childRect = child.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  const globalLeft = childRect.left - canvasRect.left;
  const globalTop = childRect.top - canvasRect.top;

  child.style.left = globalLeft + "px";
  child.style.top = globalTop + "px";
}