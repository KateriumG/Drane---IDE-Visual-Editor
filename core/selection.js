import { state } from "./state.js";
import { emit } from "./events.js";

export function selectElement(el) {
  document.querySelectorAll(".selected")
    .forEach(e => e.classList.remove("selected"));

  state.selected = el;

  if (el) {
    el.classList.add("selected");
  }

  emit("selectionChanged", el);
}