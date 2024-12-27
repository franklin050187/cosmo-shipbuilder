//This is for detecting key inputs and handling them

let global_selection_box_start = []
let clickCount = 0;
let lastClickTime = 0;
let global_left_mousdown_toggle = false
let global_right_mousdown_toggle = false

//Stuff that requires the canvas so is loaded after it
document.addEventListener("DOMContentLoaded", () => {
    //ctrl+ hotkeys
    canvas.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "z") {
            undo()
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "x") {
            cut()
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "c") {
            copy()
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "v") {
            paste()
        }
    });

    //Cursor modes
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F1") {
            event.preventDefault();
            ChangeCursorMode("Place")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F2") {
            event.preventDefault();
            ChangeCursorMode("Select")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F3") {
            event.preventDefault();
            ChangeCursorMode("Delete")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F4") {
            event.preventDefault();
            ChangeCursorMode("Move")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F5") {
            event.preventDefault();
            ChangeCursorMode("Supply")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F6") {
            event.preventDefault();
            ChangeCursorMode("Resource")
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "F7") {
            event.preventDefault();
            ChangeCursorMode("Crew")
        }
    });

    //Mirror center shifts
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "ArrowUp") {
            event.preventDefault()
            shiftMirrorCenter([0,-getMultiplier(event)])
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            shiftMirrorCenter([-getMultiplier(event),0])
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight") {
            event.preventDefault()
            shiftMirrorCenter([getMultiplier(event),0])
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            shiftMirrorCenter([0,1])
        }
    });

    //translation of camera
    let global_translation_amount = 20
    canvas.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            event.preventDefault();
            const ctx = c.getContext("2d")
            const currentTransform = ctx.getTransform();
            translateCanvas([100,100])
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "w") {
            event.preventDefault()
            translateCanvas([0,global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event)], true)
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "s") {
            event.preventDefault()
            translateCanvas([0,-global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event)], true)
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "a") {
            event.preventDefault()
            translateCanvas([global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event),0], true)
        }
    });
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "d") {
            event.preventDefault()
            translateCanvas([-global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event),0], true)
        }
    });

    //Click dragging
    canvas.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            global_left_mousdown_toggle = true
        }
        if (event.button === 2) {
            global_right_mousdown_toggle = true
        }
        if ((cursorMode === "Select" || cursorMode === "Supply")) { 
            startSelectionBox(mousePos(event))
        }
    });
    canvas.addEventListener('mouseup', (event) => {  
        if (event.button === 0) {
            global_left_mousdown_toggle = false
        }
        if (event.button === 2) {
            global_right_mousdown_toggle = false
        }
        if ((cursorMode === "Select" || cursorMode === "Supply")) { 
            endSelectionBox(mousePos(event), event)
        }
    });

    //Delete supply chains
    canvas.addEventListener("keydown", function(event) {
        if (event.key === "x") {
            event.preventDefault()

            let parts = existingMirroredParts(global_selected_sprites, sprites)
            removePartsFromKeyList(parts, global_crew_assignments)
            removePartsFromKeyList(parts, global_supply_chains)
            updateCanvas()
        }
    });
    //mouse clicks
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
    //zoom
    canvas.addEventListener('wheel', (event) => {
        event.preventDefault()
        if (event.deltaY > 0) {//down
            zoom(-0.1, event)
        } else {//up
            zoom(0.1, event)
        }
        
    }, { passive: false });

    //control groups
    for (let i=0;i<10;i++) {
        canvas.addEventListener("keydown", function(event) {
            if (event.key === (i).toString()) {
                event.preventDefault()
                if (event.ctrlKey) {
                    addToControlGroup(i-1, global_selected_sprites)
                } else if (event.altKey) {
                    removeFromControlGroup(i, global_selected_sprites)
                } else {
                    selectControlGroup(i)
                }
            } 
        });
    }
});



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
    updateCanvas()
}

function handleCanvasMouseMove(event) {
	let [canvasPositionX, canvasPositionY] = mousePos(event)

	updateCoordinates(canvasPositionX, canvasPositionY);

	if (cursorMode === "Delete") {
        if (global_left_mousdown_toggle) {
            doIfCursorOverPart(event, (part) => {
                remove_multiple_from_sprites(mirroredParts([part]))
                clearPreview()
                updateCanvas();
            })
        }
        if (global_right_mousdown_toggle) {
            removeDoor([canvasPositionX, canvasPositionY])
		    updateCanvas()
        }
		drawDeletePreview(event)
		return;
	}

	if (cursorMode === "Place") {
		if (!isPreviewSpriteLoaded) return;
		global_sprites_to_place[0].Location = [canvasPositionX, canvasPositionY]
		drawPreview(global_sprites_to_place, global_resources_to_place);
        if (global_left_mousdown_toggle) {
            place_sprites(global_sprites_to_place);
        }
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
    if (cursorMode === "Crew") {
        doIfCursorOverPart(event, (part) => {
            addCrewSource(existingMirroredParts([part], sprites), global_crew_role_to_place)
        });
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
		removeDoor(pos)
		updateCanvas()
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
