//This file is for functions that extract some kind of information.

function getPartData(part) {
    data = []
    for (const entry of part_toggles) {
        const key = entry.Key || {};
        if (part.Location[0] == key[0].Location[0] && part.Location[1] == key[0].Location[1]) {
            data.push(entry);
        }
    }
    return data;
}

function getShipDataMap() {
    let filtered_ship_data = new Map();

    filtered_ship_data.set("Author", shipdata.Author);
    filtered_ship_data.set("FlightDirection", shipdata.FlightDirection);
    filtered_ship_data.set("Name", shipdata.Name);
    filtered_ship_data.set("DefaultAttackFollowAngle", shipdata.DefaultAttackFollowAngle);
    filtered_ship_data.set("DefaultAttackRadius", shipdata.DefaultAttackRadius);
    filtered_ship_data.set("DefaultAttackRotation", shipdata.DefaultAttackRotation);

    return filtered_ship_data;
}

function getPartToggles(part) {
    toggles = [];
    for (toggle of part_toggles) {
        if (toggle.Key[0].ID == part["ID"]) {
            toggles.push(toggle);
        }
    }
    return toggles;
}

function getParts(parts, id = null, category = null) {
    parts_out = []
    for (sprite of parts) {
        if ((sprite.ID == id || id == null) && (category == null || category == spriteData[sprite["ID"]].category)) {
            parts_out.push(sprite)
        }
    }
    return parts_out
}

function getPartDataMap(part) {
    let part_data = new Map()
    let raw_data = getPartData(part)

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
    return part_data
}


