import { initCanvas } from "./modules/canvas/canvas.js";
import { initInspector } from "./modules/inspector/inspector.js";
import { initElementPanel } from "./modules/elementPanel/elementPanel.js";
import { initToolbar } from "./modules/toolbar/toolbar.js";
import { initHierarchy } from "./modules/hierarchy/hierarchy.js";
import { initHandles } from "./modules/handles/handles.js";


async function init() {
    await initInspector();
    await initElementPanel();
    await initToolbar();
    await initHierarchy();
    initCanvas();
    initHandles();
}

init();