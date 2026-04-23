export const state = {
    elements: [],
    selected: null,

    tool: "select", // select | move | rotate | resize
    handles: null, // resize | rotate 
    handleDirection: null, // tl, tr, bl, br

    collapsedNodes: new Set(),
    
    canvasZoom: 1,
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    isPanning: false,
  };