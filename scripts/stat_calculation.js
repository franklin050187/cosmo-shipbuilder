//This file is for values that need to be calculated

//A collection of all the ship stats calculated once to avoid dublicate calculations
function getShipStats(ship) {
    let stats = {}
    stats.ship = ship
    stats.parts = ship.parts
    stats.resources = ship.resources
    stats.cost = getShipCost(stats)
    stats.command_points = getShipCommandPoints(stats, null, null)
    stats.command_cost = getShipCommandCost(stats)
    stats.dps = shipDps(stats)
    stats.lighnessCoeff = shipLightnessCoeff(stats)
    stats.crew = crewCount(stats)
    stats.connection_graph = getShipPartConnectionGraph(stats)
    stats.connection_graph_partition = getConnectedComponents(stats.connection_graph[0],stats.connection_graph[1])
    stats.walkable_connection_graph = getShipPartWalkableConnectionGraph(stats)
    stats.walkable_connection_graph_partition = getConnectedComponents(stats.walkable_connection_graph[0], stats.walkable_connection_graph[1])
    stats.neighbour_map = partNeighbourMap(stats.connection_graph)
    stats.tag_map = getPartTagMap(stats)
    stats.weight = shipWeight(stats)
    stats.thrust = shipThrustVector(stats)
    stats.acceleration = shipAcceleration(stats, 0)
    stats.com = ship_com_location(stats)
    stats.speed = shipMaxSpeed(stats, 0)
    stats.inertia = momentOfInertiaShip(stats)
    stats.hyperdrive_efficiency = getShipHyperdriveEfficiency(stats)
    stats.primary_weapon = getPrimaryWeaponID(stats)
    stats.isUl = isUl(stats)
    stats.archetype = shipArchetype(stats)
    return stats
} 

function getShipCost(stats) {
    sum = 0;
    //regular part price
    for (sprite of stats.parts) {
        sum += spriteData[sprite["ID"]].cost;
    }
    for (resource of stats.resources) {
        sum += resourceData[resource.Value].cost/1000;
    }
    //extra costs from loaded missiles
    for (toggle of global_part_properties) {
        if (toggle.Key[1] == "missile_type") {
            if (toggle.Value == 0) {
                sum += 0.096;
            }
            if (toggle.Value == 1) {
                sum += 0.18;
            }
            if (toggle.Value == 2) {
                sum += 0.432;
            }
            if (toggle.Value == 3) {
                sum += 1.248;
            }
        }
    }
    //Door costs 
    for (door of global_doors) {
        sum += 0.1;
    }
    return sum * 1000;
}

function getShipCommandCost(stats) {
    sum = 0
    for (sprite of stats.parts) {
        if (spriteData[sprite["ID"]].cp_cost > 0) {
            sum += spriteData[sprite["ID"]].cp_cost
        }
    }
    return sum;
}

function getShipCommandPoints(stats) {
    sum = 0
    for (sprite of stats.parts) {
        if (sprite["ID"] == "cosmoteer.control_room_small") {
            sum += 50
        } else if (sprite["ID"] == "cosmoteer.control_room_med") {
            sum += 250
        } else if (sprite["ID"] == "cosmoteer.control_room_large") {
            sum += 1000
        }
    }
    return sum;
}

function shipDps(stats) {
    sum = 0
    for (part of stats.parts) {
        sum += spriteData[part.ID].dps || 0
    }
    return sum
}

function crewCount(stats) {
    let sum = 0
    let quarters = getParts(stats.parts, isInTagsCondition("crew"))
    for (let quarter of quarters) {
        switch (quarter.ID) { 
            case "cosmoteer.crew_quarters_large": {
                sum += 24
            }
            case "cosmoteer.crew_quarters_med": {
                sum += 6
            }
            case "cosmoteer.crew_quarters_small": {
                sum += 2
            }
        }  
    }
    return sum
}

function shipWeight(stats) {
    let sum = 0
    for (sprite of stats.parts) {
        sum += spriteData[sprite["ID"]].mass
    }
    return sum * 1000
}

function shipLightnessCoeff(stats) {
    let merging_part_tile_sum = 0
    let energy_tile_weight = 0
    for (sprite of getParts(stats.parts, isInTagsCondition("reactor"))) {
        energy_tile_weight += spriteData[sprite["ID"]].mass
    }
    for (sprite of getParts(stats.parts, (part) => {return isMergingPartCondition()(part) || isInTagsCondition("armor")(part) || hasIDCondition("cosmoteer.fire_extinguisher")(part)})) {
        merging_part_tile_sum += spriteData[sprite["ID"]].mass
    } 
    return energy_tile_weight/merging_part_tile_sum
}

function isUl(stats) {//lighness coeff of at least 1, no armor
    if (stats.lighnessCoeff >= 1 && getParts(stats.parts, isInTagsCondition("armor")).length == 0) {
        return true
    } else {
        return false
    }
}

function shipArchetype(stats) {
    let string = "" 
    if (stats.isUl) {
        string += "UL "
    }
    string += getThrustArrangement(stats) + " thrust " + getPartNameAbbreviation(stats.primary_weapon)
    return string
}

function part_com_location(sprite) {
	const com_location = [0, 0];
	const part_rotation = sprite.Rotation;
	const sprite_location = sprite.Location;
	part_size = spriteData[sprite.ID].size;

	if (part_rotation === 0 || part_rotation === 2) {
		com_location[0] = sprite_location[0] + part_size[0] / 2;
		com_location[1] = sprite_location[1] + part_size[1] / 2;
	} else {
		com_location[0] = sprite_location[0] + part_size[1] / 2;
		com_location[1] = sprite_location[1] + part_size[0] / 2;
	}
	return com_location;
}

function ship_com_location(stats) {
    let com = [0, 0]
    let part_com
    total_weight = stats.weight
    for (part of stats.parts) {
        part_com = part_com_location(part)
        com[0] += part_com[0]
        com[1] += part_com[1]
    }
    com[0] /= total_weight
    com[1] /= total_weight
    return com
}

//Only supports whole number angles 
function partThrustVector(part, stats) {
    let part_rotation = part.Rotation
    let thrust_vector = [0, 0, 0, 0]
    let k=1
    let tags = getElementFromPartMap(part, stats.tag_map)
    if (tags.includes("er_buff")) {
        k=1.5
    }
    for (i of [0, 1, 2, 3]) {
        thrust_vector[i] = spriteData[part["ID"]].thrust[(i + part_rotation + 2) % 4] * 1000000*k;
    }
    return thrust_vector
}

function shipThrustVector(stats) {
    let thrust_vector = [0, 0, 0, 0]
    let parts = getParts(stats.parts, isInTagsCondition("thruster"))
    for (let part of parts) {
        let part_vector = partThrustVector(part, stats)
        for (i of [0, 1, 2, 3]) {
            thrust_vector[i] += part_vector[i]
        }
    }
    return thrust_vector
}

function shipMaxSpeed(stats, angle) {
    let acceleration = stats.acceleration[angle]
    for (i of Array(10000).keys()) {
        if (Math.max(i / 75, 1) ** 2 * 0.4 * i > acceleration) {
            return i;
        }
    }
    return 0
}

function shipAcceleration(stats) {
    let thrust = stats.thrust
    let mass = stats.weight
    let result = [0,0,0,0]
    for (i of [0, 1, 2, 3]) {
        result[i] += thrust[i] / mass
    }
    return result
}

function momentOfInertiaPart(part, stats) {
    let [x0, y0] = stats.com
    let location = part.Location
    let mass = spriteData[part["ID"]].mass
    return vecLength([location[0]-x0,location[1]-y0])*mass
}

function momentOfInertiaShip(stats) {
    sum = 0
    for (part of sprites) {
        sum += momentOfInertiaPart(part, stats)
    }
    return sum
}

function getShipHyperdriveEfficiency(stats) {
    let sum = 0
    for (let part of stats.parts) {
        sum +=  getTileHyperdriveEfficiency(stats, part)
    }
    return sum/stats.parts.length
}

function getTileHyperdriveEfficiency(stats, part) {
    let hyperdrives = getParts(stats.parts, isInTagsCondition("hyperdrive"))
    let sum = 0
    let JumpEfficiency = 0.5
    let JumpEfficiencyDistanceRange = 0
    let tileDist = []
    let part_center_location = partCenter(part)

    for (drive of hyperdrives) {
        switch (drive["ID"]) {
            case ("cosmoteer.hyperdrive_small"): {
                JumpEfficiencyDistanceRange = [5,30]
                break
            }
            case ("cosmoteer.hyperdrive_med"): {
                JumpEfficiencyDistanceRange = [10,60]
                break
            }
            case ("cosmoteer.hyperdrive_large"): {
                JumpEfficiencyDistanceRange = [20,120]
                break
            }
        }
        tileDist = pointDist(partCenter(drive), part_center_location)
        sum += (1 - InverseLerp(JumpEfficiencyDistanceRange, tileDist)) * JumpEfficiency
    }
    return Math.min(sum, 1)
}

function partCenter(part) {
    let size = spriteData[part["ID"]].size
    return [part.Location[0] + size[part.Rotation%2]/2, part.Location[1] + size[(part.Rotation+1)%2]/2]
}

function partLocationFromCenter(center, part, messy_toggle=false) {
    let size = spriteData[part["ID"]].size
    let rotatedWidth = size[(part.Rotation+1) % 2]
    let rotatedHeight = size[(part.Rotation ) % 2]
    if (!messy_toggle) {
        rotatedWidth = size[(part.Rotation) % 2]
        rotatedHeight = size[(part.Rotation+1) % 2]
    } 
    return [
        center[0] - rotatedWidth / 2, 
        center[1] - rotatedHeight / 2
    ];
}

function getAllWeaponPartGroups(statsin) {
    let parts = getParts(statsin.parts, isInTagsCondition("weapon"))
    let partsMap = new Map()

    for (let part of parts) {
        if (!partsMap.has(part.ID)) {
            partsMap.set(part.ID, [part.ID])
        }
        partsMap.get(part.ID).push(part)
    }

    return Array.from(partsMap.values())
}

function getPrimaryWeaponID(stats) {
    let weapon_groups = getAllWeaponPartGroups(stats)
    let sum = new Array(weapon_groups.length).fill(0)
    
    for (let i = 0; i < weapon_groups.length; i++) {
        let group = weapon_groups[i]
        for (let j = 1; j < group.length; j++) { 
            let part = group[j]
            if (spriteData[part.ID]) { 
                sum[i] += spriteData[part.ID].cost 
            }
        }
    }
    let index = indexOfListMax(sum)
    return weapon_groups[index] ? weapon_groups[index][0] : ""
}

function getThrustArrangement(stats) {
    let thrust = stats.thrust
    let thrust_sum = thrust[0]+thrust[1]+thrust[2]+thrust[3]
    if (thrust_sum === 0) {
        return "none"
    }
    let thrust_averages = [thrust[0]/thrust_sum, thrust[1]/thrust_sum, thrust[2]/thrust_sum, thrust[3]/thrust_sum]
    let evenIndices = thrust_averages.filter((_, index) => index % 2 === 0);
    let oddIndices = thrust_averages.filter((_, index) => index % 2 !== 0);
    if (thrust_averages.some(value => value > 0.9)) {
        return "mono"
    } else if (evenIndices.every(evenValue => evenValue > 0.4) || oddIndices.every(oddValue => oddValue > 0.4)) {
        return "bi"
    } else if (thrust_averages.every(evenValue => evenValue > 0.15)) {
        return "omni"
    } else {
        return "strange"
    }
}

function getPartNameAbbreviation(id) {
    let name = id
    name = name.replace("cosmoteer.", "")
    name = name.replace(/_/g, " ")
    name = name.replace(/\b\w/g, char => char.toUpperCase())
    if (name === "Ion Beam Emitter") {
        return "Ion"
    } 
    return name
}

function getPartTagMap(stats) {
    let map = []
    for (let part of stats.parts) {
        map.push([part, []])
    }
    for (let i=0;i<stats.parts.length;i++) {
        let thruster = stats.parts[i]
        if (spriteData[thruster.ID].tags.includes("thruster")) {
            let neighbours= getElementFromPartMap(thruster, stats.neighbour_map)
            for (let neighbour of neighbours) {
                if (neighbour.ID === "cosmoteer.engine_room") {
                    map[i][1].push("er_buff")
                    j=i
                }
            }
        }
    }
    return map
}

function getElementFromPartMap(part, map) {
    for (pair of map) {
        if (isSameSprite(pair[0], part)) {
            return pair[1]
        }
    }
    console.warn("no element found for key")
    return null
}

function partNeighbourMap(graph) {
    let map = []
    for (let i=0;i<graph[1].length;i++) {
        map.push([graph[1][i][1], []])
    }
    for (let edge of graph[0]) {
        for (let pair of map) {
            if (isSameSprite(pair[0], edge[2])) {
                pair[1].push(edge[3])
            }
        }
    }
    return map
}

function getPartFromLocation(location, parts) {
    for (let part of parts) {
        if (part.Location[0] == location[0] && part.Location[1] == location[1]) {
            return part
        }
    }
    console.warn("No part found for location")
    return null
}

function getShipBounds(parts) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (let part of parts) {
        for (let [x, y] of getSpriteTileLocations(part)) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
    }

    return { minX, minY, maxX, maxY };
}
