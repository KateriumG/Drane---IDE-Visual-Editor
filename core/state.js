export const state = {
    elements: [],
    selected: null,

    tool: "select", // select | move | rotate | resize
    handles: null, // resize | rotate 
    handleDirection: null, // tl, tr, bl, br
    gridSnap: false,
    gridSize: 20,

    collapsedNodes: new Set(), // para almacenar los nodos colapsados en la jerarquía
    
    canvasZoom: 1,
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    isPanning: false,
  };