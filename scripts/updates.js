function updateNonVisuals() {
	updateShipStats()
	updateShipToggleSelection();
}

function updateObjectExistences() {
	console.log(...global_part_properties)
	deleteNonExistingproperties()
	console.log(...global_part_properties)
	deleteDuplicateProperties()
	console.log(...global_part_properties)
}

function updateShipToggleSelection() {
	ship_property_select.innerHTML = "";
	for (const [key, toggle] of getShipDataMap()) {
		const option = document.createElement("option");
		option.value = toggle;
		option.textContent = key;
		ship_property_select.appendChild(option);
	}
	handleShipPropertySelectionChange();
}

function updateShipStatsVariable() {
    all_ship_stats = getShipStats(getShip(sprites, global_doors, global_part_properties))
    return all_ship_stats
}

function updateShipStats() {
    parts = sprites
    stats = updateShipStatsVariable()
    warnings = getWarnings(stats)
    ship_stats_label.innerHTML = 'Weight :' + stats.weight.toFixed(0).toString() + 'kg<br>'
    ship_stats_label.innerHTML += 'Acceleration :' + stats.acceleration[0].toFixed(2).toString() + 'm/s^2<br>'
    ship_stats_label.innerHTML += 'Max speed :' + stats.speed.toFixed(2).toString() + 'm/s<br>'
    ship_stats_label.innerHTML += 'Thrust :' + stats.thrust.toString() + 'N<br>'
    ship_stats_label.innerHTML += 'Cost :' + stats.cost.toFixed(0).toString() + '₡<br>'
    const commandPoints = stats.command_points;
    const commandCost = stats.command_cost;
    const commandPointText = `Command Points : ${commandCost}/${commandPoints}`;
    if (commandCost > commandPoints) {
        ship_stats_label.innerHTML += `<span style="color: red">${commandPointText}</span><br>`;
    } else {
        ship_stats_label.innerHTML += `${commandPointText}<br>`;
    }
    ship_stats_label.innerHTML += 'Crew :' + stats.crew.toString() + '웃<br>'
    ship_stats_label.innerHTML += 'moment of inertia:' + stats.inertia.toFixed(2).toString()+ 'kgm^2<br>'
    ship_stats_label.innerHTML += 'hyperdrive efficiency:' + (stats.hyperdrive_efficiency*100).toString() + '%<br>'
    ship_stats_label.innerHTML += 'crew count:' + stats.crew.toString() + '<br>'
    ship_stats_label.innerHTML += '<br>Warnings:'
    for (warning of warnings) {
        ship_stats_label.innerHTML += "<br>"
        ship_stats_label.innerHTML += warning.message
    }
}

function updateCoordinates(canvasPositionX, canvasPositionY) {
	coordinates_label.innerHTML = `Coordinates : ${canvasPositionX.toFixed(0).toString()},${canvasPositionY.toFixed(0).toString()}`;
}

function updateSpriteSelection() {
	const old_toggles = [];
	include_toggle = true;

	property_select.innerHTML = ""; //Update Selection

	for (sprite of global_selected_sprites) {
		for (const toggle of getPartData(sprite)) {
			for (const old_toggle of old_toggles) {
				if (isSameToggleType(old_toggle, toggle)) {
					include_toggle = false;
				}
			}
			if (include_toggle) {
				const option = document.createElement("option");
				const toggle_name = toggle.Key[1];

				option.value = JSON.stringify(toggle);
				option.textContent = toggle_name;
				property_select.appendChild(option);

				old_toggles.push(toggle);
			} else {
				include_toggle = true;
			}
		}
	}
}

function deleteNonExistingproperties() {
	let new_part_properties = []
	for (let property of global_part_properties) {
		for (let part of sprites) {
			if (isSameSprite(property.Key[0], part)) {
				new_part_properties.push(property)
			}
		}
	}
	global_part_properties = new_part_properties
}

function deleteDuplicateProperties() {
	let new_part_properties = [];
	for (let i = 0; i < global_part_properties.length; i++) {
		let isDuplicate = false;
		for (let j = 0; j < new_part_properties.length; j++) {
			if (
				isSameSprite(global_part_properties[i].Key[0], new_part_properties[j].Key[0]) &&
				global_part_properties[i].Key[1] === new_part_properties[j].Key[1]
			) {
				isDuplicate = true;
				break;
			}
		}
		if (!isDuplicate) {
			new_part_properties.push(global_part_properties[i]);
		}
	}
	global_part_properties = new_part_properties;
}