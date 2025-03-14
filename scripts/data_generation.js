function generatePart(id, location=[0,0], rotation=0, flipX=false) {//Example: "Parts": [{"FlipX": false, "ID": "cosmoteer.storage_2x2", "Location": [4, 8], "Rotation": 0}]
    return {
        FlipX: flipX,
        ID: id,
        Location: [...location],
        Rotation: rotation,
    }
}

function generateDoor(location=[0,0], orientation=0) {//Example: {"Cell": [${location}], "ID": "cosmoteer.door", "Orientation": ${(sprite.Rotation + 1) % 2}}
   return {"Cell": location, "ID": "cosmoteer.door", "Orientation": orientation}
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

function propertyCopy(property) {
    return {"Key": [{"FlipX": property.Key[0].FlipX, "ID": property.Key[0].ID, "Location": [...property.Key[0].Location], "Rotation": property.Key[0].Rotation}, property.Key[1]], "Value": property.Value}
}

function roleSourceCopy(source) {
    return {"Key": partCopy(source.Key), "Value": source.Value}
}

function propertiesCopy(properties) {
    let list = []
    for (let property of properties) {
        list.push(propertyCopy(property))
    }
    return list
}

function supplyChainCopy(chain) {
    return {Key: partCopy(chain.Key), Value: partsCopy(chain.Value)} 
}

function generatePropertiesForPart(part) {
    properties = []
    if (spriteData[part.ID].tags.includes("on_off")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "on_off"], "Value": 1})
    }
    if (spriteData[part.ID].tags.includes("light")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "light_strength"], "Value": 0})
    }
    if (spriteData[part.ID].tags.includes("alternating_fire")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "fire_alternating"], "Value": 0})
    }
    if (spriteData[part.ID].tags.includes("weapon") || spriteData[part.ID].tags.includes("weapon_like")) {
        properties.push({"Key": [{"FlipX": part.FlipX, "ID": part.ID, "Location": [...part.Location], "Rotation": part.Rotation}, "fire_mode"], "Value": 1})
    }
    if (part.ID === "cosmoteer.missile_launcher") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.missile_launcher", "Location": [...part.Location], "Rotation": part.Rotation}, "missile_type"], "Value": 0})
    } else if (part.ID === "cosmoteer.engine_room") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.engine_room", "Location": [...part.Location], "Rotation": part.Rotation}, "distribute_power"], "Value": 1})
    } else  if (part.ID === "cosmoteer.tractor_beam_emitter") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.tractor_beam_emitter", "Location": [...part.Location], "Rotation": part.Rotation}, "tractor_mode"], "Value": 0})
    } else  if (part.ID === "cosmoteer.ion_beam_prism") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.ion_beam_prism", "Location": [...part.Location], "Rotation": part.Rotation}, "target_prism"], "Value": 0})
    } else  if (part.ID === "cosmoteer.chaingun") {
        properties.push({"Key": [{"FlipX": false, "ID": "cosmoteer.chaingun", "Location": [...part.Location], "Rotation": part.Rotation}, "target_chaingun"], "Value": 0})
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

function generatePartsTargets(parts, target_pos) {
    let targets = []
    for (let part of parts) {
        let id = part.ID
        let location = part.Location
        let rotation = part.Rotation
        
        if (id === "cosmoteer.ion_beam_prism") {
            targets.push({"Key": [{"FlipX": false, "ID": id, "Location": location, "Rotation": 0}, "Turret"], "Value": target_pos})
            targets.push({"Key": [{"FlipX": false, "ID": id, "Location": location, "Rotation": rotation}, "IonBeamChainToggle"], "Value": target_pos})
            
        } else if (id === "cosmoteer.chaingun") {
            targets.push({"Key": [{"FlipX": false, "ID": id, "Location": location, "Rotation": 0}, "Turret"], "Value": target_pos})
            targets.push({"Key": [{"FlipX": false, "ID": id, "Location": location, "Rotation": rotation}, "IonBeamChainToggle"], "Value": target_pos})

        }
    }
    return targets
}

function generateSupplyChain(part1, part2) {//Example: [{"Key": {"FlipX": false, "ID": "cosmoteer.crew_quarters_med", "Location": [4, 10], "Rotation": 0}, "Value": [{"FlipX": false, "ID": "cosmoteer.point_defense", "Location": [4, 9], "Rotation": 0}]}], 
    return {Key: part1, Value: [part2]}
}

function generateResource(id, location=[0,0]) {
    return {"Value": id, "Key": [...location]}
}

function resourceCopy(resource) {
    return generateResource(resource.Value, resource.Key)
}

function generateControlGroup(number) {//Example: "PartControlGroups": [{"Key": 0, "Value": [{"FlipX": false, "ID": "cosmoteer.laser_blaster_small", "Location": [-4, -4], "Rotation": 0}]}]
    return {"Key": number, "Value": []}
}

function generateRoleSource(part, role) {//Example: {"Key": {"FlipX": false, "ID": "cosmoteer.crew_quarters_med", "Location": [-7, -5], "Rotation": 2}, "Value": 2147483650}
    return {"Key": part, "Value": role.ID}
}

function generateDoorAsPart(door) {
    return generatePart(door.ID, door.Cell, (door.Orientation+1)%2)
}

function generateDoorsAsParts(doors) {
    parts = []
    for (let door of doors) {
        parts.push(generateDoorAsPart(door))
    }
    return parts
}
