//This file is for functions that extract some kind of information.

function getPartData(part) {
	data = [];
	for (const entry of part_toggles) {
		const key = entry.Key || {};
		if (
			part.Location[0] === key[0].Location[0] &&
			part.Location[1] === key[0].Location[1]
		) {
			data.push(entry);
		}
	}
	return data;
}

function getShipDataMap() {
	const filtered_ship_data = new Map();

	filtered_ship_data.set("Author", shipdata.Author);
	filtered_ship_data.set("FlightDirection", shipdata.FlightDirection);
	filtered_ship_data.set("Name", shipdata.Name);
	filtered_ship_data.set(
		"DefaultAttackFollowAngle",
		shipdata.DefaultAttackFollowAngle,
	);
	filtered_ship_data.set("DefaultAttackRadius", shipdata.DefaultAttackRadius);
	filtered_ship_data.set(
		"DefaultAttackRotation",
		shipdata.DefaultAttackRotation,
	);

	return filtered_ship_data;
}

function getPartToggles(part) {
	toggles = [];
	for (toggle of part_toggles) {
		if (toggle.Key[0].ID === part.ID) {
			toggles.push(toggle);
		}
	}
	return toggles;
}

function getParts(id = null, category = null) {
	parts = [];
	for (sprite of sprites) {
		if (
			(sprite.ID === id || id == null) &&
			(category == null || category === spriteData[sprite.ID].category)
		) {
			parts.push(sprite);
		}
	}
	return parts;
}

function getPartDataMap(part) {
	const part_data = new Map();
	const raw_data = getPartData(part);

	for (const entry of raw_data) {
		const key = entry.Key || {};

		// Power toggle (1 is on 0 is off)
		if (key.includes("on_off")) {
			part_data.set("on_off", entry.Value);
		}

		//fire mode (hold fire:2^32-1, fire at target: 1, fire at will: 0, autofire: 2)
		if (key.includes("fire_mode")) {
			part_data.set("fire_mode", entry.Value);
		}

		//missile type (3 is mine, 1 is emp, 2 is nuke, 0 is he)
		if (key.includes("missile_type")) {
			part_data.set("missile_type", entry.Value);
		}
	}
	return part_data;
}

//Unfinished cause it seemed annoying to do and its not very important right now
/*function getCGsMagsMap() {
    let mags = getParts("cosmoteer.chaingun_magazine")
    let cgs = getParts("cosmoteer.chaingun_magazine")
    let location = [0,0]
    for (cg_part of cgs) {
        for (mag_part of mags) {
            if () {

            }
        }
    }
}*/
