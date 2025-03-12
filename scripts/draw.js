//This file contains all functions related to drawing on the canvas

const canvas = document.getElementById("spriteCanvas");
const drawing_canvas = document.getElementById("drawingCanvas");
const resource_canvas = document.getElementById("resourceCanvas");
const preview_canvas = document.getElementById("previewCanvas");
const door_canvas = document.getElementById("doorCanvas");
const hitbox_canvas = document.getElementById("hitboxCanvas");
const grid_canvas = document.getElementById("gridCanvas"); 
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

		img.src = `sprites/resources/${imageName}.png`

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

function update_doors() {
	let ctx = door_canvas.getContext("2d")
	for (const door of global_doors_to_delete) {
		let pos = door.Cell
		let [x1,y1] = convertCoordinatesToCanvas(pos)
		let [x2,y2] = convertCoordinatesToCanvas([pos[0]+1/2, pos[1]+1/2])
		let [x3,y3] = convertCoordinatesToCanvas([pos[0], pos[1]+1])
		let [x4,y4] = convertCoordinatesToCanvas([pos[0]-1/2, pos[1]+1/2])
		clearPoly(door_canvas, [[x1,y1],[x2,y2],[x3,y3],[x4,y4]])
	}
	global_doors_to_delete = []
	drawDoors(global_doors_to_draw)
	global_doors_to_draw = []
}

function drawDoors(doors) {
	const img = spriteCache["door"];
	const scaleFactor = gridSize / 64;

	for (const door of doors) {
		const location = sprite_position(door);
		const angle = (door.Orientation + 1) % 2;
		const rotatedImage = rotate_img(img, angle, false);

		ctx.drawImage(
			rotatedImage,
			(location[0] - minX) * gridSize + 1,
			(location[1] - minY) * gridSize + 1,
			rotatedImage.width * scaleFactor - 2,
			rotatedImage.height * scaleFactor - 2
		);
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
		const imageName = sprite.ID.replace("cosmoteer.", "")
		const partData = getPartDataMap(sprite)
		const missileType = Number.parseInt(partData.get("missile_type"))

		let img;
		if (missileType === 2) {
			img = spriteCache.nuke_launcher
		} else if (missileType === 1) {
			img = spriteCache.emp_launcher
		} else if (missileType === 3) {
			img = spriteCache.mine_launcher
		} else {
			img = spriteCache[imageName]
		}

		if (img) {
			const [x, y] = convertCoordinatesToCanvas(sprite_position(sprite))
			const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX)
			drawPartImage(ctx, rotatedImage, x, y)
			sprite.width = rotatedImage.width*gridSize/64
			sprite.height = rotatedImage.height*gridSize/64
			square_map(sprite)
		}
	}
	global_sprites_to_draw = []

	for (let sprite of sprites) {
		drawPartIndicators(sprite)
	}
	drawSelectedPartIndicators(global_selected_sprites)
	if (cursorMode === "Select" || cursorMode === "Supply")  {
		clearPreview()
		drawSelectionindicators(global_selected_sprites)
	}
	if (cursorMode === "Supply") {
		clearLayer(drawing_canvas.getContext("2d"))
		drawSupplyChains()
	} else if (cursorMode === "Crew") {
		drawRoleIndicators(global_crew_role_sources)
	}
	if (hitbox_checkbox.checked) {
		drawHitboxes(sprites)
	} else {
		clearLayer(hitbox_canvas.getContext("2d"))
	}
	drawMirrorAxis()
	update_doors();
	clearLayer(resource_canvas.getContext("2d"))
	draw_resources(global_resources, resource_canvas);
}

function drawSelectedPartIndicators(selected_parts) {
	let ctx = drawing_canvas.getContext("2d")
	for (let part of selected_parts) {
		for (let i=0;i<global_weapon_targetes.length;i++) {
			if (isSameSprite(part, global_weapon_targetes[i].Key[0])) {
				let [x,y] = convertCoordinatesToCanvas(global_weapon_targetes[i].Value)
				ctx.beginPath()
				ctx.arc(x, y, 5, 0, Math.PI * 2)
				ctx.fill()
			}
		}
	}
}

function sprite_position(part) {
	position = [...(part.Location ?? part.Cell)]
	const sprite_size =
		spriteData[part.ID].sprite_size || spriteData[part.ID].size;
	const part_size = spriteData[part.ID].size;
	const part_rotation = part.Rotation;

	if (part_rotation === 0 && upTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 3 && upTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 1 && downTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 2 && downTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (multiple_turrets.includes(part.ID)) {
		if (part.ID === "cosmoteer.thruster_small_2way") {
			if (part_rotation === 1) {
				position[0] -= 1;
			}
			if (part_rotation === 2) {
				position[0] -= 1;
				position[1] -= 1;
			}
			if (part_rotation === 3) {
				position[1] -= 1;
			}
			if (part_rotation === 1) {
				position[0] -= 1;
			}
		} else if (part.ID === "cosmoteer.thruster_small_3way") {
			if (part_rotation === 2) {
				if (part_rotation === 3) {
					position[1] -= 1;
				}
			}
		}
	}
	if (
		part.ID === "cosmoteer.missile_launcher" &&
		getPartDataMap(part).get("missile_type") !== 0
	) {
		if (part_rotation === 0) {
			position[1] -= 1;
		}
		if (part_rotation === 3) {
			position[0] -= 1;
		}
	}
	if (part.ID === "cosmoteer.door") {
		if (part.Orientation === 0) {
			position[1] -= 0.5;
		} else {
			position[0] -= 0.5;
		}
	}
	return position;
}

function redrawEntireCanvas() {
	for (let c of global_canvases) {
		clearLayer(c.getContext("2d"))
	}
	drawGrid()
	drawBuildingGridBorders()
	global_sprites_to_draw.push(...sprites)
	global_doors_to_draw.push(...global_doors)
	updateCanvas()
}

function drawBuildingGridBorders() {
	let ctx = grid_canvas.getContext("2d")
	ctx.fillStyle = "red"
	ctx.lineWidth = 6
	drawPoly(grid_canvas, [convertCoordinatesToCanvas([60,60]), convertCoordinatesToCanvas([60,-60]), convertCoordinatesToCanvas([-60,-60]), convertCoordinatesToCanvas([-60,60])])
}

function drawPartIndicators(part) {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "red";

	if (part.ID == "cosmoteer.shield_gen_small") {
		let [centerX,centerY] = canvasCordFromsPartRelativeVector(part, [1,0])
		radius = convertLengthToCanvas(7.5)
		let arc = getArc(90, part.Rotation)
		ctx.fillStyle = "blue"
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.arc(centerX, centerY, radius, arc[0], arc[1])
		ctx.stroke(); 
	} 
	else if (part.ID == "cosmoteer.shield_gen_large") {
		let parts = getParts(sprites, isInRadiusToPartCondition(part, 25))
		let [centerX,centerY] = canvasCordFromsPartRelativeVector(part, [1.5,1.5])
		let hitboxes = hitboxListFromParts(parts)
		let arc = getArc(160, part.Rotation)
		//let arcs = getVisibleArcs(hitboxes, [loc[0],loc[1]-1.5], 13, (190 * Math.PI) / 180, (-10 * Math.PI) / 180)
		radius = convertLengthToCanvas(13)
		ctx.fillStyle = "blue"
		//for (let arc of arcs) {
			ctx.beginPath()
			ctx.lineWidth = 3
			ctx.arc(centerX, centerY, radius, arc[0], arc[1])
			ctx.stroke()
		//}
		
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
		ctx.fillRect(x, y, 10/getScalor()[0], 10/getScalor()[1]);
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

function drawHitboxes(parts) {
	const canvas = hitbox_canvas
	const ctx = canvas.getContext("2d")
	ctx.strokeStyle  = "rgb(199, 14, 174)"
	clearLayer(ctx)
	ctx.lineWidth = 2
	for (let part of parts) {
		let data = spriteData[part.ID]
		for (let poly of data.hitboxes || []) {
			let newpoly = rotatePoly(translatedPoly(poly,part.Location), Math.PI/2*part.Rotation, part.Location)
			let adder = [0,0]
			let size =  data.size 
			if (part.Rotation === 1) {
				adder[0] += size[1]
			} else if (part.Rotation === 3) {
				adder[1] += size[0]
			} else if (part.Rotation === 2) {
				adder[1] += size[1]
				adder[0] += size[0]
			}
			drawPoly(canvas, convertPolyToCanvas(translatedPoly(newpoly, adder)))
		}
	}
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

function convertLengthToCanvas(length) {
    return length * gridSize;
}

function partSprite(part) {
	const selectedSprite = part.ID;
	const imageName = selectedSprite.replace("cosmoteer.", "");
	return spriteCache[imageName]
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
	const ctx = drawing_canvas.getContext("2d");
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
	const parts = mirroredParts(repositionPartsRelative(inputparts))
	const canvas = document.getElementById("previewCanvas");
	const ctx = canvas.getContext("2d");
	clearLayer(ctx);
	ctx.globalAlpha = 0.5;

	for (let part of parts) {
		let x, y, pos;
		if (part.ID !== "cosmoteer.door" || part.Rotation%2==0) {
			[x, y] = convertCoordinatesToCanvas(sprite_position(part));
		} else {
			pos = sprite_position(part);
			[x, y] = convertCoordinatesToCanvas([pos[0] + 0.5, pos[1] - 0.5]);
		}
		const rotatedImage = rotate_img(
			partSprite(part),
			part.Rotation,
			part.FlipX,
		);
		drawPartImage(ctx, rotatedImage, x, y)
	}
	if (inputresources) {
		const resources = mirroredResources(inputresources)
		draw_resources(resources, canvas)
	}
	ctx.globalAlpha = 1.0;
}

function drawPartImage(ctx, img, x, y) {
	ctx.drawImage(
		img,
		x,
		y,
		img.width*gridSize/64 - 2,
		img.height*gridSize/64 - 2,
	);
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

function clearPoly(canvas, vertecies) {
	let ctx = canvas.getContext("2d")
	ctx.beginPath()
	ctx.moveTo(vertecies[0][0], vertecies[0][1])
	for (vertex of vertecies) {
		ctx.lineTo(vertex[0], vertex[1])
	}
	ctx.closePath()

	ctx.save() 
	ctx.clip();

	ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2)

	ctx.restore()

}

function drawPoly(canvas, vertices, fill = false) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(vertices[0][0], vertices[0][1]);
    for (let vertex of vertices) {
        ctx.lineTo(vertex[0], vertex[1]);
    }
    ctx.closePath();
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function convertPolyToCanvas(poly) {
	let new_poly = []
	for (let pos of poly) {
		new_poly.push(convertCoordinatesToCanvas(pos))
	}
	return new_poly
}

function getCanvasCorners(ctx, canvas) {
    const transform = ctx.getTransform();

    return {
        topLeft: {
            x: transform.a * 0 + transform.c * 0 + transform.e,
            y: transform.b * 0 + transform.d * 0 + transform.f
        },
        topRight: {
            x: transform.a * canvas.width + transform.c * 0 + transform.e,
            y: transform.b * canvas.width + transform.d * 0 + transform.f
        },
        bottomLeft: {
            x: transform.a * 0 + transform.c * canvas.height + transform.e,
            y: transform.b * 0 + transform.d * canvas.height + transform.f
        },
        bottomRight: {
            x: transform.a * canvas.width + transform.c * canvas.height + transform.e,
            y: transform.b * canvas.width + transform.d * canvas.height + transform.f
        }
    };
}

function drawGrid() {
    let ctx = grid_canvas.getContext("2d");
    const corners = getCanvasCorners(ctx, grid_canvas);

    const transform = ctx.getTransform();
    const inverse = transform.invertSelf(); // Get the inverse of the transformation matrix

    // Use the inverse to get the canvas corners in logical space
    const topLeft = inverse.transformPoint({ x: 0, y: 0 });
    const bottomRight = inverse.transformPoint({ x: grid_canvas.width, y: grid_canvas.height });

    // Calculate the min and max logical grid coordinates
    const minX = Math.floor(topLeft.x / gridSize);
    const maxX = Math.ceil(bottomRight.x / gridSize);
    const minY = Math.floor(topLeft.y / gridSize);
    const maxY = Math.ceil(bottomRight.y / gridSize);

    ctx.beginPath();
	ctx.lineWidth = 1

    // Draw vertical grid lines
    for (let x = minX; x <= maxX; x++) {
        let canvasX = x * gridSize;
        ctx.moveTo(canvasX, minY * gridSize);
        ctx.lineTo(canvasX, maxY * gridSize);
    }

    // Draw horizontal grid lines
    for (let y = minY; y <= maxY; y++) {
        let canvasY = y * gridSize;
        ctx.moveTo(minX * gridSize, canvasY);
        ctx.lineTo(maxX * gridSize, canvasY);
    }

    ctx.stroke();
}

function rotatePartRelativeVector(vec, part) {//Takes a part and a vector with part relative values assuming the part has rotation 0. If part doesnt have rotation 0 the vector will be rotated and translated appropriately 
	const rot = part.Rotation
    const theta = -Math.PI / 2 * rot;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    let rotatedVec = [vec[0] * cosTheta - vec[1] * sinTheta, vec[0] * sinTheta + vec[1] * cosTheta];
	let size = spriteData[part.ID].size
	if (rot == 1) {
        rotatedVec = [size[0]+rotatedVec[0],size[0]+rotatedVec[1]]
    } else if (rot == 2) {
        rotatedVec = [size[0]+rotatedVec[0], size[1]+rotatedVec[1]]
    } else if (rot == 3) {
		rotatedVec = [rotatedVec[0]+size[1]-size[0],rotatedVec[1]]
    }
    return rotatedVec
}

function canvasCordFromsPartRelativeVector(part, vec) {
	let distance_vector = rotatePartRelativeVector(vec, part)
	return convertCoordinatesToCanvas([distance_vector[0]+part.Location[0], distance_vector[1]+part.Location[1]])
}

function getShipScreenshot() {
	return canvas.toDataURL('image/png')
}
