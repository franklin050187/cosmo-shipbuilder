//This is for detecting key inputs and handling them

let global_selection_box_start = []
let clickCount = 0;
let lastClickTime = 0;

//ctrl+ hotkeys
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z") {
        undo()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "x") {
        cut()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "c") {
        copy()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "v") {
        paste()
    }
});

//Cursor modes
document.addEventListener("keydown", function(event) {
    if (event.key === "F1") {
        event.preventDefault();
        ChangeCursorMode("Place")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F2") {
        event.preventDefault();
        ChangeCursorMode("Select")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F3") {
        event.preventDefault();
        ChangeCursorMode("Delete")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F4") {
        event.preventDefault();
        ChangeCursorMode("Move")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F5") {
        event.preventDefault();
        ChangeCursorMode("Supply")
    }
});

//Mirror center shifts
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault()
        shiftMirrorCenter([0,-getMultiplier(event)])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        event.preventDefault()
        shiftMirrorCenter([-getMultiplier(event),0])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        event.preventDefault()
        shiftMirrorCenter([getMultiplier(event),0])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown") {
        event.preventDefault()
        shiftMirrorCenter([0,1])
    }
});

//zoom
document.addEventListener('wheel', (event) => {
    if (event.ctrlKey && event.shiftKey) {
        event.preventDefault()
        if (event.deltaY > 0) {//down
            zoom(-0.1, event)
        } else {//up
            zoom(0.1, event)
        }
    } 
  }, { passive: false });

//translation of camera
let global_translation_amount = 20
document.addEventListener('mousedown', (event) => {
    if (event.button === 1) {
        event.preventDefault();
        const ctx = c.getContext("2d")
        const currentTransform = ctx.getTransform();
        translateCanvas([100,100])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "w") {
        event.preventDefault()
        translateCanvas([0,global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event)], true)
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "s") {
        event.preventDefault()
        translateCanvas([0,-global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event)], true)
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "a") {
        event.preventDefault()
        translateCanvas([global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event),0], true)
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "d") {
        event.preventDefault()
        translateCanvas([-global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event),0], true)
    }
});

//Part selection
document.addEventListener('mousedown', (event) => {
    if ((cursorMode === "Select" || cursorMode === "Supply") && event.button === 0) { 
        startSelectionBox(mousePos(event))
    }
});
document.addEventListener('mouseup', (event) => {
    if ((cursorMode === "Select" || cursorMode === "Supply") && event.button === 0) { 
        endSelectionBox(mousePos(event), event)
    }
});

//mouse clicks
document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("spriteCanvas")
	canvas.addEventListener("mousemove", handleCanvasMouseMove)
	canvas.addEventListener("contextmenu", handleRightClick)
    canvas.addEventListener("click", (event) => {
        const now = Date.now()
        
        if (now - lastClickTime > 400) {
            clickCount = 0
        }
    
        clickCount++
        lastClickTime = now
    
        if (clickCount === 1) {
            handleSingleCanvasClick(event)
        } else if (clickCount === 2) {
            handleSingleCanvasClick(event)
            handleDoubleCanvasClick(event)
        } else if (clickCount === 3) {
            handleSingleCanvasClick(event)
            handleTripleCanvasClick(event)
            clickCount = 0
        }
    });
});

//control groups
for (let i=0;i<10;i++) {
    document.addEventListener("keydown", function(event) {
        event.preventDefault()
        if (event.key === i.toString()) {
            if (event.ctrlKey) {
                addToControlGroup(i, global_selected_sprites)
            } else if (event.altKey) {
                removeFromControlGroup(i, global_selected_sprites)
            } else {
                selectControlGroup(i)
            }
        } 
    });
}

function getMultiplier(event) {
    if (event.ctrlKey) {  
        return 5
    } 
    return 1
}

//

function undo() {
    if (ship_action_history_depth <= ship_action_history.length && ship_action_history.length>0) {
        ship_action_history_depth == ship_action_history_depth - 1
        excecuteAction(inverseAction(getCurrentLastAction()))
    }
}

function cut() {
    copy()
    action = {type: "remove_parts", objects: global_selected_sprites}
    excecuteAction(action)
    ship_action_history.push(action)
}

function copy() {}

function paste() {
    global_sprites_to_place = absoluteToRalativePartCoordinates(partsCopy(global_selected_sprites))
    ChangeCursorMode("Place")
}

function startSelectionBox(pos) {
    global_selection_box_start = [pos[0],pos[1]]
}

function endSelectionBox(pos, event) {
    let selection = []
    let box1 = [global_selection_box_start,pos]
    for (let part of sprites) {
        if(areBoxesOverlapping(box1,partBoundingBox(part))) {//Checks if part is in the selection box
            selection.push(part)
        }
    }
    let sel = existingMirroredParts([...selection], sprites)
    if (!event.shiftKey) {
        global_selected_sprites = [...sel]
    } else {
        global_selected_sprites.push(...sel)
    }
    global_selection_box_start = []
    clearLayer(additionals_canvas.getContext("2d")) //clear selection box
    updateCanvas()
}

function handleCanvasMouseMove(event) {
	let [canvasPositionX, canvasPositionY] = mousePos(event)

	updateCoordinates(canvasPositionX, canvasPositionY);

	if (cursorMode === "Delete") {
		drawDeletePreview(event)
		return;
	}

	if (cursorMode === "Place") {
		if (!isPreviewSpriteLoaded) return;
		global_sprites_to_place[0].Location = [canvasPositionX, canvasPositionY]
		drawPreview(global_sprites_to_place, global_resources_to_place);
		return;
	}

	if (cursorMode === "Select" || cursorMode === "Supply") {
		if (global_selection_box_start[0]) {
			drawSelectionBox(mousePos(event))
		}
	}

	if (cursorMode === "Move") {
		if (global_sprites_to_place.length > 0) {
			global_sprites_to_place[0].Location = [canvasPositionX, canvasPositionY]
			drawPreview(global_sprites_to_place, undefined);
		}
		return;
	}

    if (cursorMode === "Resource") {
        global_resources_to_place[0].Key = mousePos(event)
        drawPreview(global_sprites_to_place, global_resources_to_place)
    }
}

function handleSingleCanvasClick(event) {
    // place sprite
    if (cursorMode === "Place") {
        place_sprites(global_sprites_to_place);
    }
    // remove sprite
    if (cursorMode === "Delete") {
        doIfCursorOverPart(event, (part) => {
            remove_multiple_from_sprites(mirroredParts([part]))
            clearPreview()
            updateCanvas();
        })
    }
    // move sprite
    if (cursorMode === "Move") {
        const pos = mousePos(event);
        if (global_sprites_to_place.length === 0) {
            doIfCursorOverPart(event, (part) => {
                global_sprites_to_place = [partCopy(part)]
                remove_multiple_from_sprites(mirroredParts([part]))
            })
        } else {
            place_sprites(global_sprites_to_place);
            clearPreview()
            global_sprites_to_place = []
        }
    }
    // select sprite
    if (cursorMode === "Select") {
        doIfCursorOverPart(event, part => selectParts(existingMirroredParts([part], sprites)));
    }
    if (cursorMode === "Supply") {
        doIfCursorOverPart(event, part => selectParts(existingMirroredParts([part], sprites)));
    }
    if (cursorMode === "Resource") {
        global_resources_to_place[0].Key = mousePos(event)
        placeResources(global_resources_to_place);
    }
} 

function handleDoubleCanvasClick(event) {
    if (cursorMode === "Select") {
        doIfCursorOverPart(event, (part_at_cursor) => {
            selectParts(getParts(sprites, (part) => hasIDCondition(part_at_cursor.ID)(part) && hasRotationCondition(part_at_cursor.Rotation)(part)))
        })
    }
}

function handleTripleCanvasClick(event) {
    if (cursorMode === "Select") {
        doIfCursorOverPart(event, (part_at_cursor) => {
            selectParts(getParts(sprites, hasIDCondition(part_at_cursor.ID)))
        })
    }
}

function handleRightClick(event) {
	event.preventDefault();
	let pos = mousePos(event)
	if (cursorMode === "Place" || cursorMode === "Move") {
		for (part of global_sprites_to_place) {
			part.Rotation = (part.Rotation + 1) % 4
		}
		handleCanvasMouseMove(event); 
	} else if (cursorMode === "Delete") {
		removeDoor(pos);
		updateCanvas();
	} else if (cursorMode === "Select") {
		global_selected_sprites = []
		updateSpriteSelection()
		updateCanvas()
	} else if (cursorMode === "Supply") {
		doIfCursorOverPart(event, (part) => {
			addSupplyChains(part, global_selected_sprites)
			let part2arr = existingMirroredParts([part], sprites, false)
			if (part2arr[0]) {
				addSupplyChains(part2arr[0], existingMirroredParts(global_selected_sprites,sprites, false))
			}
		});
	} else if (cursorMode === "Resource") {
        let resource = getResourceFromLocation(pos)
        if (resource) {
            removeResources(mirroredResources([resource]))
        }
	}
}
