function applyShipProperty() {
	const new_value = ship_property_edit.value;
	const toggle = ship_property_select.options[ship_property_select.selectedIndex].text;
	shipdata[toggle] = new_value;
	log("Updated ship property")
	updateShipToggleSelection();
	updateCanvas();
}

function getAlllocations(parts) {
	const locations = [];

	for (const part of parts) {
		for (const tile of getSpriteTileLocations(part)) {
			locations.push(tile)
		}
	}
	return locations;
}

function getAllCornerLocations(parts) {
	let tiles = getAlllocations(parts)

	for (tile of [...tiles]) {
		tiles.push([tile[0], tile[1]+1])
		tiles.push([tile[0]+1, tile[1]])
		tiles.push([tile[0]+1, tile[1]+1])
	}
	return tiles
}

function place_sprites(sprites_to_place, modify_action_history = true) {//Places the first sprites with absolute coordinates and the ones after with relative ones
	let new_parts = mirroredParts(repositionPartsRelative(sprites_to_place))
	let placed_parts = []
	if (overlappingParts(new_parts, global_recently_placed).length==0 || !global_left_mousdown_toggle) {
		for (let sprite of new_parts){
			const location = sprite.Location;
			if (sprite.ID === "cosmoteer.door") {
				const door = JSON.parse(
					`{"Cell": [${location}], "ID": "cosmoteer.door", "Orientation": ${(sprite.Rotation + 1) % 2}}`,
				);
				global_doors.push(door);
				global_doors_to_draw.push(door)
			} else {
				let overlaps = overlappingParts([sprite], sprites)
				if (overlaps.length>0) {
					remove_multiple_from_sprites(overlaps)
				}
				sprites.push(sprite);
				placed_parts.push(sprite)
				global_sprites_to_draw.push(sprite)
				let prop = generatePropertiesForPart(sprite)
				global_part_properties.push(...prop)
			}
		}
		global_recently_placed = [...new_parts]
	}
	if (modify_action_history && !(placed_parts.length === 0)) {
		addActionToHistory("add_parts", placed_parts)
	}
	updateShipStats()
	updateCanvas()
}

function placeResources(resources) {
	for (let r of mirroredResources(resources)) {
		global_resources.push(resourceCopy(r))
	}
	updateCanvas()
}

function remove_multiple_from_sprites(sprites_to_remove_in, modify_action_history = true) {
	let sprites_to_remove = removeDuplicates(sprites_to_remove_in, isSameSprite)
	global_sprites_to_draw = removeDuplicates(global_sprites_to_draw, isSameSprite)
	for (let sprite of sprites_to_remove) {
		remove_from_sprites(sprite);
	}
	removePartsFromKeyList(sprites_to_remove, global_crew_role_sources)
	updateShipToggleSelection()
	updateCanvas()
	updateShipStats()
	if (modify_action_history) {
		addActionToHistory("remove_parts", sprites_to_remove)
	}
}

function remove_from_sprites(sprite_to_remove) {
	const spriteToRemove = sprite_to_remove;

	for (const sprite of sprites) {
		// find the sprite in sprites and remove it
		// check id and location
		if (isSameSprite(sprite, spriteToRemove)) {
			sprites.splice(sprites.indexOf(sprite), 1);
			global_sprites_to_delete.push(sprite)
			break;
		}
	}
	
	for (const sprite of global_sprites_to_draw) {
		if (isSameSprite(sprite, spriteToRemove)) {
			global_sprites_to_draw.splice(global_sprites_to_draw.indexOf(sprite), 1);
			break;
		}
	} 
	// remove from key from gridmap
	const key_loc_x = spriteToRemove.Location[0];
	const key_loc_y = spriteToRemove.Location[1];
	for (const key in gridMap) {
		if (
			gridMap[key].is_drawn_by_sprite.Location[0] === key_loc_x &&
			gridMap[key].is_drawn_by_sprite.Location[1] === key_loc_y
		) {
			delete gridMap[key];
		}
	}
}

function removeDoors(door1) {
	let doors = mirroredParts([generateDoorAsPart(door1)])
	for (let door of doors) {
		for (let i = global_doors.length - 1; i >= 0; i--) {
			if (sameTile(global_doors[i].Cell, door.Location)) {
				global_doors_to_delete.push(global_doors[i])
				global_doors.splice(i, 1)
			}
		}
	}
	updateShipStats()
	updateCanvas()
}

function removeResources(resources) {
	let dummylist = [...global_resources];
	for (let resource of resources) {
		dummylist = dummylist.filter(
			(dummyResource) => !areLocationsSame(resource.Key, dummyResource.Key)
		);
	}
	global_resources = dummylist;
	updateCanvas();
}

function getResourceFromLocation(pos) {
	for (let i = 0; i < global_resources.length; i++) {
		if (areLocationsSame(pos, global_resources[i].Key)) {
			return global_resources[i]
		}
	}
}

function findSprite(x, y) {
	for (const sprite of sprites) {
		for (const location of getSpriteTileLocations(sprite)) {
			if (location[0] === x && location[1] === y) {
				return sprite;
			}
		}
	}

	return null;
}

function findDoor(x, y) {
	for (const door of global_doors) {
		if (door.Cell[0] === x && door.Cell[1] === y) {
			return door;
		}
	}
	return null;
}

function toggleBelongsToSprite(toggle, sprite) {
	return isSameSprite(toggle.Key[0], sprite);
}

function overlappingParts(parts1, parts2) {
	let overlapping_parts = []
	for (let part1 of parts1) {
		for (let part2 of parts2) {
			for (let location1 of getSpriteTileLocations(part1)) {
				for (let location2 of getSpriteTileLocations(part2)) {
					if (sameTile(location1, location2)) {
						overlapping_parts.push(part2)
					}
				}
			}
		} 
	} 
	return overlapping_parts
}

function repositionPartsRelative(parts) { //Uses the first part as reference and places all following parts interpreting thir location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = base[0]+part.Location[0]
			new_part.Location[1] = base[1]+part.Location[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function repositionPartsAbsolute(parts) { //Uses the first part as reference and places all following parts interpreting their location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = part.Location[0]-base[0]
			new_part.Location[1] = part.Location[1]-base[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function mirroredParts(parts, also_adds_base_parts = true) {//This code is a fucking mess (but Im not gonna clean it up)
	let partsout = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis,global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newpart = partCopy(part)
			newpart.FlipX = location_rotations[1][i][1]
			if (location_rotations[1][i][2]) {
				newpart.Rotation = (part.Rotation+(part.Rotation+location_rotations[1][i][0])%2*2)%4
				newpart.Location = partLocationFromCenter(location_rotations[0][i], part)
			} else {//Diagonals are a fucking mess
				if (location_rotations[1][i][0] == 0) {
					if (part.Rotation%2==0) {
						newpart.Rotation = (part.Rotation+3)%4
					} else {
						newpart.Rotation = (part.Rotation+1)%4
					}
				} else {
					if (part.Rotation%2==0) {
						newpart.Rotation = (part.Rotation+1)%4
					} else {
						newpart.Rotation = (part.Rotation+3)%4
					}
				}	
				newpart.Location = partLocationFromCenter(location_rotations[0][i], part, true)
			}
			//doors are a fucking mess
			if (newpart.ID === "cosmoteer.door") {
				if (location_rotations[1][i][0] == 0) {
					if (newpart.FlipX === true && newpart.Rotation%2 === 0) {
						newpart.Location[0] += 1
					} else if (newpart.FlipX === false && newpart.Rotation%2 === 1) {
						newpart.Location[1] += 1
					}
				} else {
					if (newpart.FlipX === true && newpart.Rotation%2 === 1) {
						newpart.Location[1] += 1
					}
				}
				if (!location_rotations[1][i][2]) {//Diagonals
					if (newpart.Rotation%2 == 1) {
						
					} else {
						if (location_rotations[1][i][0] == 0) {
							newpart.Location[0] -= 1
						} else {
							newpart.Location[0] += 1
						}
						
					}
				}
			}
			
			partsout.push(newpart)
		}
	}
	return partsout
}

function mirroredResources(resources) {
	let resourceout = [...resources]
	for (let resource of resources) {
		location_rotations = mirroredPositions(resourceCenter(resource), global_mirror_axis,global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newresource = generateResource(resource.Value, location_rotations[0][i])
			newresource.Key =  [newresource.Key[0]-0.5, newresource.Key[1]-0.5]
			resourceout.push(newresource)
		}
	}
	return resourceout
}

function existingMirroredParts(parts, all_parts, also_adds_base_parts = true) {
	let partsout = []
	let locations = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis, global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			locations.push(partLocationFromCenter(location_rotations[0][i], part))
		}
	}
	for (let pos of locations) {
		for (let part of all_parts) {
			if (pos[0]===part.Location[0] && pos[1]===part.Location[1]) {
				partsout.push(part)
				break
			}
		}
	}
	return partsout
}

function partBoundingBox(sprite) {
	const data = spriteData[sprite.ID]
	const sprite_size = data.real_size || data.sprite_size || data.size;
	let base_location = [...sprite.Location]
	if (!data.real_size && data.sprite_size) {
		let caze = (sprite.Rotation+1)%2
		if (upTurrets.includes(sprite.ID) && (sprite.Rotation === 0 || sprite.Rotation === 3)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		} else if (downTurrets.includes(sprite.ID) && (sprite.Rotation === 1 || sprite.Rotation === 2)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		}
	}
	if (sprite.Rotation % 2 === 0) {
		width = sprite_size[0];
		height = sprite_size[1];
	} else {
		width = sprite_size[1];
		height = sprite_size[0];
	}
	return [base_location, [base_location[0]+width, base_location[1]+height]];
}

function getSpriteTileLocations(sprite) {
	let box = partBoundingBox(sprite);
	let base_location = box[0];
	let bottom_right = box[1];
	let width = bottom_right[0] - base_location[0];
	let height = bottom_right[1] - base_location[1];
	let locations = [];

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			locations.push([base_location[0] + i, base_location[1] + j]);
		}
	}
	return locations;
}

function resourceCenter(res) {
	return [res.Key[0]+0.5, res.Key[1]+0.5]
}

function addCrewSource(partsin, role) {
	let parts = getParts(partsin, isInTagsCondition("crew"))
	removePartsFromKeyList(parts, global_crew_role_sources)
	for (let part of parts) {
		global_crew_role_sources.push(generateRoleSource(part,role))
	}
	updateCanvas()
}

function removePartsFromKeyList(parts, list) {
	for (let part of parts) {
		for (let i=0;i<list.length;i++) {
			if (isSameSprite(part, list[i].Key)) {
				list.splice(i,1)
			}
		}
	}
}

function rotateParts(parts, rotation) {
	for (let part of parts) {
		const theta = Math.PI / 2 * rotation
		const cosTheta = Math.cos(theta)
		const sinTheta = Math.sin(theta)

		part.Rotation = (part.Rotation+rotation)%4
		let size = spriteData[part.ID].size
		let pos = part.Location
		let rotatedVec = [pos[0] * cosTheta - pos[1] * sinTheta, pos[0] * sinTheta + pos[1] * cosTheta]
		part.Location = rotatedVec
	}
}

function getDoorsOfParts(parts) {
	let tiles = new Set(getAlllocations(parts).map(tile => tile.join(',')));

    return global_doors.filter(door => tiles.has(door.Cell.join(',')));
}

function deleteIllegalDoors() {
	let doors = getDoorsOfParts(sprites)
	const seen = new Set()
	console.log(...global_doors)
	global_doors = doors.reduce((newList, obj) => {
        if (obj.ID === "cosmoteer.door") {
            const key = obj.Cell.join(',')
            if (!seen.has(key)) {
                seen.add(key)
                newList.push(obj)
            }
        } else {
            newList.push(obj)
        }
        return newList
    }, [])
	console.log(...global_doors)
}

function switchPartsToPlace(parts) {
	global_properties_to_apply = []
	global_sprites_to_place = parts
}
