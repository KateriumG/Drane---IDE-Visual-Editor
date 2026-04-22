import { initHeader } from "./modules/header/header.js";
import { initCanvas } from "./modules/canvas/canvas.js";
import { initInspector } from "./modules/inspector/inspector.js";
import { initElementPanel } from "./modules/elementPanel/elementPanel.js";
import { initToolbar } from "./modules/toolbar/toolbar.js";
import { initHierarchy } from "./modules/hierarchy/hierarchy.js";
import { initHandles } from "./modules/handles/handles.js";
import { initSceneAutosave } from "./core/scene.js";
import { pushHistory } from "./core/history.js";



async function init() {
    await initInspector();
    await initElementPanel();
    await initToolbar();
    await initHierarchy();
    initCanvas();
    initHeader();
    initHandles();
    initSceneAutosave();
    pushHistory();
}

init();

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    undo(createElement);
  }

  if (e.ctrlKey && e.key === "y") {
    e.preventDefault();
    redo(createElement);
  }
});