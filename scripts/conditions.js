//this file is for conditions or functions that give conditions

function isSameSprite(sprite1, sprite2) {
	return (
		sprite1.ID === sprite2.ID &&
		sprite1.Location[0] === sprite2.Location[0] &&
		sprite1.Location[1] === sprite2.Location[1]
	);
}

function isSameToggleType(toggle1, toggle2) {
	return toggle1.Key[1] === toggle2.Key[1];
}

function isInTagsCondition(tag) {
    return part => spriteData[part.ID].tags.includes(tag)
}

function hasIDCondition(id) {
    return part => part.ID === id
}

function hasRotationCondition(rotation) {
    return part => part.Rotation === rotation
}

function isMergingPartCondition() {
	return part => mergingParts.includes(part.ID)
}
