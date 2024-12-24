//This is for detecting key inputs and handling them

let global_selection_box_start = []
let clickCount = 0;
let clickTimer;

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
        shiftMirrorCenter([0,getMultiplier(event)])
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
element.addEventListener('dblclick', function(event) {//double click to select all parts with same name and orientation
    console.log('Double-click detected at:', event.clientX, event.clientY);
});
element.addEventListener('click', function (event) {//triple click to select all parts with same name
    clickCount++;

    if (clickCount === 1) {
        // Start a timer to reset the count if no triple-click happens
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500); // 500ms threshold for triple-click
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer); // Clear the timer
        clickCount = 0; // Reset the count
        console.log('Triple-click detected at:', event.clientX, event.clientY);
    }
});

//control groups
for (let i=0;i<10;i++) {
    document.addEventListener("keydown", function(event) {
        if (event.key === i.toString()) {
            selectControlGroup(i)
        }
    });
}


function getMultiplier(event) {
    if (event.ctrlKey) {  
        return 5
    } 
    return 1
}

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
    if (!event.shiftKey) {
        global_selected_sprites = [...selection]
    } else {
        global_selected_sprites.push(...selection)
    }
    global_selection_box_start = []
    clearLayer(additionals_canvas.getContext("2d")) //clear selection box
    updateCanvas()
}
