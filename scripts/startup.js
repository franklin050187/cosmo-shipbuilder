//Happens after the window loaded to prevent drawing on a non existent canvas
window.onload = () => {
	loadJson(JSON.stringify(startup_ship_data))
};
// Load a default category
updatePlacementCategories()
preloadSprites()
// Initialize the canvas
loadPreviewSpriteImage()
initializeCanvas()
closeHelp()

function initializeCanvas() {
	// Adjust canvas size
	minX = -10;
	minY = -10;
	maxX = 10;
	maxY = 10; 
	const width = (maxX - minX + 1) * gridSize;
	const height = (maxY - minY + 1) * gridSize;
	for (let c of global_canvases) {
		c.width = width;
		c.height = height;
	}
	updateCanvas()
}

function loadPreviewSpriteImage() {
	const selectedSprite = global_sprites_to_place[0].ID;
	const imageName = selectedSprite.replace("cosmoteer.", "");
	previewSpriteImage.src = `sprites/${imageName}.png`;

	previewSpriteImage.onload = () => {
		isPreviewSpriteLoaded = true;
	};
}
