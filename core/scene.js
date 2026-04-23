import { state } from "./state.js";
import { on, emit } from "./events.js";
import { syncDOMHierarchy } from "./hierarchy-sync.js";
import { saveCurrentFile,loadFile } from "./fileSystem.js";

// Scene management: serialization, saving, loading, and autosave
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
  saveCurrentFile(serializeScene());
}

let autosaveTimer = null;

export function queueAutosave() {
  clearTimeout(autosaveTimer);

  autosaveTimer = setTimeout(() => {
    saveScene();
  }, 500);
}

// Initialize autosave on scene changes
export function initSceneAutosave() {
  on("sceneChanged", queueAutosave);
}

export function loadSceneById(fileId, createElement) {
  const file = loadFile(fileId);

  if (!file) return;

  clearScene();
  restoreScene(file.data, createElement);

  emit("filesChanged")
}

export function restoreScene(data, createElement) {
  if (!data) return;

  clearScene();

  data.forEach(item => {
    const el = createElement(item.tag, true);

    el.dataset.elementId = item.id;
    el.dataset.parentId = item.parentId || "";
    el.dataset.rotation = item.rotation || 0;

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

export function clearScene() {
  state.elements.forEach(el => el.remove());

  state.elements = [];
  state.selected = null;

  emit("selectionChanged", null);
}