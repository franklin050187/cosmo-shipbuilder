//This file is are all functions related to drawing on the canvas

let spritesDrawn = new Set(); // used in draw function

function draw_resources() {
	const json = json_import_text.value;
	const data = JSON.parse(json);
	const part_data = data.Parts;

	if (resources === "Unset") {
		return;
	}

	for (const location of get_all_locations()) {
		for (const resource of resources) {
			if (location[0] === resource.Key[0] && location[1] === resource.Key[1]) {
				const imageName = resource.Value;
				const img = new Image();

				img.src = `sprites/${imageName}.png`;

				img.onload = () => {
					x = location[0];
					y = location[1];
					const rotatedImage = rotate_img(img, 0, false);
					ctx.drawImage(
						rotatedImage,
						(x - minX) * gridSize + 1,
						(y - minY) * gridSize + 1,
						rotatedImage.width - 2,
						rotatedImage.height - 2,
					);
				};
			}
		}
	}
}

function draw_doors() {
	for (const door of doors) {
		const img = new Image();

		img.src = "sprites/door.png";

		img.onload = () => {
			rotation = (door.Orientation + 1) % 2;
			const door_location = [];
			door_location[0] = door.Cell[0];
			door_location[1] = door.Cell[1];
			const location = sprite_position(door, door_location);
			x = location[0];
			y = location[1];
			const angle = rotation;

			const rotatedImage = rotate_img(img, angle, false);
			ctx.drawImage(
				rotatedImage,
				(x - minX) * gridSize + 1,
				(y - minY) * gridSize + 1,
				rotatedImage.width - 2,
				rotatedImage.height - 2,
			);
		};
	}
}

function redrawCanvas() {
	const newSprites = sprites.filter((sprite) => !spritesDrawn.has(sprite));
	const oldSprites = Array.from(spritesDrawn);
	spritesDrawn = new Set(sprites);
	// Clear old sprites
	for (const sprite of oldSprites) {
		if (!spritesDrawn.has(sprite)) {
			const [x, y] = sprite_position(sprite, [
				sprite.Location[0],
				sprite.Location[1],
			]);
			ctx.clearRect(
				(x - minX) * gridSize + 1,
				(y - minY) * gridSize + 1,
				sprite.width,
				sprite.height,
			);
		}
	}

	// Draw new sprites
	for (const sprite of newSprites) {
		const imageName = sprite.ID.replace("cosmoteer.", "");
		const partData = getPartDataMap(sprite);
		const missileType = Number.parseInt(partData.get("missile_type"));

		let img;
		if (missileType === 2) {
			img = spriteCache.nuke_launcher;
		} else if (missileType === 1) {
			img = spriteCache.emp_launcher;
		} else if (missileType === 3) {
			img = spriteCache.mine_launcher;
		} else {
			img = spriteCache[imageName];
		}

		if (img) {
			const [x, y] = sprite_position(sprite, [
				sprite.Location[0],
				sprite.Location[1],
			]);
			const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
			ctx.drawImage(
				rotatedImage,
				(x - minX) * gridSize + 1,
				(y - minY) * gridSize + 1,
				rotatedImage.width - 2,
				rotatedImage.height - 2,
			);
			sprite.width = rotatedImage.width;
			sprite.height = rotatedImage.height;
			square_map(sprite);
		}
	}

	draw_doors();
	draw_resources();
}
