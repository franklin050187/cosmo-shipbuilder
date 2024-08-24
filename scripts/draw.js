//This file is are all functions related to drawing on the canvas
function draw_resources() {
    const json = json_import_text.value;
    const data = JSON.parse(json);
    const part_data = data.Parts

    if (resources == "Unset") {
        return
    }

    get_all_locations().forEach(location => {
        resources.forEach(resource => {
            if (location[0] == resource.Key[0] && location[1] == resource.Key[1]) {
                const imageName = resource.Value;
                const img = new Image();

                img.src = `sprites/${imageName}.png`;

                img.onload = () => {
                    x = location[0];
                    y = location[1];
                    const rotatedImage = rotate_img(img, 0, false);
                    ctx.drawImage(rotatedImage, (x - minX) * gridSize + 1, (y - minY) * gridSize + 1, rotatedImage.width - 2, rotatedImage.height - 2);
                };
            }
        })
    })
}

function draw_doors() {
    doors.forEach(door => {
        const img = new Image();

        img.src = `sprites/door.png`;


        img.onload = () => {
            rotation = (door.Orientation + 1) % 2;
            let door_location = []
            door_location[0] = door.Cell[0]
            door_location[1] = door.Cell[1]
            let location = sprite_position(door, door_location)
            x = location[0];
            y = location[1];
            let angle = rotation

            const rotatedImage = rotate_img(img, angle, false);
            ctx.drawImage(rotatedImage, (x - minX) * gridSize + 1, (y - minY) * gridSize + 1, rotatedImage.width - 2, rotatedImage.height - 2);
        };
    })
}

function redrawCanvas() {
    const newSprites = sprites.filter(sprite => !spritesDrawn.has(sprite));
    const oldSprites = Array.from(spritesDrawn);
    spritesDrawn = new Set(sprites);

    // Clear old sprites
    oldSprites.forEach(sprite => {
        if (!spritesDrawn.has(sprite)) {
            const [x, y] = sprite_position(sprite, [sprite.Location[0], sprite.Location[1]]);
            ctx.clearRect(
                (x - minX) * gridSize + 1,
                (y - minY) * gridSize + 1,
                sprite.width,
                sprite.height
            );
        }
    });

    // Draw new sprites
    newSprites.forEach(sprite => {
        const imageName = sprite["ID"].replace("cosmoteer.", "");
        const partData = getPartDataMap(sprite);
        const missileType = parseInt(partData.get("missile_type"));

        let img;
        if (missileType === 2) {
            img = spriteCache["nuke_launcher"];
        } else if (missileType === 1) {
            img = spriteCache["emp_launcher"];
        } else if (missileType === 3) {
            img = spriteCache["mine_launcher"];
        } else {
            img = spriteCache[imageName];
        }

        if (img) {
            let [x, y] = sprite_position(sprite, [sprite.Location[0], sprite.Location[1]]);
            const rotatedImage = rotate_img(img, sprite.Rotation, sprite.FlipX);
            ctx.drawImage(rotatedImage, (x - minX) * gridSize + 1, (y - minY) * gridSize + 1, rotatedImage.width - 2, rotatedImage.height - 2);
            sprite.width = rotatedImage.width;
            sprite.height = rotatedImage.height;
            square_map(sprite);
        }
    });

    updateShipStats();
    draw_doors();
    draw_resources();
}
