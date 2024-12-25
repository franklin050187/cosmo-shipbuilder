const gridSize = 32; // Size of each grid cell
let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let sprite_delete_mode = []; // To store the sprite delete mode
let global_sprites_to_place = [generatePart("cosmoteer.corridor")]; // To store the sprites to place
let global_selected_sprites = [];
let global_toggles_to_add = []
let global_mirror_axis = []
let global_mirror_center = [0,0]
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
let global_resources = []; // To store the resources
let global_resources_to_place = []
let global_zoom_factor = 1
let global_canvases = [canvas, resource_canvas, drawing_canvas, preview_canvas, additionals_canvas]

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
			global_sprites_to_place = [generatePart("cosmoteer.corridor")]
		}
	} else if (cursorMode === "Delete") {
		global_sprites_to_place = []
	} else if (cursorMode === "Move") {
		global_sprites_to_place = [];
	}
	updatePlacementCategories()
	updateCanvas()
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
	shipdata.Doors = doors
	shipdata.NewFlexResourceGridTypes = global_resources
	shipdata.Parts = new_parts
	shipdata.PartUIToggleStates = global_part_properties
	shipdata.ResourceSupplierTargets = global_supply_chains
	shipdata.CrewSourceTargets = global_crew_assignments
	shipdata.PartControlGroups = global_control_groups

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
	global_resources = [];
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

	for (const sprite of part_data) {
		sprites.push(sprite)
	}
	
	for (const door of doordata) {
		doors.push(door);
	}

	for (const resource of resource_data) {
		global_resources.push(resource);
	}

	for (const toggle of partUIToggleStates) {
		global_part_properties.push(toggle);
	}

	updateShipStats()
	updateNonVisuals()
	//place_sprites(part_data)
	global_sprites_to_draw.push(...part_data)
	updateCanvas()
}

function applyShipProperty() {
	const new_value = ship_property_edit.value;
	const toggle =
		ship_property_select.options[ship_property_select.selectedIndex].text;
	shipdata[toggle] = new_value;
	updateShipToggleSelection();
	updateCanvas();
}

function sprite_position(part) {
	position = [...(part.Location ?? part.Cell)]
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
	const [x, y] = sprite_position(sprite);
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
	updateCanvas()
}

function placeResources(resources) {
	for (let r of resources) {
		global_resources.push(r)
	}
}

function selectParts(parts) {
	for (let part of parts) {
		for (let sprite of global_selected_sprites) {
			if (isSameSprite(sprite, part)) {
				break
			}
		}
		global_selected_sprites.push(part)
	}
	updateCanvas()
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

function mousePos(event) {
	let transform = canvas.getContext("2d").getTransform()
	return mousePosConverter(event.clientX-transform.e, event.clientY-transform.f);
}

function mousePosConverter(canvasX, canvasY) {
	const rect = canvas.getBoundingClientRect();

	// Adjust for canvas transformations
	const transformedX = (canvasX - rect.left) / getScalor()[0];
	const transformedY = (canvasY - rect.top) / getScalor()[1];

	// Map to logical grid coordinates
	const logicalX = Math.floor(transformedX / gridSize) + minX;
	const logicalY = Math.floor(transformedY / gridSize) + minY;

	return [logicalX, logicalY];
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

function mirroredParts(parts, also_adds_base_parts = true) {
	let partsout = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis,global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newpart = partCopy(part)
			newpart.Location = partLocationFromCenter(location_rotations[0][i], part)
			newpart.Rotation = part.Rotation+(part.Rotation+location_rotations[1][i][0])%2*2
			newpart.FlipX = location_rotations[1][i][1]
			partsout.push(newpart)
		}
	}
	return partsout
}

function existingMirroredParts(parts, all_parts, also_adds_base_parts = true) {
	let partsout = []
	let locations = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis, global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			locations.push(partLocationFromCenter(location_rotations[0][i], part))
		}
	}
	for (let pos of locations) {
		for (let part of all_parts) {
			if (pos[0]===part.Location[0] && pos[1]===part.Location[1]) {
				partsout.push(part)
				break
			}
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

function addSupplyChains(part2, parts) {
	let part2Data = spriteData[part2.ID]
	let chainlist = [...global_supply_chains, ...global_crew_assignments]
	for (let part1 of parts) {
		let part1Data = spriteData[part1.ID]

		//No chain from a part to itself
		if (!isSameSprite(part1, part2)) {
			if (part1Data.tags.includes("crew") || part2Data.tags.includes("crew")) {
				const foundItem = global_crew_assignments.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_crew_assignments.push(generateSupplyChain(part1, part2))
				} else {
					value.push(part2)
				}
				
			} else {
				const foundItem = global_supply_chains.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_supply_chains.push(generateSupplyChain(part1, part2))
				} else {
					value.push(part2)
				}
			}
		}
	}
	updateCanvas()
}

function shiftMirrorCenter(vector) {
	global_mirror_center = [global_mirror_center[0]+vector[0], global_mirror_center[1]+vector[1]]
	updateCanvas()
	drawPreview(global_sprites_to_place)
}

function partBoundingBox(sprite) {
	const data = spriteData[sprite.ID]
	const sprite_size = data.real_size || data.sprite_size || data.size;
	let base_location = [...sprite.Location]
	if (!data.real_size && data.sprite_size) {
		let caze = (sprite.Rotation+1)%2
		if (upTurrets.includes(sprite.ID) && (sprite.Rotation === 0 || sprite.Rotation === 3)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		} else if (downTurrets.includes(sprite.ID) && (sprite.Rotation === 1 || sprite.Rotation === 2)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		}
	}
	if (sprite.Rotation % 2 === 0) {
		width = sprite_size[0];
		height = sprite_size[1];
	} else {
		width = sprite_size[1];
		height = sprite_size[0];
	}
	return [base_location, [base_location[0]+width, base_location[1]+height]];
}

function getSpriteTileLocations(sprite) {
	let box = partBoundingBox(sprite);
	let base_location = box[0];
	let bottom_right = box[1];
	let width = bottom_right[0] - base_location[0];
	let height = bottom_right[1] - base_location[1];
	let locations = [];

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			locations.push([base_location[0] + i, base_location[1] + j]);
		}
	}
	return locations;
}
