function generatePart(id, location=[0,0], rotation=0, flipX=false) {//Example: "Parts": [{"FlipX": false, "ID": "cosmoteer.storage_2x2", "Location": [4, 8], "Rotation": 0}]
    return {
        FlipX: flipX,
        ID: id,
        Location: [...location],
        Rotation: rotation,
    }
}

function partCopy(part) {
    return generatePart(part.ID, [...part.Location], part.Rotation, part.FlipX)
}

function partsCopy(parts) {
    let list = []
    for (let part of parts) {
        list.push(partCopy(part))
    }
    return list
}

function generatePropertiesForPart(part) {
    properties = []
    if (spriteData[part.ID].tags.includes("on_off")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "on_off"], "Value": 1})
    }
    if (spriteData[part.ID].tags.includes("weapon") || spriteData[part.ID].tags.includes("weapon_like")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "fire_mode"], "Value": 0})
    }
    if (part.ID === "cosmoteer.missile_launcher") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.missile_launcher", "Location": [...part.Location], "Rotation": part.Rotation}, "missile_type"], "Value": 0})
    }
    if (spriteData[part.ID].tags.includes("fire_pref")) {
        properties.push({"Key": [{"FlipX": false, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "fire_pref"], "Value": 0})
    }
    return properties
}

function generatePropertiesForParts(parts) {
    properties = []
    for (let part of parts) {
        properties.push(...generatePropertiesForPart(part))
    }
    return properties
}

function getOneOfEachPart() {
    let parts = []
	for (let id in spriteData) {
		parts.push(generatePart(id))
	}
    return parts
}

function generateSupplyChain(part1, part2) {//Example: [{"Key": {"FlipX": false, "ID": "cosmoteer.crew_quarters_med", "Location": [4, 10], "Rotation": 0}, "Value": [{"FlipX": false, "ID": "cosmoteer.point_defense", "Location": [4, 9], "Rotation": 0}]}], 
    return {Key: part1, Value: part2}
}

