import { state } from "./state.js";
import { on, emit } from "./events.js";
import { syncDOMHierarchy } from "./hierarchy-sync.js";

export function serializeScene() {
  return state.elements.map(el => ({
    id: el.dataset.elementId,
    tag: el.tagName.toLowerCase(),
    text: el.innerText,
    left: el.style.left,
    top: el.style.top,
    width: el.style.width,
    height: el.style.height,
    color: el.style.color,
    background: el.style.backgroundColor,
    border: el.style.border,
    rotation: el.dataset.rotation || 0,
    parentId: el.dataset.parentId || ""
  }));
}

export function saveScene() {
  const data = serializeScene();

  localStorage.setItem(
    "drane_scene",
    JSON.stringify(data)
  );

}

let autosaveTimer = null;

export function queueAutosave() {
  clearTimeout(autosaveTimer);

  autosaveTimer = setTimeout(() => {
    saveScene();
  }, 500);
}

export function initSceneAutosave() {
  on("sceneChanged", queueAutosave);
}

export function loadScene() {
  const raw = localStorage.getItem("drane_scene");

  if (!raw) return null;

  return JSON.parse(raw);
}

export function restoreScene(data, createElement) {
  if (!data) return;

  state.elements.forEach(el => el.remove());
  state.elements = [];

  data.forEach(item => {
    const el = createElement(item.tag, true);

    el.dataset.elementId = item.id;
    el.dataset.parentId = item.parentId;
    el.dataset.rotation = item.rotation;

    el.innerText = item.text;
    el.style.left = item.left;
    el.style.top = item.top;
    el.style.width = item.width;
    el.style.height = item.height;
    el.style.color = item.color;
    el.style.backgroundColor = item.background;
    el.style.border = item.border;
    el.style.transform = `rotate(${item.rotation}deg)`;
  });

    syncDOMHierarchy();
    emit("selectionChanged", null);
}