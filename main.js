const gridSize = 64; // Size of each grid cell
let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let sprite_delete_mode = []; // To store the sprite delete mode
let global_sprites_to_place = [generatePart("cosmoteer.corridor")]; // To store the sprites to place
let global_selected_sprites = [];
let global_toggles_to_add = []
let global_mirror_axis = []
let global_crew_assignments = []
let global_supply_chains = []
let global_sprites_to_draw = [] //Saves the sprites that are yet to be drawn
let global_sprites_to_delete = [] //Saves the sprites that are drawn to which should be deleted
let sprites = []; // To store the sprites
let all_ship_stats = []
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0; // adjust canvas size
let shipdata = {}; // To store the ship data
let cursorMode = "Place"; // Initial cursor mode
let doors = []; // To store the doors
let resources = []; // To store the resources
let global_part_properties = [];

const spriteCache = {};
const previewSpriteImage = new Image();

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

function ChangeCursorMode(string) {
	const cursor_mode = document.getElementsByName("cursor_mode");
	for (const radio of cursor_mode) {
		radio.checked = false	
	}
	for (const radio of cursor_mode) {
		if (radio.id === string) {
			cursor_mode.value = string
			radio.checked = true
			handleCursorMode();
			return
		}
	}
}

function handleCursorModeChange() {
	clearPreview();
	if (cursorMode === "Place") {
		if (global_sprites_to_place.length === 0 || global_sprites_to_place.includes("cosmoteer.delete")) {
			document.getElementById("spriteSelect").value = "cosmoteer.corridor";
			global_sprites_to_place = [generatePart("cosmoteer.corridor")]
		}
	} else if (cursorMode === "Delete") {
		global_sprites_to_place = []
		document.getElementById("spriteSelect").value = "cosmoteer.delete";
	} else if (cursorMode === "Move") {
		global_sprites_to_place = [];
	}
}

function handleSpriteSelectionChange() {
	global_sprites_to_place = []
	global_sprites_to_place.push(generatePart(document.getElementById("spriteSelect").value))
	loadPreviewSpriteImage();
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
	shipdata.PartUIToggleStates = global_part_properties;

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

function loadJson(json) {
	// Clear the sprite data
	sprites = [];
	shipdata = {};
	doors = [];
	resources = [];
	global_part_properties = [];
	if (typeof json !== 'string') {
        json = json_import_text.value;
    }
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
		global_sprites_to_draw.push(sprite)

	}

	for (const door of doordata) {
		doors.push(door);
	}

	for (const resource of resource_data) {
		resources.push(resource);
	}

	for (const toggle of partUIToggleStates) {
		global_part_properties.push(toggle);
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
	resource_canvas.width = width;
	resource_canvas.height = height;
	drawing_canvas.width = width;
	drawing_canvas.height = height;
	preview_canvas.width = width;
	preview_canvas.height = height;

    updateCanvas();
	updateShipStats();
	updateNonVisuals()
}

function applyShipProperty() {
	const new_value = ship_property_edit.value;
	const toggle =
		ship_property_select.options[ship_property_select.selectedIndex].text;
	shipdata[toggle] = new_value;
	updateShipToggleSelection();
	updateCanvas();
}

function applyProperty() {
    new_value = parseInt(property_edit.value);
    for (let sprite of global_selected_sprites) {
        for (toggle of global_part_properties) {
            if (isSameToggleType(toggle, JSON.parse(property_select.value)) && toggleBelongsToSprite(toggle, sprite)) {
                toggle.Value = new_value;
            }
        }
    }
    updateCanvas()
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

function get_all_locations(sprites) {
	const locations = [];
	// let width;
	// let height;

	for (const sprite of sprites) {
		getSpriteTileLocations(sprite);
		Array.prototype.push.apply(locations, sprite.Location);
	}
	return locations;
}

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
	updateCanvas();

	let [canvasPositionX, canvasPositionY] = convertCanvasToCoordinates(event.clientX, event.clientY)

	updateCoordinates(canvasPositionX, canvasPositionY);

	if (cursorMode === "Delete") {
		drawDeletePreview(event)
		return;
	}

	if (cursorMode === "Place") {
		if (!isPreviewSpriteLoaded) return;
		global_sprites_to_place[0].Location = [canvasPositionX, canvasPositionY]

		drawPreview(global_sprites_to_place);
		return;
	}

	if (cursorMode === "Move") {
		if (global_sprites_to_place.length > 0) {
			global_sprites_to_place[0].Location = [canvasPositionX, canvasPositionY]
			drawPreview(global_sprites_to_place);
		}
		return;
	}
}

function handleCanvasClick(event) {
	// place sprite
	if (cursorMode === "Place") {
		place_sprites(global_sprites_to_place);
	}
	// remove sprite
	if (cursorMode === "Delete") {
		doIfCursorOverPart(event, (part) => {
			remove_multiple_from_sprites(mirroredParts([part]))
			clearPreview()
			updateCanvas();
		})
	}
	// move sprite
	if (cursorMode === "Move") {
		const pos = mousePos(event);
		if (global_sprites_to_place.length === 0) {
			doIfCursorOverPart(event, (part) => {
				global_sprites_to_place = [partCopy(part)]
				remove_multiple_from_sprites(mirroredParts([part]))
			})
		} else {
			place_sprites(global_sprites_to_place);
			clearPreview()
			global_sprites_to_place = []
		}
	}
	// select sprite
	if (cursorMode === "Select") {
		doIfCursorOverPart(event, part => select_sprite(part));
	}
	// select sprite
	if (cursorMode === "Supply") {
		doIfCursorOverPart(event, part => select_sprite(part));
	}
}

function handleRightClick(event) {
	event.preventDefault();
	let pos = mousePos(event)
	if (cursorMode === "Place" || cursorMode === "Move") {
		for (part of global_sprites_to_place) {
			part.Rotation = (part.Rotation + 1) % 4
		}
		handleCanvasMouseMove(event); 
	} else if (cursorMode === "Delete") {
		removeDoor(pos);
		updateCanvas();
	} else if (cursorMode === "Select") {
		global_selected_sprites = []
		updateSpriteSelection()
	} else if (cursorMode === "Supply") {
		doIfCursorOverPart(event, part => addSupplyChains(part, global_selected_sprites));
	} 
}

function place_sprites(sprites_to_place) {//Places the first sprites with absolute coordinates and the ones after with relative ones
	let new_parts = mirroredParts(repositionPartsRalative(sprites_to_place))
	toggle = true
	for (let sprite of new_parts){
		const location = sprite.Location;
		if (sprite.ID === "cosmoteer.door") {
			const string = JSON.parse(
				`{"Cell": [${location}], "ID": "cosmoteer.door", "Orientation": ${(sprite.Rotation + 1) % 2}}`,
			);
			doors.push(string);
		} else {
			overlaps = overlappingParts(sprite, sprites)
			if (overlaps.length>0) {
				remove_multiple_from_sprites(overlaps)
			}
			sprites.push(sprite);
			global_sprites_to_draw.push(sprite)
			addActionToHistory("add_parts", [sprite])
			let prop = generatePropertiesForPart(sprite)
			global_part_properties.push(...prop)
		}
	}
	//global_sprites_to_place = [generatePart(document.getElementById("spriteSelect").value)]
}

function select_sprite(sprite_to_select) {
	for (let sprite of global_selected_sprites) {
		if (isSameSprite(sprite, sprite_to_select)) {
			return;
		}
	}
	global_selected_sprites.push(sprite_to_select);
	updateSpriteSelection();
	handlePropertySelectionChange()
}

function remove_multiple_from_sprites(sprites_to_remove) {1
	for (let sprite of sprites_to_remove) {
		remove_from_sprites(sprite)
	}
	addActionToHistory("remove_parts", sprites_to_remove)
}

function remove_from_sprites(sprite_to_remove) {
	const spriteToRemove = sprite_to_remove;

	
	for (const sprite of sprites) {
		// find the sprite in sprites and remove it
		// check id and location
		if (isSameSprite(sprite, spriteToRemove)) {
			sprites.splice(sprites.indexOf(sprite), 1);
			global_sprites_to_delete.push(sprite)
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

function removeDoor(location) {
	for (let i=0; i<doors.length;i++) {
		if (sameTile(doors[i].Cell, location)) {
			doors.splice(i,1)
		}
	}
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
	const sprite_size = spriteData[sprite.ID].size || spriteData[sprite.ID].size;
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
	const result = [canvasPositionX, canvasPositionY];
	return result;
}

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

function overlappingParts(part, parts) {
	let overlapping_parts = []
	for (let part2 of parts) {
		for (let location1 of getSpriteTileLocations(part)) {
			for (let location2 of getSpriteTileLocations(part2)) {
				if (sameTile(location1, location2)) {
					overlapping_parts.push(part2)
				}
			}
		}
	} 
	return overlapping_parts
}

function repositionPartsRalative(parts) { //Uses the first part as reference and places all following parts interpreting thir location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = base[0]+part.Location[0]
			new_part.Location[1] = base[1]+part.Location[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function absoluteToRalativePartCoordinates(parts) { //Uses the first part as reference and places all following parts interpreting thir location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = part.Location[0]-base[0]
			new_part.Location[1] = part.Location[1]-base[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function mirroredParts(parts) {
	let partsout = [...parts]
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newpart = partCopy(part)
			newpart.Location = partLocationFromCenter(location_rotations[0][i], part)
			newpart.Rotation = part.Rotation+(part.Rotation+location_rotations[1][i][0])%2*2//+location_rotations[1][i][0]
			newpart.FlipX = location_rotations[1][i][1]
			partsout.push(newpart)
		}
	}
	return partsout
}

function doIfCursorOverPart(event, code) {
	const pos = mousePos(event);
	let part = findSprite(pos[0], pos[1])
	if (part) {
		code(part);
	}
}

function addSupplyChains(part1, parts) {
	let part1Data = spriteData[part1.ID]
	for (let part2 of parts) {
		let part2Data = spriteData[part2.ID]
		if (part1Data.tags.includes("crew")) {
			global_crew_assignments.push(generateSupplyChain(part1, part2))
		} else if (part2Data.tags.includes("crew")) {
			global_crew_assignments.push(generateSupplyChain(part2, part1))
		} else if (part2Data.tags.includes("crew")) {
			global_supply_chains.push(generateSupplyChain(part1, part2))
		}
	}
}
