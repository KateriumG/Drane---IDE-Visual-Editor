const STORAGE_KEY = "drane_project";

export function getProject() {
  const raw = localStorage.getItem(STORAGE_KEY);

  return raw
    ? JSON.parse(raw)
    : {
        files: [],
        currentFile: null
      };
}

export function saveProject(project) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(project)
  );
}

export function createFile(name, data = []) {
  const project = getProject();

  const file = {
    id: crypto.randomUUID(),
    name: name.endsWith(".scene")
      ? name
      : name + ".scene",
    type: "scene",
    data
  };

  project.files.push(file);
  project.currentFile = file.id;

  saveProject(project);

  return file;
}

export function saveCurrentFile(sceneData) {
  const project = getProject();

  const file = project.files.find(
    f => f.id === project.currentFile
  );

  if (!file) return;

  file.data = sceneData;

  saveProject(project);
}

export function loadFile(fileId) {
  const project = getProject();

  project.currentFile = fileId;

  saveProject(project);

  return project.files.find(f => f.id === fileId);
}

export function getFiles() {
  return getProject().files;
}

export function renameFile(fileId, newName) {
  const project = getProject();

  const file = project.files.find(
    f => f.id === fileId
  );

  if (!file) return;

  file.name = newName.endsWith(".scene")
    ? newName
    : newName + ".scene";

  saveProject(project);
}

export function deleteFile(fileId) {
  const project = getProject();

  project.files = project.files.filter(
    f => f.id !== fileId
  );

  if (project.currentFile === fileId) {
    project.currentFile =
      project.files[0]?.id || null;
  }

  saveProject(project);
}