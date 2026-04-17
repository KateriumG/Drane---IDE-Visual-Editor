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
}