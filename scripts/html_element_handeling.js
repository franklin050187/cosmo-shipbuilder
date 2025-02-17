//This file is for html element variable declearations and their event handles

const cursor_mode = document.getElementsByName("cursor_mode");
const load_json_button = document.getElementById("loadButton");
const export_json_button = document.getElementById("exportButton");

const partsContainer = document.getElementById("parts-container");
const categoryButtons = document.querySelectorAll(".category-btn");

const togglesContainer = document.getElementById("toggles");
const togglesContainerInner = document.getElementById("toggle-selector-inside");
const togglesContainerOuter = document.getElementById("toggle-selector-outside");

const shiplink = document.getElementById("ship_link");
const generate_ship = document.getElementById("post_json");

const spriteNames = Object.keys(spriteData).sort();
const stats_select = document.getElementById("statsSelect");
const property_edit = document.getElementById("propertyEdit");
const help = document.getElementById("helpButton");
const recalculate_stats_button = document.getElementById("reCalculateButton");
const reset_camera_button = document.getElementById("restCameraButton");
const add_shell_button = document.getElementById("addShellButton");
const mirror_select = document.getElementById("mirrorSelect");
for (const spriteName of ["none", "vertical", "horizontal", "diagonal1", "diagonal2", "dot"]) {
	const option = document.createElement("option");
	option.value = spriteName;
	option.textContent = spriteName;
	mirror_select.appendChild(option);
}
for (const name of ["none", "stats", "warnings", "cost breakdown", "all"]) {
	const option = document.createElement("option");
	option.value = name;
	option.textContent = name;
	stats_select.appendChild(option);
}

const ship_property_select = document.getElementById("shipPropertySelect");
const ship_property_edit = document.getElementById("shipPropertyEdit");
const apply_ship_property_button = document.getElementById("applyShipPropertyButton");

const previewSprite = document.createElement("img");
const ship_stats_label = document.getElementById("shipStatsLabel");
const coordinates_label = document.getElementById("coord_on_canvas");

const hitbox_checkbox = document.getElementById("hitboxCheckbox");
hitbox_checkbox.addEventListener("change", () => {
	updateCanvas()
  });

previewSprite.id = "previewSprite";
document.body.appendChild(previewSprite);

// input and output for b64
const b64Input = document.getElementById("b64_input");
const loadB64Button = document.getElementById("load_b64");
// get url parameter b64
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const b64 = urlParams.get("url");
let loaded_button_category = undefined
if (b64) {
	b64Input.value = b64;
	get_json();
}

const picture_drop_zone = document.getElementById("drop-zone");
const picture_input = document.getElementById("file-input");
const picture_browse_button = document.getElementById("file-button");

function handleFileUpload(files) {
    if (files.length > 0) {
        console.log("Files selected:", files);
        getJsonFromPic(files[0]); 
    }
}

// Drag & Drop Functionality
picture_drop_zone.addEventListener("dragover", (event) => {
    event.preventDefault(); 
    picture_drop_zone.style.background = "#f0f0f0"; 
});

picture_drop_zone.addEventListener("dragleave", () => {
    picture_drop_zone.style.background = "white"; 
});

picture_drop_zone.addEventListener("drop", (event) => {
    event.preventDefault();
    picture_drop_zone.style.background = "white";
    handleFileUpload(event.dataTransfer.files);
});

picture_browse_button.addEventListener("click", () => picture_input.click());

picture_input.addEventListener("change", (event) => {
    handleFileUpload(event.target.files);
});

//ensures these are loaded after the corresponding functions in main.js
document.addEventListener("DOMContentLoaded", () => {
	export_json_button.addEventListener("click", export_json);
	load_json_button.addEventListener("click", loadJson);
	loadB64Button.addEventListener("click", get_json);
	apply_ship_property_button.addEventListener("click", applyShipProperty);
	recalculate_stats_button.addEventListener("click", handleRecalculateStats);
	generate_ship.addEventListener("click", generateShip);
	reset_camera_button.addEventListener("click", resetCamera);
	add_shell_button.addEventListener("click", handlePlaceArmorShell);

	//help.addEventListener("click", displayHelp);

	for (const radio of cursor_mode) {
		radio.addEventListener("click", handleCursorMode);
	}

	stats_select.addEventListener("change", handleStatsSelectionChange);
	ship_property_select.addEventListener("change", handleShipPropertySelectionChange);
	mirror_select.addEventListener("change", handleMirrorSelectionChange);	
});

//The tab bar above the canvas
const canvasContainer = document.getElementById('canvas-container');
const canvasAltContainer = document.getElementById('canvas-alt-container');
const logContainer = document.getElementById('message-log');

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
   	selectTab(tab)
  });
});

function selectTab(tab) {
	document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    if (tab.textContent.trim() === 'Canvas') {
		canvasContainer.style.display = 'block';
		canvasAltContainer.style.display = 'none';
    } else if (tab.textContent.trim() === 'Analysis') {
		canvasContainer.style.display = 'none';
		canvasAltContainer.style.display = 'block';
		canvasAltContainer.innerHTML = '<div class="canvas-alt-container">Not implemented yet</div>';
    } else if (tab.textContent.trim() === 'Modules') {
		canvasContainer.style.display = 'none';
		canvasAltContainer.style.display = 'block';
		canvasAltContainer.innerHTML = '<div class="canvas-alt-container">Also not implemented yet :(</div>';
	} 
}

// Function to load parts based on category
function loadParts(category) {
	partsContainer.innerHTML = ""; 
	for (let part of getParts(getOneOfEach(spriteData), isInTagsCondition(category))) {
		const partDiv = document.createElement("div");
		partDiv.classList.add("part-item");

		const button = document.createElement("button");
		button.classList.add("part-button")
		let name = part.ID.replace("cosmoteer.", "");
		let src = "./sprites/parts/" + name + ".png"

		button.innerHTML = `
		<img src="${src}" alt="${name}">
		<div>${name}</div>
		<div>Cost: ${spriteData[part.ID].cost*1000}</div>
		`;
		button.addEventListener("click", () => {
			global_sprites_to_place = [generatePart(part.ID)]
		});
		partDiv.appendChild(button);
    	partsContainer.appendChild(partDiv);
	};
}

function loadResources(category) {
	partsContainer.innerHTML = ""; 
	for (let resource in resourceData) {
		if (resourceData[resource].category === category) {
			const partDiv = document.createElement("div");
			partDiv.classList.add("part-item");

			const button = document.createElement("button");
			button.classList.add("part-button")
			let name = resource;
			let src = "sprites/resources/" + name + ".png"

			button.innerHTML = `
			<img src="${src}" alt="${name}">
			<div>${name}</div>
			<div>Cost: ${resourceData[name].cost}</div>
			`;
			button.addEventListener("click", () => {
				global_resources_to_place = [generateResource(name)]
			});
			partDiv.appendChild(button);
			partsContainer.appendChild(partDiv);
		}
	};
}

function loadCrewRoles(category) {
	partsContainer.innerHTML = ""; 
	for (let role in crew_roles) {
		const partDiv = document.createElement("div");
		partDiv.classList.add("part-item");

		const button = document.createElement("button");
		button.classList.add("part-button")
		let name = crew_roles[role].Name;
		let src = "sprites/crew/role_base.png"

		button.innerHTML = `
		<img src="${src}" alt="${name}">
		<div>${name}</div>
		`;
		button.addEventListener("click", () => {
			global_crew_role_to_place = crew_roles[role]
		});
		partDiv.appendChild(button);
		partsContainer.appendChild(partDiv);
	}
}

function loadToggles(parts) {
	let toggles = []
	include_toggle = true

	togglesContainerInner.innerHTML = ""
	togglesContainerOuter.innerHTML = ""

	let all_toggles = getPartData(parts)

	for (const toggle of all_toggles) {
		for (const old_toggle of toggles) {
			if (isSameToggleType(old_toggle, toggle)) {
				include_toggle = false
			}
		}
		if (include_toggle) {
			toggles.push(toggle)
		} else {
			include_toggle = true
		}
	}
	
	for (let toggle of toggles) {
		togglesContainerOuter.classList.add("part-toggle")
		const button = document.createElement("button")
		button.classList.add("part-button")

		let name = toggle.Key[1]
		let value = toggle.Value
		let options = toggleData[name].option
		const optionMap = Object.fromEntries(options.map(([name, key]) => [key, name]));
		const getOption = key => optionMap[key] || null;
		let pic_name = getOption(value)

		button.innerHTML = `<img src="sprites/toggles/${pic_name}.png" alt="${name}">`

		button.addEventListener("click", () => {
			togglesContainerInner.innerHTML = ""
			for (let i=0; i<options.length; i++) {
				let option_name = options[i][0]
				togglesContainerInner.classList.add("part-toggle")
				const button = document.createElement("button")
				button.classList.add("part-button")
				button.innerHTML = `<img src="sprites/toggles/${option_name}.png" alt="${name}">`
				button.addEventListener("click", () => {
					for (let toggle2 of all_toggles) {
						if (toggle2.Key[1] === name) {
							toggle2.Value = options[i][1]
						}
					}
					loadToggles(global_selected_sprites)
				})
				togglesContainerInner.appendChild(button)
			}
		})
		togglesContainerOuter.appendChild(button)
	}
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

function handleShipPropertySelectionChange() {
	ship_property_edit.value = ship_property_select.value;
}

function handleMirrorSelectionChange() {
	if (mirror_select.value === "none") {
		global_mirror_axis = []
	} else if (mirror_select.value === "vertical") {
		global_mirror_axis = [{Rotation: 0, Type: "linear"}]
	} else if (mirror_select.value === "horizontal") {
		global_mirror_axis = [{Rotation: 1, Type: "linear"}]
	} else if (mirror_select.value === "diagonal1") {
		global_mirror_axis = [{Rotation: 0, Type: "diagonal"}]
	} else if (mirror_select.value === "diagonal2") {
		global_mirror_axis = [{Rotation: 1, Type: "diagonal"}]
	} else if (mirror_select.value === "dot") {
		global_mirror_axis = [{Rotation: 0, Type: "dot"}]
	}
	updateCanvas()
}

function handleRecalculateStats() {
	updateShipStatsVariable()
	updateShipStats()
}

function displayHelp() {
	document.getElementById('helpText').innerHTML = global_help_message;
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('helpModal').style.display = 'block';
}

function closeHelp() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('helpModal').style.display = 'none';
}

function resetPlacementCategories() {
    const partsContainer = document.getElementById('parts-container')
	const categoriesContainer = document.querySelector('.categories')
	categoriesContainer.innerHTML = ''
    if (!partsContainer) return;

	let categories = []

    // Define parts for each category 
	if (["Select", "Place", "Delete", "Supply", "Move"].includes(cursorMode)) {
		categories = [
			{ category: 'energy weapon', label: 'Energy Weapon Part' },
			{ category: 'projectile weapon', label: 'Projectile Weapon Part' },
			{ category: 'defense', label: 'Defense Part' },
			{ category: 'flight', label: 'Flight Part' },
			{ category: 'crew_transport', label: 'Crew Transport Part' },
			{ category: 'power', label: 'Power Part' },
			{ category: 'factory', label: 'Factory Part' },
			{ category: 'utilities', label: 'Utilities Part' },
			{ category: 'structure', label: 'Structure Part' },
			{ category: 'storage', label: 'Storage Part' },
		]
	} else if (cursorMode === "Resource") {
		categories = [
			{ category: 'ammo', label: 'Ammo' },
			{ category: 'ore', label: 'Raw Ores' },
			{ category: 'fuel', label: 'Fuel' },
			{ category: 'refined', label: 'Refined' },
		]
	} else if (cursorMode === "Crew") {
		categories = [
			{ category: 'crew', label: 'Crew' },
		]
	} 

    // Populate the container with parts for all categories
    categories.forEach(({ category, label }) => {
        const button = document.createElement('button');
        button.classList.add('category-btn');
        button.dataset.category = category;
        button.textContent = label;
        categoriesContainer.appendChild(button);
    });

	const categoryButtons = document.querySelectorAll('.categories .category-btn')
	// Event listeners for category buttons
	if (["Select", "Place", "Delete", "Supply", "Move"].includes(cursorMode)) {
		categoryButtons.forEach(btn => {
			btn.addEventListener("click", () => {
				const category = btn.dataset.category;
				loadParts(category);
			});
  		});
		loadParts("energy weapon")
	} else if (cursorMode === "Resource") {
		categoryButtons.forEach(btn => {
			btn.addEventListener("click", () => {
				const category = btn.dataset.category;
				loadResources(category);
			});
  		});
		loadResources("ammo")
	} else if (cursorMode === "Crew") {
		categoryButtons.forEach(btn => {
			btn.addEventListener("click", () => {
				const category = btn.dataset.category;
				loadCrewRoles(category);
			});
  		});
		loadCrewRoles("crew")
	}
	
}

function handleStatsSelectionChange() {
	handleRecalculateStats()
}

function handlePlaceArmorShell() {
	const userInput = prompt("How many blocks thick should the shell be?:");
	const thickness = Number(userInput);
	placeArmorShell(thickness)
}

function placeArmorShell(thickness) {
	let points = getAllCornerLocations(sprites)
	const result = smallestEnclosingCircle(points);

	let r1 = result.radius;
	let r2 = r1 + thickness;
	let tiles = getCircleRingTiles(result.center, r1, r2);
	
	let parts = []
	for (let tile of tiles) {
		let part = generatePart("cosmoteer.armor", tile)
		parts.push(part)
	}
	place_sprites(repositionPartsRelative(parts))
}
