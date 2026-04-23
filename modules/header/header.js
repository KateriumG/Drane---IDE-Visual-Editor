import {
  createFile,
  saveCurrentFile,
  getProject
} from "../../core/fileSystem.js";

import {
  serializeScene,
  clearScene
} from "../../core/scene.js";

import { renderFiles } from "../files/files.js";

export async function initHeader() {
  const container = document.getElementById("top-panel");

  const html = await fetch("./modules/header/header.html")
    .then(res => res.text());

  container.innerHTML = html;

  loadHeaderCSS();
  bindHeaderEvents();
}

function loadHeaderCSS() {
  if (document.querySelector(
    'link[href="./modules/header/header.css"]'
  )) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./modules/header/header.css";
  document.head.appendChild(link);
}

function bindHeaderEvents() {
  const sceneGroup = document.querySelector(".menu-group");
  const sceneButton = sceneGroup.querySelector(".menu-btn");

  sceneButton.addEventListener("click", () => {
    sceneGroup.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!sceneGroup.contains(e.target)) {
      sceneGroup.classList.remove("open");
    }
  });

  document.getElementById("menu-save")
    .addEventListener("click", saveSceneFile);

  document.getElementById("menu-save-as")
    .addEventListener("click", saveAsSceneFile);

  document.getElementById("menu-new-scene")
    .addEventListener("click", newScene);

  document.getElementById("menu-load")
    .addEventListener("click", toggleFilesPanel);
}

function saveSceneFile() {
  const scene = serializeScene();

  saveCurrentFile(scene);

  renderFiles();
}

function saveAsSceneFile() {
  const name = prompt("Nombre del archivo:");

  if (!name) return;

  createFile(name, serializeScene());

  renderFiles();
}

function newScene() {
  const name = prompt("Nombre de la nueva escena:");

  if (!name) return;

  clearScene();

  createFile(name, []);

  renderFiles();
}

function toggleFilesPanel() {
  const panel = document.getElementById("files-panel");

  panel.classList.toggle("visible");
}