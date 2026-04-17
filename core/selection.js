import { state } from "./state.js";
import { emit } from "./events.js";

export function selectElement(el) {
  document.querySelectorAll(".selected")
    .forEach(e => e.classList.remove("selected"));
  document.querySelectorAll(".editing-parent")
    .forEach(el => el.classList.remove("editing-parent"));

  state.selected = el;

  if (el) {
    el.classList.add("selected");
    el.classList.add("editing-parent");
  }

  emit("selectionChanged", el);
}