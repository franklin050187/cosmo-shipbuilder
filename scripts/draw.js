//This file contains all functions related to drawing on the canvas

const canvas = document.getElementById("spriteCanvas");
const drawing_canvas = document.getElementById("drawingCanvas");
const resource_canvas = document.getElementById("resourceCanvas");
const preview_canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");

let spritesDrawn = new Set(); // used in draw function

function draw_resources(json = JSON.stringify(startup_ship_data)) {
	if (typeof json !== 'string') {
        json = json_import_text.value;
    }
	const data = JSON.parse(json);
	const part_data = data.Parts;

	if (resources === "Unset") {
		return;
	}

	for (const location of get_all_locations(sprites)) {
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
	const canvas = document.getElementById("drawingCanvas");
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	const spritecanvas = document.getElementById("spriteCanvas");
	spritecanvas.getContext("2d").clearRect(0, 0, spritecanvas.width, spritecanvas.height);

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
	for (const sprite of sprites) {
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
			const [x, y] = convertCoordinatesToCanvas(sprite.Location[0],sprite.Location[1]);
			const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
			ctx.drawImage(
				rotatedImage,
				x,
				y,
				rotatedImage.width - 2,
				rotatedImage.height - 2,
			);
			sprite.width = rotatedImage.width;
			sprite.height = rotatedImage.height;
			square_map(sprite);
		}
	}

	for (let sprite of sprites) {
		const [x, y] = sprite_position(sprite, [
			sprite.Location[0],
			sprite.Location[1],
		]);
		let canvasLocation = convertCoordinatesToCanvas(x,y)
		drawPartIndicators(sprite, canvasLocation[0],canvasLocation[1])
	}

	draw_doors();
	draw_resources();
}

function clearPreview() {
	ctx.clearRect(lastDrawX, lastDrawY, lastWidth, lastHeight);

	// Redraw the sprites that were overwritten by the preview sprite
	for (const key of affectedSquares) {
		if (gridMap[key]) {
			const sprite = gridMap[key].is_drawn_by_sprite;
			const imageName = sprite.ID.replace("cosmoteer.", "");
			const img = new Image();

			const partData = getPartDataMap(sprite);
			const missileType = partData.get("missile_type");
			if (missileType === 2) {
				img.src = "sprites/nuke_launcher.png";
			} else if (missileType === 1) {
				img.src = "sprites/emp_launcher.png";
			} else if (missileType === 3) {
				img.src = "sprites/mine_launcher.png";
			} else {
				img.src = `sprites/${imageName}.png`;
			}

			img.onload = () => {
				const [x, y] = sprite_position(sprite, [
					sprite.Location[0],
					sprite.Location[1],
				]);
				const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
				ctx.clearRect(
					(x - minX) * gridSize + 1,
					(y - minY) * gridSize + 1,
					rotatedImage.width - 2,
					rotatedImage.height - 2,
				);
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

function drawPartIndicators(part, x, y) {
	const canvas = document.getElementById("drawingCanvas");
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "red";
	ctx.fillRect(x, y, 10, 10);
	if (part.ID == "cosmoteer.ion_beam_prism") {
		ctx.fillStyle = "green";
		ctx.fillRect(x, y, 100, 100);
	}

}

function convertCoordinatesToCanvas(x,y) {
	return [(x - minX) * gridSize + 1, (y - minY) * gridSize + 1]	
}

function convertCanvasToCoordinates(canvasX, canvasY) {
	const rect = canvas.getBoundingClientRect();

	// Calculate scaling factors between the canvas's original size and its displayed size
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	// Calculate mouse position relative to the canvas, taking into account the scaling
	const x = (canvasX - rect.left) * scaleX;
	const y = (canvasY - rect.top) * scaleY;
	const mouseX = Math.floor(x / gridSize) * gridSize;
	const mouseY = Math.floor(y / gridSize) * gridSize;
	const canvasPositionX = mouseX / gridSize + minX;
	const canvasPositionY = mouseY / gridSize + minY;
	const result = [canvasPositionX, canvasPositionY];

    return result;
}

function drawPreview(inputparts) {
	const parts = repositionPartsRalative(inputparts)
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.5;

	for (let part of parts) {
		let [x,y] = convertCoordinatesToCanvas(part.Location[0],part.Location[1])
		const rotatedImage = rotate_img(
			previewSpriteImage,
			part.Rotation,
			part.FlipX,
		);
		ctx.drawImage(
			rotatedImage,
			x,
			y,
			rotatedImage.width - 2,
			rotatedImage.height - 2,
		);
		
	}
	ctx.globalAlpha = 1.0;
}

function rotate_img(image, angle, flipx) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	// Set canvas dimensions based on the rotation
	if (angle % 2 === 0) {
		canvas.width = image.width;
		canvas.height = image.height;
	} else {
		canvas.width = image.height;
		canvas.height = image.width;
	}

	// Translate to center and rotate
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((angle * Math.PI) / 2);

	if (flipx) {
		ctx.scale(-1, 1);
	}

	ctx.drawImage(image, -image.width / 2, -image.height / 2);

	return canvas;
}
