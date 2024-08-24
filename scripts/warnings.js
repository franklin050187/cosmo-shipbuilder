//This file if for handeling warning messages which are supposed to tell the user if something is wrong with their ship
//A warning should be of the form: {id: "id_string", message: message_string, locations: [Locations_array], tags: tag_string_array}

const warning_function_list = [
    function feWarning() {
        let fes = getParts("cosmoteer.fire_extinguisher")
        if (fes.length==0) {
            return {id: "no_fire_extinguisher", message: "Your ship does not contain any fire extinguishers", locations: [], tags: []}
        }
    },
    function airlockWarning() {
        let airlocks = getParts("cosmoteer.airlock")
        if (airlocks.length==0) {
            return {id: "no_airlock",  message: "Your ship does not contain any airlocks", locations: [], tags: []}
        }
    },
    function cpWarning() {
        if (getShipCommandCost() > getShipCommandPoints()) {
            return {id: "not_enough_command_points",  message: "Your ship does not have enough command points", locations: [], tags: []}
        }
    }
]

function getWarnings() {
    let warnings = []
    for (let warning of warning_function_list) {
        if (warning() !== undefined) {
            warnings.push(warning())
        }
    }
    return warnings
}

function containsWarning(warnings, warning_id) {
    for (let warning of warnings) {
        if (warning.id == warning_id) {
            return true
        }
    }
    return false
}


