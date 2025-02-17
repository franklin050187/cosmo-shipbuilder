//This file is for functions that extract some kind of information.

function getPartData(parts) {
	data = []
	for (let part of parts) {
		for (const entry of global_part_properties) {
			const key = entry.Key || {};
			if (isSameSprite(part, key[0])) {
				data.push(entry)
			}
		}
	}
	return data;
}

function getShipDataMap() {
	const filtered_ship_data = new Map()

	filtered_ship_data.set("Author", shipdata.Author)
	filtered_ship_data.set("FlightDirection", shipdata.FlightDirection)
	filtered_ship_data.set("Name", shipdata.Name)
	filtered_ship_data.set("DefaultAttackFollowAngle",shipdata.DefaultAttackFollowAngle)
	filtered_ship_data.set("DefaultAttackRadius", shipdata.DefaultAttackRadius)
	filtered_ship_data.set("DefaultAttackRotation",shipdata.DefaultAttackRotation)

	return filtered_ship_data;
}

function getParts(parts, condition) {
    parts_out = []
    for (let part of parts) {
        if (condition(part)) {
            parts_out.push(part)
        }
    }
    return parts_out
}

function getPartDataMap(part) {
	const part_data = new Map();
	const raw_data = getPartData([part]);

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


