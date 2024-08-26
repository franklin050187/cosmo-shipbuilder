//This file is for values that need to be calculated

function getShipCost(id = null, category = null) {
	sum = 0;
	//regular part price
	for (sprite of getParts(id, category)) {
		sum += spriteData[sprite.ID].cost;
	}
	//extra costs from loaded missiles
	for (toggle of part_toggles) {
		if (toggle.Key[1] === "missile_type") {
			if (toggle.Value === 0) {
				sum += 0.096;
			}
			if (toggle.Value === 1) {
				sum += 0.18;
			}
			if (toggle.Value === 2) {
				sum += 0.432;
			}
			if (toggle.Value === 3) {
				sum += 1.248;
			}
		}
	}
	//Door costs
	for (door of doors) {
		sum += 0.1;
	}
	return sum * 1000;
}

function getShipCommandCost() {
	sum = 0;
	for (sprite of sprites) {
		if (spriteData[sprite.ID].cp_cost > 0) {
			sum += spriteData[sprite.ID].cp_cost;
		}
	}
	return sum;
}

function getShipCommandPoints() {
	sum = 0;
	for (sprite of sprites) {
		if (sprite.ID === "cosmoteer.control_room_small") {
			sum += 50;
		} else if (sprite.ID === "cosmoteer.control_room_med") {
			sum += 250;
		} else if (sprite.ID === "cosmoteer.control_room_large") {
			sum += 1000;
		}
	}
	return sum;
}

function getCrew() {
	sum = 0;
	for (sprite of sprites) {
		if (sprite.ID === "cosmoteer.crew_quarters_small") {
			sum += 2;
		} else if (sprite.ID === "cosmoteer.crew_quarters_med") {
			sum += 6;
		} else if (sprite.ID === "cosmoteer.crew_quarters_large") {
			sum += 24;
		}
	}
	return sum;
}

function crewCount() {
	let sum = 0;
	for (quarter of getParts(null, "crew")) {
		console.log(quarter.ID);
		switch (quarter.ID) {
			case "cosmoteer.crew_quarters_large": {
				sum += 24;
				break;
			}
			case "cosmoteer.crew_quarters_med": {
				sum += 6;
				break;
			}
			case "cosmoteer.crew_quarters_small": {
				sum += 2;
				break;
			}
		}
	}
	return sum;
}

function shipWeight() {
	let sum = 0;
	for (sprite of sprites) {
		sum += spriteData[sprite.ID].mass;
	}
	return sum * 1000;
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

function ship_com_location() {
	const com = [0, 0];
	let part_com;
	total_weight = shipWeight();
	for (part of sprites) {
		part_com = part_com_location(part);
		com[0] += part_com[0];
		com[1] += part_com[1];
	}
	com[0] /= total_weight;
	com[1] /= total_weight;
	return com;
}

//Only supports whole number angles
function partThrustVector(part, angle) {
	const part_rotation = part.Rotation;
	const thrust_vector = [0, 0, 0, 0];
	for (i of [0, 1, 2, 3]) {
		thrust_vector[i] =
			spriteData[part.ID].thrust[(i + part_rotation + 2) % 4] * 1000000;
	}
	return thrust_vector[angle];
}

function shipThrustVector(angle) {
	const thrust_vector = [0, 0, 0, 0];
	for (part of getParts(null, "thruster")) {
		thrust_vector[0] += partThrustVector(part, angle);
	}

	return thrust_vector;
}

function shipMaxSpeed(angle) {
	const acceleration = shipAcceleration(angle);
	// const speed_steps = 0.1;
	for (i of Array(10000).keys()) {
		if (Math.max(i / 75, 1) ** 2 * 0.4 * i > acceleration) {
			return i;
		}
	}
}

function shipAcceleration(angle) {
	const thrust = vecLength(shipThrustVector(angle));
	const mass = shipWeight();
	return thrust / mass;
}

function momentOfInertiaPart(part) {
	const [x0, y0] = ship_com_location();
	const location = part.Location;
	const mass = spriteData[part.ID].mass;
	return vecLength([location[0] - x0, location[1] - y0]) * mass;
}

function momentOfInertiaShip() {
	sum = 0;
	for (part of sprites) {
		sum += momentOfInertiaPart(part);
	}
	return sum;
}

function getTileHyperdriveEfficiency(part) {
	const hyperdrives = getParts(null, "hyperdrive");
	let sum = 0;
	const JumpEfficiency = 0.5;
	let JumpEfficiencyDistanceRange = 0;
	let tileDist = [];
	const part_center_location = partCenter(part);

	for (drive of hyperdrives) {
		switch (drive.ID) {
			case "cosmoteer.hyperdrive_small": {
				JumpEfficiencyDistanceRange = [5, 30];
				break;
			}
			case "cosmoteer.hyperdrive_med": {
				JumpEfficiencyDistanceRange = [10, 60];
				break;
			}
			case "cosmoteer.hyperdrive_large": {
				JumpEfficiencyDistanceRange = [20, 120];
				break;
			}
		}
		tileDist = pointDist(partCenter(drive), part_center_location);
		console.log(JumpEfficiencyDistanceRange);
		console.log(tileDist);
		sum +=
			(1 - InverseLerp(JumpEfficiencyDistanceRange, tileDist)) * JumpEfficiency;
	}
	return Math.min(sum, 1);
}

function getShipHyperdriveEfficiency() {
	let sum = 0;
	for (part of sprites) {
		sum += getTileHyperdriveEfficiencyPart(part);
	}
	return sum / sprites.length;
}

function getTileHyperdriveEfficiencyPart(part) {
	const hyperdrives = getParts(null, "hyperdrive");
	let sum = 0;
	const JumpEfficiency = 0.5;
	let JumpEfficiencyDistanceRange = 0;
	let tileDist = [];
	const part_center_location = partCenter(part);

	for (drive of hyperdrives) {
		switch (drive.ID) {
			case "cosmoteer.hyperdrive_small": {
				JumpEfficiencyDistanceRange = [5, 30];
				break;
			}
			case "cosmoteer.hyperdrive_med": {
				JumpEfficiencyDistanceRange = [10, 60];
				break;
			}
			case "cosmoteer.hyperdrive_large": {
				JumpEfficiencyDistanceRange = [20, 120];
				break;
			}
		}
		tileDist = pointDist(partCenter(drive), part_center_location);
		console.log(JumpEfficiencyDistanceRange);
		console.log(tileDist);
		sum +=
			(1 - InverseLerp(JumpEfficiencyDistanceRange, tileDist)) * JumpEfficiency;
	}
	return Math.min(sum, 1);
}

function partCenter(part) {
	const size = spriteData[part.ID].size;
	// const location = part.Location;
	return [part.Location[0] + size[0] / 2, part.Location[1] + size[1] / 2];
}
