import { getFiles, loadFile, getProject } from "../../core/fileSystem.js";
import { restoreScene,loadSceneById } from "../../core/scene.js";
import { emit,on } from "../../core/events.js";
import { createElement } from "../canvas/canvas.js";

let container;

export function initFilesPanel() {
  container = document.getElementById("files-panel");

  loadFilesCSS();
  renderFiles();

  on("filesChanged", renderFiles);
}

function loadFilesCSS() {
  if (document.querySelector(
    'link[href="./modules/files/files.css"]'
  )) return;

    const link = document.createElement("link");    
    link.rel = "stylesheet";
    link.href = "./modules/files/files.css";
    document.head.appendChild(link);
}

export function renderFiles() {
  const files = getFiles();

  container.innerHTML = "";

  files.forEach(file => {
    const item = document.createElement("div");
    item.className = "file-item";
    item.textContent = file.name;

    const project = getProject();

    if (project.currentFile === file.id) {
        item.classList.add("active");
    }   

    item.addEventListener("click", () => {
      loadSceneById(file.id, createElement);
    });

    container.appendChild(item);
  });
}