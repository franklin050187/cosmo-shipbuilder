//This is for detecting key inputs and handling them

let global_selection_box_start = []
let clickCount = 0;
let lastClickTime = 0;
let global_left_mousdown_toggle = false
let global_right_mousdown_toggle = false
let canvas_is_focused = false
let global_wasd_keys_down = {"w": false, "a": false, "s": false, "d":false}
const global_translation_amount = 20

//Mirror center shifts
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp"&& canvas_is_focused) {
        event.preventDefault()
        shiftMirrorCenter([0,-getMultiplier(event)])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft"&& canvas_is_focused) {
        event.preventDefault()
        shiftMirrorCenter([-getMultiplier(event),0])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight"&& canvas_is_focused) {
        event.preventDefault()
        shiftMirrorCenter([getMultiplier(event),0])
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown"&& canvas_is_focused) {
        event.preventDefault()
        shiftMirrorCenter([0,1])
    }
});

//ctrl+ hotkeys
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z"&& canvas_is_focused) {
        undo()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "y"&& canvas_is_focused) {
        redo()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "x"&& canvas_is_focused) {
        cut()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "c"&& canvas_is_focused) {
        copy()
    }
});
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "v"&& canvas_is_focused) {
        paste()
    }
});

//Cursor modes
document.addEventListener("keydown", function(event) {
    if (event.key === "F1" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Place")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F2" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Select")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F3" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Delete")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F4" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Move")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F5" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Supply")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F6" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Resource")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "F7" && canvas_is_focused) {
        event.preventDefault();
        ChangeCursorMode("Crew")
    }
});

//mirror mode
document.addEventListener("keydown", function(event) {
    if (event.key === "m" && canvas_is_focused) {
        event.preventDefault();
        if (mirror_select.value === "none") {
            changeMirrorMode(global_previous_mirror_mode)
        } else {
            changeMirrorMode("none")
        }
    }
});

//control groups
for (let i=0;i<10;i++) {
    document.addEventListener("keydown", function(event) {
        if (event.key === (i).toString() && canvas_is_focused) {
            event.preventDefault()
            if (event.ctrlKey) {
                addToControlGroup(i-1, global_selected_sprites)
            } else if (event.altKey) {
                removeFromControlGroup(i-1, global_selected_sprites)
            } else {
                selectControlGroup(i)
            }
        } 
    });
}


//Delete supply chains
document.addEventListener("keydown", function(event) {
    if (event.key === "x" && canvas_is_focused) {
        event.preventDefault()

        let parts = existingMirroredParts(global_selected_sprites, sprites)
        removePartsFromKeyList(parts, global_crew_assignments)
        removePartsFromKeyList(parts, global_supply_chains)
        updateCanvas()
    }
});

//Stuff that requires the canvas so is loaded after it
document.addEventListener("DOMContentLoaded", () => {
    //Track if canvas is focused
    canvas.addEventListener("mouseenter", () => {
        canvas_is_focused = true;
      });
      
      // Detect when the cursor leaves the canvas
      canvas.addEventListener("mouseleave", () => {
        canvas_is_focused = false;
      });

    //translation of camera
    canvas.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            event.preventDefault();
            const ctx = c.getContext("2d")
            const currentTransform = ctx.getTransform();
            translateCanvas([100,100])
        }
    });
    document.addEventListener("keydown", function(event) {
        if ((event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") && canvas_is_focused && !global_wasd_keys_down[event.key]) {
            event.preventDefault()
            global_wasd_keys_down[event.key] = true
            wasdCanvasMove(event)
        }
    });
    document.addEventListener("keyup", function(event) {
        if (event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") {
            event.preventDefault()
            global_wasd_keys_down[event.key] = false
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
        if ((cursorMode === "Select" || cursorMode === "Supply") && event.button === 0) { 
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
        if ((cursorMode === "Select" || cursorMode === "Supply" && event.button === 0)) { 
            endSelectionBox(mousePos(event), event)
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
});

function getMultiplier(event) {
    if (event.ctrlKey) {  
        return 5
    } 
    return 1
}

function undo() {
    if (ship_action_history_depth <= ship_action_history.length && ship_action_history.length>0) {
        excecuteAction(inverseAction(getCurrentLastAction()))
        ship_action_history_depth = Math.min(ship_action_history_depth + 1, ship_action_history.length)
    }
}

function redo() {
    if (ship_action_history_depth <= ship_action_history.length && ship_action_history.length>0) {
        ship_action_history_depth = Math.max(ship_action_history_depth - 1, 0)
        excecuteAction(getCurrentLastAction())
    }
}

function cut() {
    copy()
    action = {type: "remove_parts", objects: global_selected_sprites}
    excecuteAction(action)
    ship_action_history.push(action)
}

function copy() {
    global_copied_parts = absoluteToRalativePartCoordinates(partsCopy(global_selected_sprites))
}

function paste() {
    global_sprites_to_place = global_copied_parts
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
        global_unmirrored_selected_sprites = [...selection]
    } else {
        global_selected_sprites.push(...sel)
        global_unmirrored_selected_sprites.push(...sel)
    }
    global_selection_box_start = []
    updateCanvas()
    updateSpriteSelection()
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
            doIfCursorOverDoor(event, (part) => {
                removeDoors(part)
            })
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
        if (global_left_mousdown_toggle) {
            global_resources_to_place[0].Key = mousePos(event)
            placeResources(global_resources_to_place);
        }
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
        doIfCursorOverPart(event, part => selectParts(existingMirroredParts([part], sprites), [part]));
    }
    if (cursorMode === "Supply") {
        doIfCursorOverPart(event, part => selectParts(existingMirroredParts([part], sprites), [part]));
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
        rotateParts(global_sprites_to_place, 1)
		handleCanvasMouseMove(event); 
	} else if (cursorMode === "Delete") {
        doIfCursorOverDoor(event, (part) => {
            removeDoors(part)
		})
	} else if (cursorMode === "Select") {
		global_selected_sprites = []
		updateSpriteSelection()
		updateCanvas()
	} else if (cursorMode === "Supply") {
		doIfCursorOverPart(event, (part) => {
			addSupplyChains(part, global_unmirrored_selected_sprites)
			let part2arr = existingMirroredParts([part], sprites, false)
			if (part2arr[0]) {
				addSupplyChains(part2arr[0], existingMirroredParts(global_unmirrored_selected_sprites,sprites, false))
			}
		})
	} else if (cursorMode === "Resource") {
        let resource = getResourceFromLocation(pos)
        if (resource) {
            removeResources(mirroredResources([resource]))
        }
	}
}

function wasdCanvasMove(event) {
    let vec = [0,0]
    let key = event.key
    if (key === "w") {
        vec[1] = 1
    } else if (key === "a") {
        vec[0] = 1
    } else if (key === "s") {
        vec[1] = -1
    } else if (key === "d") {
        vec[0] = -1
    }
    const amount = global_translation_amount/canvas.getContext("2d").getTransform().a*getMultiplier(event)
    console.log(global_wasd_keys_down)
    if (global_wasd_keys_down[key]) {
        translateCanvas(scaleVec(vec, amount), true)
        requestAnimationFrame(() => wasdCanvasMove(event))
    }
}

