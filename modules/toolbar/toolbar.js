import { state } from "../../core/state.js";
import { emit } from "../../core/events.js";

export function initToolbar() {
  document.querySelectorAll("[data-tool]")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        state.tool = btn.dataset.tool;

        emit("toolChanged", state.tool);
      });
    });
}