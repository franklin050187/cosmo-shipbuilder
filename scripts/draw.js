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

function updateCanvas() {
	const canvas = document.getElementById("drawingCanvas");
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	const spritecanvas = document.getElementById("spriteCanvas");
	//spritecanvas.getContext("2d").clearRect(0, 0, spritecanvas.width, spritecanvas.height);

	spritesDrawn = new Set(sprites);
	// Clear old sprites
	for (const sprite of global_sprites_to_delete) {
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
	global_sprites_to_delete = []
	// Draw new sprites
	for (const sprite of global_sprites_to_draw) {
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
	global_sprites_to_draw = []

	drawMirrorAxis()

	for (let sprite of sprites) {
		drawPartIndicators(sprite)
	}

	draw_doors();
	draw_resources();
}

function drawPartIndicators(part) {
	let loc = partCenter(part)
	let [x,y] = convertCoordinatesToCanvas(part.Location[0], part.Location[1])
	let [centerX,centerY] = convertCoordinatesToCanvas(loc[0],loc[1])

	const canvas = document.getElementById("drawingCanvas");
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "red";
	ctx.fillRect(x, y, 10, 10);
	if (part.ID == "cosmoteer.shield_gen_small") {
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.arc(centerX, centerY, 400, 4*Math.PI/3, 5*Math.PI/3);
		ctx.stroke(); 
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

function partSprite(part) {
	const selectedSprite = part.ID;
	const imageName = selectedSprite.replace("cosmoteer.", "");
	let image = new Image();
	image.src = `sprites/${imageName}.png`;

	image.onload = () => {
		isPreviewSpriteLoaded = true;
	};
	return image
}

function drawMirrorAxis() {
	for (axis of global_mirror_axis) {
		const canvas = document.getElementById("drawingCanvas");
		const ctx = canvas.getContext("2d");

		let [x,y] = convertCoordinatesToCanvas(axis.Location, maxY)
		ctx.strokeStyle = "green"
		ctx.lineWidth = 3;
		ctx.beginPath(); 
		if (axis.Rotation === 0) {
			ctx.moveTo(x, 0); 
			ctx.lineTo(x, 2000); 
		}
		if (axis.Rotation === 1) {
			ctx.moveTo(0, x); 
			ctx.lineTo(2000, x); 
		}
		ctx.stroke(); 
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black"
	}
}

function drawPreview(inputparts) {
	const parts = mirroredParts(repositionPartsRalative(inputparts))
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.5;

	for (let part of parts) {
		let [x,y] = convertCoordinatesToCanvas(part.Location[0],part.Location[1])
		const rotatedImage = rotate_img(
			partSprite(part),
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

function clearPreview() {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDeletePreview(event) {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	doIfCursorOverPart(event, ((part) => {
		drawDeleteSymbol(part.Location, spriteData[part.ID].size, part.Rotation)
	}))
}

function drawDeleteSymbol(location, size, rotation) {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");

	let [x,y] = convertCoordinatesToCanvas(location[0], location[1])
	let [a,b] = convertCoordinatesToCanvas(location[0]+size[rotation%2], location[1]+size[(rotation+1)%2])

	ctx.strokeStyle = "red"
	ctx.lineWidth = 6;
	ctx.beginPath(); 

	ctx.moveTo(x, y); 
	ctx.lineTo(a, b); 
	ctx.moveTo(a, y); 
	ctx.lineTo(x, b); 

	ctx.stroke(); 

	ctx.lineWidth = 1;
	ctx.strokeStyle = "black"
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
