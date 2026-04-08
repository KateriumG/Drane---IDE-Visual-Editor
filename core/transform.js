import { state } from "./state.js";

export function applyTransform(e) {
  if (!state.selected) return;

  switch (state.tool) {
    case "move":
      move(e);
      break;

    case "rotate":
      rotate(e);
      break;

    case "resize":
      resize(e);
      break;
  }
}