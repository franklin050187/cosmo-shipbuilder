//Actions describe changes in the ship. Adding and removing parts would be actions for example
//Actions are of the form: 
//{type: "type", objects: objects_array}

let ship_action_history = []
let ship_action_history_depth = 0
const max_history_length = 100

function actionCopy(action) {
    return {type: action.type, objects: partsCopy(action.objects)}
}

function inverseAction(action_in) {
    let action = actionCopy(action_in)
    if (action.type === "add_parts") {
        action.type = "remove_parts"
    } else if (action.type === "remove_parts") {
        action.type = "add_parts"
    }
    return action
}

function addActionToHistory(type_in, objects_in) {
    //Remove all Elements over the currently used element in the history.
    ship_action_history.slice(getCurrentLastActionIndex(), ship_action_history_depth)
    ship_action_history.push({type: type_in, objects: objects_in})
    if (ship_action_history.length > max_history_length) {
        ship_action_history.slice(0, ship_action_history.length-max_history_length)
    }
}

function excecuteAction(action) {
    switch (action.type) {
        case ("add_parts"): 
            place_sprites(action.objects, false)
        break
        case ("remove_parts"): 
            remove_multiple_from_sprites(action.objects, false)
        break
    }
}

function getCurrentLastAction() {
    return getFromTopOfList(ship_action_history, ship_action_history_depth)
}

function getCurrentLastActionIndex() {
    return ship_action_history.length-1-ship_action_history_depth
}

function getFromTopOfList(list, index) {
    return list[list.length-1-index]
}
