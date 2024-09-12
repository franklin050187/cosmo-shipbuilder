const multiple_turrets = [
	"cosmoteer.thruster_small_2way",
	"cosmoteer.thruster_small_3way",
];
const cursor_mode = document.getElementsByName("cursor_mode");
const json_import_text = document.getElementById("jsonInput");
const load_json_button = document.getElementById("loadButton");
const export_json_button = document.getElementById("exportButton");

const shiplink = document.getElementById("ship_link");
const generate_ship = document.getElementById("post_json");
generate_ship.addEventListener("click", generateShip);

const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 64; // Size of each grid cell
const spriteSelect = document.getElementById("spriteSelect");
const spriteNames = Object.keys(spriteData).sort();
for (const spriteName of spriteNames) {
	const option = document.createElement("option");
	option.value = spriteName;
	option.textContent = spriteName;
	spriteSelect.appendChild(option);
}
const property_select = document.getElementById("propertySelect");
const property_edit = document.getElementById("propertyEdit");
const apply_property_button = document.getElementById("applyPropertyButton");

const ship_property_select = document.getElementById("shipPropertySelect");
const ship_property_edit = document.getElementById("shipPropertyEdit");
const apply_ship_property_button = document.getElementById(
	"applyShipPropertyButton",
);

const previewSpriteImage = new Image();
const previewSprite = document.createElement("img");
const ship_stats_label = document.getElementById("shipStatsLabel");
const coordinates_label = document.getElementById("coord_on_canvas");

previewSprite.id = "previewSprite";
document.body.appendChild(previewSprite);
canvas.addEventListener("mousemove", handleCanvasMouseMove);
canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("contextmenu", handleRightClick); // Listen for right-click
export_json_button.addEventListener("click", export_json);
load_json_button.addEventListener("click", loadJson);
apply_property_button.addEventListener("click", applyProperty);

apply_ship_property_button.addEventListener("click", applyShipProperty);

for (const radio of cursor_mode) {
	radio.addEventListener("click", handleCursorMode);
}
// canvas.addEventListener('mousemove', handleCanvasMouseMove);
document
	.getElementById("spriteSelect")
	.addEventListener("change", handleSpriteSelectionChange);
property_select.addEventListener("change", handlePropertySelectionChange);

ship_property_select.addEventListener(
	"change",
	handleShipPropertySelectionChange,
);

let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let affectedSquares = []; // To store the affected squares
let sprite_delete_mode = []; // To store the sprite delete mode
let sprite_to_place = []; // To store the sprite to place
let selected_sprites = [];
let sprites = []; // To store the sprites
let all_ship_stats = []
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0; // adjust canvas size
let shipdata = {}; // To store the ship data
const deleteMode = false; // To store the delete mode
let rotation = 0; // Initial rotation (0 degrees)
let lastX = 0; // Last mouse position
let lastY = 0; // Last mouse position
let lastRotation = 0; // Last rotation
let lastDrawX = 0; // Last preview sprite position
let lastDrawY = 0; // Last preview sprite position
let lastWidth = 0; // Last preview sprite size
let lastHeight = 0; // Last preview sprite size
let cursorMode = "Place"; // Initial cursor mode
let doors = []; // To store the doors
let resources = []; // To store the resources
let part_toggles = [];

// input and output for b64
const b64Input = document.getElementById("b64_input");
const loadB64Button = document.getElementById("load_b64");
// get url parameter b64
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const b64 = urlParams.get("url");
if (b64) {
	b64Input.value = b64;
	get_json();
}

loadB64Button.addEventListener("click", get_json);
function get_json() {
	const b64Input = document.getElementById("b64_input");
	const encodedB64 = b64Input.value.replace(/-/g, "+").replace(/_/g, "/");
	const jsonInput = document.getElementById("jsonInput");
	const xhr = new XMLHttpRequest();
	const url = `https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/edit?url=${encodedB64}`;
	xhr.open("GET", url, true);
	xhr.onload = () => {
		if (xhr.status === 200) {
			jsonInput.value = xhr.responseText;
			loadJson();
		}
	};

	xhr.send();
}

function generateShip() {
	// send post request to generate ship
	// use export json function to get shipdata
	export_json();
	// get the data
	const json_to_post = document.getElementById("json_export").value;

	const xhr = new XMLHttpRequest();
	const url =
		"https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/generate";
	// const url = 'http://127.0.0.1:8001/generate';

	xhr.open("POST", url, true);
	// xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(json_to_post);

	xhr.onload = () => {
		if (xhr.status === 200) {
			const ship_link = document.getElementById("ship_link");
			const url = JSON.parse(xhr.responseText).url;
			ship_link.href = url;
			ship_link.style.display = "block";
		}
	};
}

function handleCursorMode() {
	const cursor_mode = document.getElementsByName("cursor_mode");
	for (const radio of cursor_mode) {
		if (radio.checked) {
			cursorMode = radio.value;
			handleCursorModeChange();
		}
	}
}

function handlePropertySelectionChange() {
	property_edit.value = JSON.parse(property_select.value).Value;
}

function handleShipPropertySelectionChange() {
	ship_property_edit.value = ship_property_select.value;
}

function handleCursorModeChange() {
	if (cursorMode === "Place") {
		// set <select id="spriteSelect"></select> to cosmoteer.corridor
		document.getElementById("spriteSelect").value = "cosmoteer.corridor";
		handleSpriteSelectionChange();
	} else if (cursorMode === "Delete") {
		// set <select id="spriteSelect"></select> to cosmoteer.corridor
		document.getElementById("spriteSelect").value = "cosmoteer.delete";
	}
}

function export_json() {
	// get shipdata, update shipdata.parts with sprites then export
	// drop "width" and "height" from sprite data
	new_parts = [];
	for (const sprite of sprites) {
		sprite.width = undefined;
		sprite.height = undefined;
		new_parts.push(sprite);
	}
	shipdata.Doors = doors;
	shipdata.NewFlexResourceGridTypes = resources;
	shipdata.Parts = new_parts;
	shipdata.PartUIToggleStates = part_toggles;

	for ([key, value] of getShipDataMap()) {
		shipdata[key] = value;
	}

	// convert shipdata to json
	const json = JSON.stringify(shipdata);
	// clear textarea
	document.getElementById("json_export").value = "";
	// fill textarea id="json_export" with json string
	document.getElementById("json_export").value = json;
}

function loadJson() {
	// Clear the sprite data
	sprites = [];
	shipdata = {};
	doors = [];
	resources = [];
	part_toggles = [];
	const json = json_import_text.value;
	const data = JSON.parse(json);
	const part_data = Array.isArray(data.Parts) ? data.Parts : [];
	const doordata = Array.isArray(data.Doors) ? data.Doors : [];
	const resource_data = Array.isArray(data.NewFlexResourceGridTypes)
		? data.NewFlexResourceGridTypes
		: [];
	const partUIToggleStates = Array.isArray(data.PartUIToggleStates)
		? data.PartUIToggleStates
		: [];

	shipdata = data;
	// Calculate the min and max positions
	minX = Number.POSITIVE_INFINITY;
	minY = Number.POSITIVE_INFINITY;
	maxX = Number.NEGATIVE_INFINITY;
	maxY = Number.NEGATIVE_INFINITY;

	for (const sprite of part_data) {
		const [x, y] = sprite.Location;
		if (x < minX) minX = x;
		if (y < minY) minY = y;
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;
		sprites.push(sprite);
	}

	for (const door of doordata) {
		doors.push(door);
	}

	for (const resource of resource_data) {
		resources.push(resource);
	}

	for (const toggle of partUIToggleStates) {
		part_toggles.push(toggle);
	}

	// Extend the grid by 10 squares in each direction
	minX -= 10;
	minY -= 10;
	maxX += 10;
	maxY += 10;

	// Adjust canvas size
	const width = (maxX - minX + 1) * gridSize;
	const height = (maxY - minY + 1) * gridSize;
	canvas.width = width;
	canvas.height = height;

    redrawCanvas();
	updateShipStats();
	updateNonVisuals()
}

function applyProperty() {
	new_value = property_edit.value;

	for (sprite of selected_sprites) {
		for (toggle of part_toggles) {
			if (
				isSameToggleType(toggle, JSON.parse(property_select.value)) &&
				toggleBelongsToSprite(toggle, sprite)
			) {
				toggle.Value = new_value;
			}
		}
	}

	redrawCanvas();
}

function applyShipProperty() {
	const new_value = ship_property_edit.value;
	const toggle =
		ship_property_select.options[ship_property_select.selectedIndex].text;
	shipdata[toggle] = new_value;
	updateShipToggleSelection();
	redrawCanvas();
}

function applyProperty() {
    new_value = property_edit.value;

    for (sprite of selected_sprites) {
        for (toggle of part_toggles) {
            if (isSameToggleType(toggle, JSON.parse(property_select.value)) && toggleBelongsToSprite(toggle, sprite)) {
                toggle.Value = new_value;
            }
        }
    }

    redrawCanvas()
}

function sprite_position(part, position) {
	const sprite_size =
		spriteData[part.ID].sprite_size || spriteData[part.ID].size;
	const part_size = spriteData[part.ID].size;
	const part_rotation = part.Rotation;

	if (part_rotation === 0 && upTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 3 && upTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 1 && downTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 2 && downTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (multiple_turrets.includes(part.ID)) {
		if (part.ID === "cosmoteer.thruster_small_2way") {
			if (part_rotation === 1) {
				position[0] -= 1;
			}
			if (part_rotation === 2) {
				position[0] -= 1;
				position[1] -= 1;
			}
			if (part_rotation === 3) {
				position[1] -= 1;
			}
			if (part_rotation === 1) {
				position[0] -= 1;
			}
		} else if (part.ID === "cosmoteer.thruster_small_3way") {
			if (part_rotation === 2) {
				if (part_rotation === 3) {
					position[1] -= 1;
				}
			}
		}
	}
	if (
		part.ID === "cosmoteer.missile_launcher" &&
		getPartDataMap(part).get("missile_type") !== 0
	) {
		if (part_rotation === 0) {
			position[1] -= 1;
		}
		if (part_rotation === 3) {
			position[0] -= 1;
		}
	}
	if (part.ID === "cosmoteer.door") {
		if (part.Orientation === 0) {
			position[1] -= 0.5;
		} else {
			position[0] -= 0.5;
		}
	}
	return position;
}

function rotate_img(image, angle, flipx) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	// Set canvas dimensions based on the rotation
	if (angle % 2 === 0) {
		canvas.width = image.width;
		canvas.height = image.height;
	} else {
		canvas.width = image.height;
		canvas.height = image.width;
	}

	// Translate to center and rotate
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((angle * Math.PI) / 2);

	if (flipx) {
		ctx.scale(-1, 1);
	}

	ctx.drawImage(image, -image.width / 2, -image.height / 2);

	return canvas;
}

function get_all_locations() {
	const json = json_import_text.value;
	const data = JSON.parse(json);
	const part_data = data.Parts;

	const locations = [];
	// let width;
	// let height;

	for (const sprite of part_data) {
		getSpriteTileLocations(sprite);
		Array.prototype.push.apply(locations, sprite.Location);
	}
	return locations;
}

const spriteCache = {};

function preloadSprites() {
	// Iterate over the keys (IDs) in the spriteData object
	for (const spriteID of Object.keys(spriteData)) {
		const imageName = spriteID.replace("cosmoteer.", "");
		const img = new Image();
		img.src = `sprites/${imageName}.png`;
		spriteCache[imageName] = img; // Store the image in the cache
	}

	// Preload specific images for different missile types
	spriteCache.nuke_launcher = new Image();
	spriteCache.nuke_launcher.src = "sprites/nuke_launcher.png";

	spriteCache.emp_launcher = new Image();
	spriteCache.emp_launcher.src = "sprites/emp_launcher.png";

	spriteCache.mine_launcher = new Image();
	spriteCache.mine_launcher.src = "sprites/mine_launcher.png";
}

preloadSprites();

function square_map(sprite) {
	const [x, y] = sprite_position(sprite, [
		sprite.Location[0],
		sprite.Location[1],
	]);
	const width = Math.ceil(sprite.width / gridSize);
	const height = Math.ceil(sprite.height / gridSize);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const squareX = x + i;
			const squareY = y + j;
			const key = `${squareX},${squareY}`;

			gridMap[key] = {
				square_x: squareX,
				square_y: squareY,
				is_drawn_by_sprite: sprite, // Store the sprite that is using the square
			};
		}
	}
}

function loadPreviewSpriteImage() {
	const selectedSprite = document.getElementById("spriteSelect").value;
	const imageName = selectedSprite.replace("cosmoteer.", "");
	previewSpriteImage.src = `sprites/${imageName}.png`;

	previewSpriteImage.onload = () => {
		isPreviewSpriteLoaded = true;
	};
}

function handleCanvasMouseMove(event) {
	// fix position for flexbox
	const canvas = document.getElementById("spriteCanvas");
	const rect = canvas.getBoundingClientRect();

	// Calculate scaling factors between the canvas's original size and its displayed size
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	// Calculate mouse position relative to the canvas, taking into account the scaling
	const x = (event.clientX - rect.left) * scaleX;
	const y = (event.clientY - rect.top) * scaleY;
	const mouseX = Math.floor(x / gridSize) * gridSize;
	const mouseY = Math.floor(y / gridSize) * gridSize;
	const canvasPositionX = mouseX / gridSize + minX;
	const canvasPositionY = mouseY / gridSize + minY;

	// update if square location changes
	if (
		lastX === canvasPositionX &&
		lastY === canvasPositionY &&
		lastRotation === rotation
	) {
		return;
	}

	updateCoordinates(canvasPositionX, canvasPositionY);

	if (cursorMode === "Delete") {
		// clear preview sprite
		clearPreview();
		// Store affected grid squares
		affectedSquares = [];
		const width = 1;
		const height = 1;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const squareX = canvasPositionX + i;
				const squareY = canvasPositionY + j;
				const key = `${squareX},${squareY}`;
				affectedSquares.push(key);
			}
		}
		// Find sprite data for affected squares and store it in sprite_delete_mode
		sprite_delete_mode = [];
		for (const key of affectedSquares) {
			if (gridMap[key]) {
				sprite_delete_mode.push(gridMap[key].is_drawn_by_sprite);
			}
		}
		lastX = canvasPositionX;
		lastY = canvasPositionY;
		lastRotation = rotation;

		return;
	}

	if (cursorMode === "Place") {
		sprite_to_place = [];
		if (!isPreviewSpriteLoaded) return;
		const spriteDataPreview = {
			FlipX: false,
			ID: document.getElementById("spriteSelect").value,
			Location: [canvasPositionX, canvasPositionY],
			Rotation: rotation,
		};

		const [drawX, drawY] = sprite_position(spriteDataPreview, [
			spriteDataPreview.Location[0],
			spriteDataPreview.Location[1],
		]);
		const rotatedImage = rotate_img(
			previewSpriteImage,
			spriteDataPreview.Rotation,
			spriteDataPreview.FlipX,
		);

		// Clear the previous preview sprite and redraw affected sprites
		clearPreview();

		// Draw the new preview sprite
		drawPreview(
			spriteDataPreview,
			(drawX - minX) * gridSize + 1,
			(drawY - minY) * gridSize + 1,
			rotatedImage,
		);

		// Update last known position and dimensions
		lastX = canvasPositionX;
		lastY = canvasPositionY;
		lastRotation = rotation;
		lastDrawX = (drawX - minX) * gridSize + 1;
		lastDrawY = (drawY - minY) * gridSize + 1;
		lastWidth = rotatedImage.width - 2;
		lastHeight = rotatedImage.height - 2;

		// Store affected grid squares
		affectedSquares = [];
		const width = Math.ceil(rotatedImage.width / gridSize);
		const height = Math.ceil(rotatedImage.height / gridSize);

		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const squareX = canvasPositionX + i;
				const squareY = canvasPositionY + j;
				const key = `${squareX},${squareY}`;
				affectedSquares.push(key);
			}
		}
		sprite_to_place = spriteDataPreview;
		return;
	}

	if (cursorMode === "Move") {
		// get sprite under, call delete + place mode with that sprite and rotation
		// clear preview sprite
		clearPreview();
		affectedSquares = [];
		const width = 1;
		const height = 1;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const squareX = canvasPositionX + i;
				const squareY = canvasPositionY + j;
				const key = `${squareX},${squareY}`;
				affectedSquares.push(key);
			}
		}
		sprite_delete_mode = [];
		for (const key of affectedSquares) {
			if (gridMap[key]) {
				sprite_delete_mode.push(gridMap[key].is_drawn_by_sprite);
			}
		}
		lastX = canvasPositionX;
		lastY = canvasPositionY;
		lastRotation = rotation;
		return;
	}
}

function clearPreview() {
	ctx.clearRect(lastDrawX, lastDrawY, lastWidth, lastHeight);

	// Redraw the sprites that were overwritten by the preview sprite
	for (const key of affectedSquares) {
		if (gridMap[key]) {
			const sprite = gridMap[key].is_drawn_by_sprite;
			const imageName = sprite.ID.replace("cosmoteer.", "");
			const img = new Image();

			const partData = getPartDataMap(sprite);
			const missileType = partData.get("missile_type");
			if (missileType === 2) {
				img.src = "sprites/nuke_launcher.png";
			} else if (missileType === 1) {
				img.src = "sprites/emp_launcher.png";
			} else if (missileType === 3) {
				img.src = "sprites/mine_launcher.png";
			} else {
				img.src = `sprites/${imageName}.png`;
			}

			img.onload = () => {
				const [x, y] = sprite_position(sprite, [
					sprite.Location[0],
					sprite.Location[1],
				]);
				const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
				ctx.clearRect(
					(x - minX) * gridSize + 1,
					(y - minY) * gridSize + 1,
					rotatedImage.width - 2,
					rotatedImage.height - 2,
				);
				ctx.drawImage(
					rotatedImage,
					(x - minX) * gridSize + 1,
					(y - minY) * gridSize + 1,
					rotatedImage.width - 2,
					rotatedImage.height - 2,
				);
			};
		}
	}
}

function drawPreview(spriteDataPreview, drawX, drawY, rotatedImage) {
	ctx.globalAlpha = 0.5;
	ctx.drawImage(
		rotatedImage,
		drawX,
		drawY,
		rotatedImage.width - 2,
		rotatedImage.height - 2,
	);
	ctx.globalAlpha = 1.0;
}

function handleSpriteSelectionChange() {
	loadPreviewSpriteImage();
}

function handleCanvasClick(event) {
	// place sprite
	if (cursorMode === "Place") {
		place_sprite(sprite_to_place);
		redrawCanvas();
	}
	// remove sprite
	if (cursorMode === "Delete") {
		if (sprite_delete_mode.length > 0) {
			remove_from_sprites(sprite_delete_mode);
			redrawCanvas();
		}
	}
	// move sprite
	if (cursorMode === "Move") {
		document.getElementById("spriteSelect").value = sprite_delete_mode[0].ID;
		rotation = sprite_delete_mode[0].Rotation;
		remove_from_sprites(sprite_delete_mode);
		redrawCanvas();
		loadPreviewSpriteImage();
		// isPreviewSpriteLoaded = false;
		cursorMode = "Place";
		// check the radio to place document.getElementsByName('cursor_mode')
		document.getElementById("Move").checked = false;
		document.getElementById("Place").checked = true;
	}
	// select sprite
	if (cursorMode === "Select") {
		const pos = mousePos(event);
		const selected_sprite = findSprite(pos[0], pos[1]);
		if (selected_sprite != null) {
			select_sprite(selected_sprite);
		}
	}
}

function place_sprite(sprite_to_place) {
	const location = sprite_to_place.Location;
	if (sprite_to_place.ID === "cosmoteer.door") {
		const string = JSON.parse(
			`{"Cell": [${location}], "ID": "cosmoteer.door", "Orientation": ${(sprite_to_place.Rotation + 1) % 2}}`,
		);
		doors.push(string);
	} else {
		sprites.push(sprite_to_place);
	}
}

function select_sprite(sprite_to_select) {
	for (sprite of selected_sprites) {
		if (isSameSprite(sprite, sprite_to_select)) {
			return;
		}
	}
	selected_sprites.push(sprite_to_select);
	updateSpriteSelection();
}

function resetSelectedSprites() {
	selected_sprites = [];
	updateSpriteSelection();
}
function remove_from_sprites(sprite_to_remove) {
	const spriteToRemove = sprite_to_remove[0];
	for (const sprite of sprites) {
		// find the sprite in sprites and remove it
		// check id and location
		if (isSameSprite(sprite, spriteToRemove)) {
			sprites.splice(sprites.indexOf(sprite), 1);
			break;
		}
	}

	// remove from key from gridmap
	const key_loc_x = spriteToRemove.Location[0];
	const key_loc_y = spriteToRemove.Location[1];
	for (const key in gridMap) {
		if (
			gridMap[key].is_drawn_by_sprite.Location[0] === key_loc_x &&
			gridMap[key].is_drawn_by_sprite.Location[1] === key_loc_y
		) {
			delete gridMap[key];
		}
	}
}

function handleRightClick(event) {
	event.preventDefault();
	rotation = (rotation + 1) % 4;
	resetSelectedSprites();
	handleCanvasMouseMove(event); // Update the preview with new rotation
}

function clearPreviewSprite() {
	previewSprite.style.display = "none"; // Hide the preview sprite
}

function unclearPreviewSprite() {
	previewSprite.style.display = "block"; // Hide the preview sprite
}

function findSprite(x, y) {
	for (const sprite of sprites) {
		for (const location of getSpriteTileLocations(sprite)) {
			if (location[0] === x && location[1] === y) {
				return sprite;
			}
		}
	}

	return null;
}

function getSpriteTileLocations(sprite) {
	const sprite_size =
		spriteData[sprite.ID].sprite_size || spriteData[sprite.ID].size;
	const locations = [];

	if (sprite.Rotation % 2 === 0) {
		width = sprite_size[0];
		height = sprite_size[1];
	} else {
		width = sprite_size[1];
		height = sprite_size[0];
	}

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			locations.push([sprite.Location[0] + i, sprite.Location[1] + j]);
		}
	}
	return locations;
}

function mousePos(event) {
	const canvas = document.getElementById("spriteCanvas");
	const rect = canvas.getBoundingClientRect();

	// Calculate scaling factors between the canvas's original size and its displayed size
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	// Calculate mouse position relative to the canvas, taking into account the scaling
	const x = (event.clientX - rect.left) * scaleX;
	const y = (event.clientY - rect.top) * scaleY;
	// const x = event.offsetX;
	// const y = event.offsetY;
	const mouseX = Math.floor(x / gridSize) * gridSize;
	const mouseY = Math.floor(y / gridSize) * gridSize;
	const canvasPositionX = mouseX / gridSize + minX;
	const canvasPositionY = mouseY / gridSize + minY;
	const result = [canvasPositionX, canvasPositionY];
	return result;
}

// Initialize the canvas
loadPreviewSpriteImage();
// Initialize the grid
// drawGrid();

function isSameSprite(sprite1, sprite2) {
	return (
		sprite1.ID === sprite2.ID &&
		sprite1.Location[0] === sprite2.Location[0] &&
		sprite1.Location[1] === sprite2.Location[1]
	);
}

function isSameToggleType(toggle1, toggle2) {
	return toggle1.Key[1] === toggle2.Key[1];
}

function toggleBelongsToSprite(toggle, sprite) {
	return isSameSprite(toggle.Key[0], sprite);
}
