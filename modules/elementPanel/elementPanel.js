import { createElement } from "../canvas/canvas.js";

export async function initElementPanel() {
  const container = document.getElementById("topLeft-panel");

  const html = await fetch("./modules/elementPanel/elementPanel.html")
    .then(res => res.text());

  container.innerHTML = html;

  bindEvents();
}

export function bindEvents() {
  document.getElementById("btn-div")
    .addEventListener("click", () => createElement("div"));

  document.getElementById("btn-button")
    .addEventListener("click", () => createElement("button"));

  document.getElementById("btn-h1")
    .addEventListener("click", () => createElement("h1"));
}