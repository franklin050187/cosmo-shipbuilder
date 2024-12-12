function generatePart(id, location=[0,0], rotation=0, flipX=false) {
    return {
        FlipX: flipX,
        ID: id,
        Location: location,
        Rotation: rotation,
    }
}

function partCopy(part) {
    return generatePart(part.ID, part.Location, part.Rotation, part.FlipX)
}

function partsCopy(parts) {
    list = []
    for (let part of parts) {
        list.push(partCopy(part))
    }
    return list
}
