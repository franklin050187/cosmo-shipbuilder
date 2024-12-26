//This file contains all functions related to drawing on the canvas

const canvas = document.getElementById("spriteCanvas");
const drawing_canvas = document.getElementById("drawingCanvas");
const resource_canvas = document.getElementById("resourceCanvas");
const preview_canvas = document.getElementById("previewCanvas");
const additionals_canvas = document.getElementById("additionalsCanvas");
const ctx = canvas.getContext("2d");

let spritesDrawn = new Set(); // used in draw function

function draw_resources(resources, canvas) {
	if (global_resources === "Unset") {
		return;
	}
	const ctx = canvas.getContext("2d");
	for (const resource of resources) {
		const imageName = resource.Value
		const img = new Image()

		img.src = `sprites/${imageName}.png`

		let [x,y] = convertCoordinatesToCanvas(resource.Key)
		const rotatedImage = rotate_img(img, 0, false)
		
		ctx.drawImage(
			rotatedImage,
			x,
			y,
			rotatedImage.width*gridSize/64 - 2,
			rotatedImage.height*gridSize/64 - 2,
		)
		
	}
}

function draw_doors() {
	for (const door of doors) {
		const img = new Image();

		img.src = "sprites/door.png";

		img.onload = () => {
			rotation = (door.Orientation + 1) % 2;
			const location = sprite_position(door);
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

	spritesDrawn = new Set(sprites);
	// Clear old sprites
	for (const sprite of global_sprites_to_delete) {
		if (!spritesDrawn.has(sprite)) {
			const [x, y] = sprite_position(sprite);
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
			const [x, y] = convertCoordinatesToCanvas(sprite_position(sprite));
			const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
			ctx.drawImage(
				rotatedImage,
				x,
				y,
				rotatedImage.width*gridSize/64 - 2,
				rotatedImage.height*gridSize/64 - 2,
			);
			sprite.width = rotatedImage.width*gridSize/64;
			sprite.height = rotatedImage.height*gridSize/64;
			square_map(sprite);
		}
	}
	global_sprites_to_draw = []

	for (let sprite of sprites) {
		drawPartIndicators(sprite)
	}
	if (cursorMode === "Select" || cursorMode === "Supply")  {
		clearPreview()
		drawSelectionindicators(global_selected_sprites)
	}

	if (cursorMode === "Supply") {
		clearLayer(ctx)
		drawSupplyChains()
	} else if (cursorMode === "Crew") {
		drawRoleIndicators(global_crew_role_sources)
	}
	drawMirrorAxis()
	draw_doors();
	clearLayer(resource_canvas.getContext("2d"))
	draw_resources(global_resources, resource_canvas);
}

function redrawEntireCanvas() {
	for (let c of global_canvases) {
		clearLayer(c.getContext("2d"))
	}
	global_sprites_to_draw.push(...sprites)
	updateCanvas()
}

function drawPartIndicators(part) {
	let loc = partCenter(part)
	let [x,y] = convertCoordinatesToCanvas(part.Location)
	let [centerX,centerY] = convertCoordinatesToCanvas(loc)

	const canvas = document.getElementById("drawingCanvas");
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "red";
	//ctx.fillRect(x, y, 10*getScalor()[0], 10*getScalor()[1]);

	if (part.ID == "cosmoteer.shield_gen_small") {
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.arc(centerX, centerY, 400, 4*Math.PI/3, 5*Math.PI/3);
		ctx.stroke(); 
	}
}

function drawRoleIndicators(sources) {
	for (let source of sources) {
		let part = source.Key
		let loc = partCenter(part)
		let [x,y] = convertCoordinatesToCanvas(part.Location)
		let [centerX,centerY] = convertCoordinatesToCanvas(loc)

		const canvas = document.getElementById("drawingCanvas");
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "red"
		for (let role in crew_roles) {
			if (crew_roles[role].ID === source.Value) {
				if (crew_roles[role].Name === "Supply") {
					ctx.fillStyle = "purple"
				} else if (crew_roles[role].Name === "Operator") {
					ctx.fillStyle = "green"
				}
			} 
		}
		ctx.fillRect(x, y, 10*getScalor()[0], 10*getScalor()[1]);
	}
}

function drawSelectionindicators(parts) {
	const canvas = document.getElementById("previewCanvas")
	const ctx = canvas.getContext("2d")
	ctx.strokeStyle  = "rgb(13, 130, 11)"
	for (let part of parts) {
		ctx.beginPath()
		ctx.lineWidth = 3
		let box = partBoundingBox(part)
		let [x1,y1] = convertCoordinatesToCanvas(box[0])
		let [x2,y2] = convertCoordinatesToCanvas(box[1])
		ctx.rect(x1, y1, x2-x1-1, y2-y1-1);
		ctx.stroke()
	}
}

function drawSelectionBox(endpos) {
	const ctx = preview_canvas.getContext("2d")
	clearLayer(ctx)
	ctx.strokeStyle  = "rgb(13, 130, 11)"
	ctx.lineWidth = 3
	ctx.beginPath()
	let [x1,y1] = convertCoordinatesToCanvas(global_selection_box_start)
	let [x2,y2] = convertCoordinatesToCanvas(endpos)
	ctx.rect(x1, y1, x2-x1, y2-y1);
	ctx.stroke()
}

function convertCoordinatesToCanvas(location) {
	return [(location[0] - minX) * gridSize  + 1, (location[1] - minY) * gridSize  + 1]	
}

function convertCanvasToCoordinates(canvasX, canvasY) {
	const rect = canvas.getBoundingClientRect();

	// Calculate scaling factors between the canvas's original size and its displayed size
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	// Calculate mouse position relative to the canvas, taking into account the scaling
	const x = (canvasX - rect.left) * scaleX
	const y = (canvasY - rect.top) * scaleY
	const mouseX = Math.floor(x / gridSize) 
	const mouseY = Math.floor(y / gridSize) 
	const canvasPositionX = mouseX  + minX
	const canvasPositionY = mouseY  + minY
	const result = [canvasPositionX, canvasPositionY]

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
	const canvas = document.getElementById("drawingCanvas");
	const ctx = canvas.getContext("2d");

	ctx.strokeStyle = "green"
	ctx.lineWidth = 3;
	ctx.beginPath(); 
	for (axis of global_mirror_axis) {
		let bignum = 2000
		if (axis.Type === "linear") {
			let [x, y] = convertCoordinatesToCanvas([global_mirror_center[axis.Rotation], maxY])
			if (axis.Rotation === 0) {
				ctx.moveTo(x, 0); 
				ctx.lineTo(x, y); 
			}
			if (axis.Rotation === 1) {
				ctx.moveTo(0, x); 
				ctx.lineTo(bignum, x); 
			}
		} else if (axis.Type === "diagonal") {
			let [x,y] = convertCoordinatesToCanvas(global_mirror_center)
			if (axis.Rotation === 0) {
				ctx.moveTo(x-bignum, y-bignum); 
				ctx.lineTo(x+bignum, y+bignum); 
			}
			if (axis.Rotation === 1) {
				ctx.moveTo(x+bignum, y-bignum); 
				ctx.lineTo(x-bignum, y+bignum);  
			}
		}
	}
	ctx.stroke(); 
	if (global_mirror_axis.length > 0) {
		//draw center of mirror axis
		let dotcords = convertCoordinatesToCanvas(global_mirror_center)
		ctx.beginPath(); 
		ctx.arc(dotcords[0], dotcords[1], 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke(); 
	}
}

function drawSupplyChains() {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	for (let chain of [...global_supply_chains, ...global_crew_assignments]) {
		let part1 = chain.Key
		for (let part2 of chain.Value) {
			ctx.strokeStyle = "blue"
			ctx.lineWidth = 4;
			drawArrow(ctx, convertCoordinatesToCanvas(partCenter(part1)), convertCoordinatesToCanvas(partCenter(part2)))
		}
	}
}

function drawPreview(inputparts, inputresources) {
	const parts = mirroredParts(repositionPartsRalative(inputparts))
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	clearLayer(ctx);
	ctx.globalAlpha = 0.5;

	for (let part of parts) {
		let [x,y] = convertCoordinatesToCanvas(sprite_position(part))
		const rotatedImage = rotate_img(
			partSprite(part),
			part.Rotation,
			part.FlipX,
		);
		ctx.drawImage(
			rotatedImage,
			x,
			y,
			rotatedImage.width*gridSize/64 - 2,
			rotatedImage.height*gridSize/64 - 2,
		);
	}
	if (inputresources) {
		const resources = mirroredResources(inputresources)
		draw_resources(resources, canvas)
	}
	ctx.globalAlpha = 1.0;
}

function clearPreview() {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	clearLayer(ctx);
}

function drawDeletePreview(event) {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	doIfCursorOverPart(event, ((part) => {
		for (let part2 of existingMirroredParts([part], sprites)) {
			drawDeleteSymbol(part2.Location, spriteData[part2.ID].size, part2.Rotation)
		}
	}))
}

function drawDeleteSymbol(location, size, rotation) {
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");

	let [x,y] = convertCoordinatesToCanvas(location)
	let [a,b] = convertCoordinatesToCanvas([location[0]+size[rotation%2], location[1]+size[(rotation+1)%2]])

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

function clearLayer(layer) {
    let transform = layer.getTransform();
    let scaleX = transform.a; 
    let scaleY = transform.d; 
    let translateX = transform.e; 
    let translateY = transform.f; 
    layer.clearRect(-translateX / scaleX, -translateY / scaleY, canvas.width / scaleX, canvas.height / scaleY);
}

function drawArrow(ctx, loc1, loc2) {
	let [x1, y1] = loc1
	let [x2, y2] = loc2

	const lineWidth = ctx.lineWidth;
	const headLength = 10; // Arrowhead size
	const headAngle = Math.PI / 6; // Angle for the arrowhead
	const angle = Math.atan2(y2 - y1, x2 - x1);

	// Draw the main line
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = lineWidth;
	ctx.stroke();

	// Calculate arrowhead position, adjusted for line width
	const arrowheadX = x2 - (headLength + lineWidth) * Math.cos(angle);
	const arrowheadY = y2 - (headLength + lineWidth) * Math.sin(angle);

	// Draw the left and right parts of the arrowhead
	ctx.beginPath();
	ctx.moveTo(x2, y2);
	ctx.lineTo(arrowheadX - headLength * Math.cos(angle - headAngle), arrowheadY - headLength * Math.sin(angle - headAngle));
	ctx.moveTo(x2, y2);
	ctx.lineTo(arrowheadX - headLength * Math.cos(angle + headAngle), arrowheadY - headLength * Math.sin(angle + headAngle));
	ctx.stroke();
}

function changeWhiteToRed(imgSrc, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Necessary if the image is from a different origin
    img.src = imgSrc;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Replace white pixels with red
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) { // White pixel
                data[i] = 255;   // Red channel
                data[i + 1] = 0; // Green channel
                data[i + 2] = 0; // Blue channel
            }
        }

        // Put the modified data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the modified image as a data URL
        callback(canvas.toDataURL());
    };
}
