//Stuff that should immediately run on startup
window.onload = () => {
	preloadSprites();
};

// Initialize the canvas
loadPreviewSpriteImage();

// Initialize the grid
// drawGrid();

loadJson(JSON.stringify(startup_ship_data))
// Load a default category
loadParts("weapon");
