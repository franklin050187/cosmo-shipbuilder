//Actions describe changes in the ship. Adding and removing parts would be actions for example
//Actions are of the form: 
//{type: "type", objects: objects_array}

let ship_action_stack = []

function inverseAction(action) {
    if (action.type === "add_part") {
        action.type = "remove_part"
    }
    if (action.type === "remove_part") {
        action.type = "add_part"
    }
    return action
}
