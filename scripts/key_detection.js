//This is for detecting key inputs and handling them

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
    if (event.ctrlKey && event.key === "v") {
        paste()
    }
});

function undo() {
    if (ship_action_history_depth <= ship_action_history.length && ship_action_history.length>0) {
        ship_action_history_depth == ship_action_history_depth - 1
        excecuteAction(inverseAction(getCurrentLastAction()))
    }
}

function cut() {
    action = {type: "remove_parts", objects: selected_sprites}
    excecuteAction(action)
    ship_action_history.push(action)
}

function paste() {
    global_sprites_to_place = selected_sprites 
    ChangeCursorMode("Place")
}
