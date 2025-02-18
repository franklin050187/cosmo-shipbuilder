//Deployment on a different site requires modifications off the preloadSprites function

function generateShip() {
	// send post request to generate ship
	const json_to_post = JSON.stringify(getJson());

	const xhr = new XMLHttpRequest();
	const url =
		"https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/generate";

	xhr.open("POST", url, true);
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

async function loadJsonFromPic(file) {
	const shipData = await parseShip(file)
	loadJson(JSON.stringify(shipData))
}

async function loadPartialJsonFromPic(file) {
	const shipData = await parseShip(file)
	let parts = shipData.Parts === "Unset" ? [] : shipData.Parts
	let doors = generateDoorsAsParts(shipData.Doors === "Unset" ? [] : shipData.Doors)
	let toggles = shipData.PartUIToggleStates === "Unset" ? [] : shipData.PartUIToggleStates
	let chains = [...(shipData.CrewSourceTargets === "Unset" ? [] : shipData.CrewSourceTargets), ...(shipData.CrewSourceTargets === "Unset" ? [] : shipData.CrewSourceTargets)]
	
	copySpecified(parts, doors, toggles, chains)
	log("Ship copied to clipboard")
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

function getJson() {
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
	shipdata.WeaponShipRelativeTargets = global_weapon_targetes

	for ([key, value] of getShipDataMap()) {
		shipdata[key] = value;
	}
	// convert shipdata to json
	return shipdata
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
	redrawEntireCanvas()
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

function mousePos(event, do_floor = true) {
	let transform = canvas.getContext("2d").getTransform()
	return mousePosConverter(event.clientX-transform.e, event.clientY-transform.f, do_floor)
}

function mousePosConverter(canvasX, canvasY, do_floor = true) {
	const rect = canvas.getBoundingClientRect()

	// Adjust for canvas transformations
	const transformedX = (canvasX - rect.left) / getScalor()[0]
	const transformedY = (canvasY - rect.top) / getScalor()[1]


	let logicalX = 0
	let  logicalY = 0

	if (do_floor) {
		// Map to logical grid coordinates
		logicalX = Math.floor(transformedX / gridSize) + minX
		logicalY = Math.floor(transformedY / gridSize) + minY
	} else {
		logicalX = transformedX / gridSize + minX
		logicalY = transformedY / gridSize + minY
	}
	

	return [logicalX, logicalY]
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


