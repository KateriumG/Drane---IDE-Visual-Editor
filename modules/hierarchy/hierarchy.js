import { state } from "../../core/state.js";
import { on } from "../../core/events.js";
import { selectElement } from "../../core/selection.js";

let list;

export async function initHierarchy() {
    const container = document.getElementById("bottomLeft-panel");
  
    const html = await fetch("./modules/hierarchy/hierarchy.html")
      .then(res => res.text());
  
    container.innerHTML = html;
  
    list = document.getElementById("hierarchy-list");
  
    on("selectionChanged", renderHierarchy);
  
    loadHierarchyCSS();
    renderHierarchy();
  }

  function loadHierarchyCSS(){
    if (!document.querySelector('link[href="./modules/hierarchy/hierarchy.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./modules/hierarchy/hierarchy.css";
        document.head.appendChild(link);
    }
  }

  function renderHierarchy() {
    if (!list) return;
  
    list.innerHTML = "";
  
    const roots = state.elements.filter(el => !el.dataset.parentId);
  
    roots.forEach(el => {
      list.appendChild(createTreeItem(el));
    });
  }

  function createTreeItem(el) {
    const li = document.createElement("li");
    li.className = "hierarchy-item";
  
    if (state.selected === el) {
      li.classList.add("active");
    }
  
    li.textContent = el.tagName.toLowerCase();
  
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      selectElement(el);
    });

    const children = state.elements.filter(
      child => child.dataset.parentId === el.dataset.elementId
    );

    if (children.length) {
      const ul = document.createElement("ul");
  
      children.forEach(child => {
        ul.appendChild(createTreeItem(child));
      });
  
      li.appendChild(ul);
    }
  
    return li;
  }
