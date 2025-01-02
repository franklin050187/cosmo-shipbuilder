//This is a ship object meant to connect some of the lose lists that define the entire ship.
function getShip(parts, doors, toggles, resources) {
    return {
        parts: parts,
        doors: doors,
        toggles: toggles,
        resources: resources,
    }
}
