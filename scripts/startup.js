//Happens after the window loaded to prevent drawing on a non existent canvas
window.onload = () => {
	loadJson(JSON.stringify(startup_ship_data))
};
// Load a default category
loadParts("energy weapon")
preloadSprites()
// Initialize the canvas
loadPreviewSpriteImage()
resizeCanvas()
closeHelp()


