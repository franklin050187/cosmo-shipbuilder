//functions related to settings, toggles or properties for parts
let global_part_properties = []
let global_control_groups = []

function applyProperty() {
    new_value = parseInt(property_edit.value);
    for (let sprite of global_selected_sprites) {
        for (toggle of global_part_properties) {
            if (isSameToggleType(toggle, JSON.parse(property_select.value)) && toggleBelongsToSprite(toggle, sprite)) {
                toggle.Value = new_value;
            }
        }
    }
    updateCanvas()
}

function addToControlGroup(group_num, parts) {
    const obj = global_control_groups.find(item => item.Key === group_num);
    if (obj) {
        obj.Value.push(...parts);
    } else {
        global_control_groups.push({ Key: group_num, Value: [...parts]});
    }
}

function removeFromControlGroup(group_num, parts) {
    const obj = global_control_groups.find(item => item.Key === group_num);
    if (obj) {
        obj.Value = obj.Value.filter(value => 
            !parts.some(part => isSameSprite(value, part))
        );
    }
}

function selectControlGroup(group_num) {
    const parts = global_control_groups.find(item => item.Key === group_num);
    global_selected_sprites = parts ? parts.Value : [];
}
