//This file is for html element variable declearations and their event handles

const cursor_mode = document.getElementsByName("cursor_mode");
const json_import_text = document.getElementById("jsonInput");
const load_json_button = document.getElementById("loadButton");
const export_json_button = document.getElementById("exportButton");

const shiplink = document.getElementById("ship_link");
const generate_ship = document.getElementById("post_json");

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

//ensures these are loaded after the corresponding functions in main.js
document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("spriteCanvas"); 
	canvas.addEventListener("mousemove", handleCanvasMouseMove);
	canvas.addEventListener("click", handleCanvasClick);
	canvas.addEventListener("contextmenu", handleRightClick); // Listen for right-click
	export_json_button.addEventListener("click", export_json);
	load_json_button.addEventListener("click", loadJson);
	apply_property_button.addEventListener("click", applyProperty);
	spriteSelect.addEventListener("click", applyProperty);
	loadB64Button.addEventListener("click", get_json);
	apply_ship_property_button.addEventListener("click", applyShipProperty);
	generate_ship.addEventListener("click", generateShip);

	for (const radio of cursor_mode) {
		radio.addEventListener("click", handleCursorMode);
	}
	document
		.getElementById("spriteSelect")
		.addEventListener("change", handleSpriteSelectionChange);
	property_select.addEventListener("change", handlePropertySelectionChange);

	ship_property_select.addEventListener(
		"change",
		handleShipPropertySelectionChange,
	);
  });

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




