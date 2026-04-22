import { serializeScene, restoreScene } from "./scene.js";

const undoStack = [];
const redoStack = [];

const MAX_HISTORY = 50;

export function pushHistory() {
  const snapshot = JSON.stringify(serializeScene());

  const last = undoStack[undoStack.length - 1];

  if (snapshot === last) return;

  undoStack.push(snapshot);

  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  redoStack.length = 0;
}

export function undo(createElement) {
  if (undoStack.length <= 1) return;

  const current = undoStack.pop();
  redoStack.push(current);

  const previous = JSON.parse(
    undoStack[undoStack.length - 1]
  );

  restoreScene(previous, createElement);
}

export function redo(createElement) {
  if (redoStack.length === 0) return;

  const snapshot = redoStack.pop();

  undoStack.push(snapshot);

  restoreScene(JSON.parse(snapshot), createElement);
}