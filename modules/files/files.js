import { getFiles, loadFile, getProject,renameFile,deleteFile } from "../../core/fileSystem.js";
import { restoreScene,loadSceneById } from "../../core/scene.js";
import { emit,on } from "../../core/events.js";
import { createElement } from "../canvas/canvas.js";

let container;
let contextMenu = null;

export function initFilesPanel() {
  container = document.getElementById("files-panel");

  loadFilesCSS();
  createContextMenu();
  renderFiles();

  on("filesChanged", renderFiles);
}

// Cargar el CSS del panel de archivos
function loadFilesCSS() {
  if (document.querySelector(
    'link[href="./modules/files/files.css"]'
  )) return;

    const link = document.createElement("link");    
    link.rel = "stylesheet";
    link.href = "./modules/files/files.css";
    document.head.appendChild(link);
}

// Crear el menú contextual para las acciones de los archivos
function createContextMenu() {
  contextMenu = document.createElement("div");
  contextMenu.className = "file-context-menu";

  contextMenu.innerHTML = `
    <div data-action="rename">Rename</div>
    <div data-action="delete">Delete</div>
  `;

  document.body.appendChild(contextMenu);

  document.addEventListener("click", () => {
    contextMenu.style.display = "none";
  });
}

// Obtener el proyecto actual desde localStorage o crear uno nuevo si no existe
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
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      showContextMenu(e.clientX, e.clientY, file);
    });

    container.appendChild(item);
  });
}

function showContextMenu(x, y, file) {
  contextMenu.style.display = "block";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";

  contextMenu.onclick = (e) => {
    const action = e.target.dataset.action;

    if (action === "rename") {
      renameFilePrompt(file.id);
    }

    if (action === "delete") {
      deleteFilePrompt(file.id);
    }

    contextMenu.style.display = "none";
  };
}

function renameFilePrompt(fileId) {
  const name = prompt("Nuevo nombre:");

  if (!name) return;

  renameFile(fileId, name);

  renderFiles();
}

function deleteFilePrompt(fileId) {
  const confirmed = confirm(
    "¿Eliminar esta escena?"
  );

  if (!confirmed) return;

  deleteFile(fileId);

  renderFiles();
}