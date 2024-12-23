//This is for detecting key inputs and handling them

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
    if (event.key === "1") {
        ChangeCursorMode("Place")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "2") {
        ChangeCursorMode("Select")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "3") {
        ChangeCursorMode("Delete")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "4") {
        ChangeCursorMode("Move")
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "5") {
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

//translation
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
