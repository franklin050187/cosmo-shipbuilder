//This file if for handeling warning messages which are supposed to tell the user if something is wrong with their ship
//A warning should be of the form: {id: "id_string", message: message_string, locations: [Locations_array], tags: tag_string_array}

const warning_function_list = [
    function feWarning(stats) {
        let fes = getParts(stats.parts, hasIDCondition("cosmoteer.fire_extinguisher"))
        if (fes.length==0) {
            return {id: "no_fire_extinguisher", message: "Your ship does not contain any fire extinguishers", locations: [], tags: []}
        }
    },
    function airlockWarning(stats) {
        let airlocks = getParts(stats.parts, hasIDCondition("cosmoteer.airlock"))
        if (airlocks.length==0) {
            return {id: "no_airlock",  message: "Your ship does not contain any airlocks", locations: [], tags: []}
        }
    },
    function cpWarning(stats) {
        if (stats.command_cost > stats.command_points) {
            return {id: "not_enough_command_points",  message: "Your ship does not have enough command points", locations: [], tags: []}
        }
    },
    function crWarning(stats) {
        if (0 == stats.command_points) {
            return {id: "no_cr",  message: "Your ship does not have a control room", locations: [], tags: ["illegal ship"]}
        }
    },
    function crEfficiencyWarning(stats) {
        let cockpits = getParts(stats.parts, hasIDCondition("cosmoteer.control_room_small"))
        let control_rooms = getParts(stats.parts, hasIDCondition("cosmoteer.control_room_med"))
        let bool_small = cockpits.length > 2
        let bool_med = cockpits.length > 2  
        let locations = []
        if (bool_small) {
            for (part of cockpits) {
                locations.push(part)
            }
        }
        if (bool_med) {
            for (part of control_rooms) {
                locations.push(part)
            }
        }
        if (bool_small || bool_med) {
            return {id: "innefficient_cr_sizes1",  message: "Your ship has a inefficient amount of smaller cr.", locations: locations, tags: ["optimisation"]}
        }
    },
    function tooMuchCpWarning(stats) {
        let cost = stats.command_cost
        let points = stats.command_points
        let bridges = getParts(stats.parts, hasIDCondition("cosmoteer.control_room_large")) 
        let control_rooms = getParts(stats.parts, hasIDCondition("cosmoteer.control_room_med")) 
        let bool_1= control_rooms.length > 0 && points-cost>=100
        let bool_2 = bridges.length > 0 && points-cost>=750
        let locations = []
        if (bool_1) {
            for (part of control_rooms) {
                locations.push(part)
            }
        }
        if (bool_2) {
            for (part of bridges) {
                locations.push(part)
            }
        }
        if (bool_1 || bool_2) {
            return {id: "innefficient_cr_sizes2",  message: "Your ship could split big cr into smaller ones to save cost", locations: locations, tags: []}
        }
    },
    function connectionWarning(stats) {
        const partition = stats.connection_graph_partition
        if (partition.length > 1) {
            return {id: "not_connected",  message: "Your ship is not connected", locations: [], tags: ["computationally_expensive", "illegal ship"]}
        }
    }
]

function getWarnings(stats) {
    let warnings = []
    for (let warning of warning_function_list) {
        if (warning(stats) !== undefined) {
            warnings.push(warning(stats))
        }
    }
    return warnings
}

function containsWarning(warnings, warning_id) {
	for (const warning of warnings) {
		if (warning.id === warning_id) {
			return true;
		}
	}
	return false;
}
