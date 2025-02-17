//Deployment on a different site requires modifications off the preloadSprites function

const gridSize = 32; // Size of each grid cell
let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let sprite_delete_mode = []; // To store the sprite delete mode
let global_sprites_to_place = [generatePart("cosmoteer.corridor")]; // To store the sprites to place
let global_properties_to_apply = []
let global_selected_sprites = []
let global_unmirrored_selected_sprites = []
let global_toggles_to_add = []
let global_mirror_axis = []
let global_mirror_center = [0,0]
let global_crew_assignments = []
let global_supply_chains = []
let global_sprites_to_draw = [] //Saves the sprites that are yet to be drawn
let global_sprites_to_delete = [] //Saves the sprites that are drawn to which should be deleted
let global_doors_to_draw = [] //Saves the doors that are yet to be drawn
let global_doors_to_delete = [] //Saves the doors that are drawn to which should be deleted
let global_recently_placed = [] //Saves recently placed parts
let global_log = {0:"", 1:"", 2:""}

let global_copied_parts = []
let global_copied_doors = []
let global_copied_properties = []

let global_previous_mirror_mode = "vertical"
let sprites = []; // To store the sprites
let all_ship_stats = undefined

// adjust canvas size
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0; 

let shipdata = {}; // To store the ship data
let cursorMode = "Place"; // Initial cursor mode
let global_doors = []; // To store the doors
let global_resources = []; // To store the resources
let global_resources_to_place = []
let global_zoom_factor = 1
let global_canvases = [canvas, resource_canvas, drawing_canvas, preview_canvas, door_canvas, hitbox_canvas, grid_canvas]
let global_crew_role_to_place = undefined
let global_crew_roles = []
let global_crew_role_sources = []

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

function get_json() {//Gets the json from a picture with the url in the url text field
	const b64Input = document.getElementById("b64_input");
	const encodedB64 = b64Input.value.replace(/-/g, "+").replace(/_/g, "/");
	const jsonInput = document.getElementById("b64_input");
	const xhr = new XMLHttpRequest();
	const url = `https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/edit?url=${encodedB64}`;
	xhr.open("GET", url, true);
	xhr.onload = () => {
		if (xhr.status === 200) {
			jsonInput.value = xhr.responseText;
			loadJson();
		}
	};
}

async function getJsonFromPic(file) {
	const arrayBuffer = await file.arrayBuffer();
	const shipData = await parseShipFile(file);

	console.log(shipData)
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Removes the data URL prefix
        reader.onerror = error => reject(error);
    });
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
	resetPlacementCategories()
	if (cursorMode === "Place") {
		if (global_sprites_to_place.length === 0 || global_sprites_to_place.includes("cosmoteer.delete")) {
			switchPartsToPlace([generatePart("cosmoteer.corridor")])
		}
	} else if (cursorMode === "Delete") {
		switchPartsToPlace([])
	} else if (cursorMode === "Move") {
		switchPartsToPlace([])
	} else if (cursorMode === "Resource") {
		switchPartsToPlace([])
		global_resources_to_place = [generateResource("bullet")];
	} else if (cursorMode === "Crew") {
		global_crew_role_to_place = crew_roles["Supply"]
	}
	if (cursorMode != "Resource") {
		global_resources_to_place = []
	}
	if (cursorMode != "Crew") {
		global_crew_role_to_place = undefined
	}
	if (cursorMode != "Select") {
		global_selected_sprites = []
		selectParts([])
	}
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
	updateObjectExistences()
	shipdata.Doors = global_doors
	shipdata.NewFlexResourceGridTypes = global_resources
	shipdata.Parts = new_parts
	shipdata.PartUIToggleStates = global_part_properties
	shipdata.ResourceSupplierTargets = global_supply_chains
	shipdata.CrewSourceTargets = global_crew_assignments
	shipdata.PartControlGroups = global_control_groups
	shipdata.Roles = global_crew_roles
	shipdata.CrewSourceRoles = global_crew_role_sources

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
	global_doors = [];
	global_resources = [];
	global_part_properties = [];
	if (typeof json !== 'string') {
        json = b64Input.value;
    }
	const data = JSON.parse(json);
	const part_data = Array.isArray(data.Parts) ? data.Parts : [];
	const doordata = Array.isArray(data.Doors) ? data.Doors : [];
	const crew_data = Array.isArray(data.Crew) ? data.Crew : [];
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
		global_doors.push(door);
	}

	for (const resource of resource_data) {
		global_resources.push(resource);
	}

	for (const toggle of partUIToggleStates) {
		global_part_properties.push(toggle);
	}

	global_crew_roles.push(...crew_data)

	updateNonVisuals()
	global_sprites_to_draw.push(...part_data)
	updateCanvas()
}

function preloadSprites() {
	// Iterate over the keys (IDs) in the spriteData object
	for (const spriteID of Object.keys(spriteData)) {
		const imageName = spriteID.replace("cosmoteer.", "")
		const img = new Image();
		img.src = `sprites/parts/${imageName}.png`;
		spriteCache[imageName] = img; // Store the image in the cache
	}

	// Preload specific images for different missile types
	spriteCache.nuke_launcher = new Image();
	spriteCache.nuke_launcher.src = "./sprites/parts/nuke_launcher.png";

	spriteCache.emp_launcher = new Image();
	spriteCache.emp_launcher.src = "./sprites/parts/emp_launcher.png";

	spriteCache.mine_launcher = new Image();
	spriteCache.mine_launcher.src = "./sprites/parts/mine_launcher.png";
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

function selectParts(parts, unmirrored_parts_in) {
	let unmirrored_parts = unmirrored_parts_in || parts
	for (let part of parts) {
		for (let sprite of global_selected_sprites) {
			if (isSameSprite(sprite, part)) {
				break
			}
		}
		global_selected_sprites.push(part)
	}
	for (let part of unmirrored_parts) {
		for (let sprite of global_selected_sprites) {
			if (isSameSprite(sprite, part)) {
				break
			}
		}
		global_unmirrored_selected_sprites.push(part)
	}
	
	updateCanvas()
	updateSpriteSelection();
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

function doIfCursorOverPart(event, code) {
	const pos = mousePos(event);
	let part = findSprite(pos[0], pos[1])
	if (part) {
		code(part);
	}
}

function doIfCursorOverDoor(event, code) {
	const pos = mousePos(event);
	let part = findDoor(pos[0], pos[1])
	if (part) {
		code(part);
	}
}

function addSupplyChains(part2, parts) {
	let part2Data = spriteData[part2.ID];
	for (let part1 of parts) {
		let part1Data = spriteData[part1.ID];

		// No chain from a part to itself
		if (!isSameSprite(part1, part2)) {
			if (part1Data.tags.includes("crew") || part2Data.tags.includes("crew")) {
				const foundItem = global_crew_assignments.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_crew_assignments.push(generateSupplyChain(part1, part2));
				} else if (!value.some(sprite => isSameSprite(sprite, part2))) {//No duplicate chains
					value.push(part2);
				}
			} else {
				const foundItem = global_supply_chains.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_supply_chains.push(generateSupplyChain(part1, part2));
				} else if (!value.some(sprite => isSameSprite(sprite, part2))) {//No duplicate chains
					value.push(part2);
				}
			}
		}
	}
	updateCanvas();
}

function shiftMirrorCenter(vector) {
	global_mirror_center = [global_mirror_center[0]+vector[0], global_mirror_center[1]+vector[1]]
	updateCanvas()
	drawPreview(global_sprites_to_place, global_resources_to_place)
}

function getOneOfEach(data) {
    let parts = []
	for (let id in data) {
		parts.push(generatePart(id))
	}
    return parts
}

function removeDuplicates(array, isSame) {
	let uniqueArray = [];
	for (let item of array) {
		let isUnique = true;
		for (let uniqueItem of uniqueArray) {
			if (isSame(item, uniqueItem)) {
				isUnique = false;
				break;
			}
		}
		if (isUnique) {
			uniqueArray.push(item);
		}
	}
	return uniqueArray;
}

function changeMirrorMode(mode) {
	if (mirror_select.value != "none") {
		global_previous_mirror_mode = mirror_select.value
	}
	mirror_select.value = mode
	handleMirrorSelectionChange()
}

function log(string) {
	global_log[2] = global_log[1]
	global_log[1] = global_log[0]
	global_log[0] = string
	logContainer.innerHTML = `<p>${global_log[2]}</p> <p>${global_log[1]}</p> <p>${global_log[0]}</p>`
}


