//This file is for purely mathematical functions taht are not related to cosmoteer or the website.

function vecLength(vec) {
	return Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
}

function pointDist(vec1, vec2) {
	return vecLength([vec1[0] - vec2[0], vec1[1] - vec2[1]]);
}

function InverseLerp(interval, delimiter) {
	if (interval[0] > delimiter) {
		return 0;
	}
	if (interval[1] < delimiter) {
		return 1;
	}
	return (delimiter - interval[0]) / (interval[1] - interval[0]);
}

function areCoordinatesAdjacent(pos1, pos2) {
    let x_dif = Math.abs(pos1[0]-pos2[0])
    let y_dif = Math.abs(pos1[1]-pos2[1])
    if ((x_dif==1 && y_dif==0) || (x_dif==0 && y_dif==1)) {
        return true
    }
    return false
}

function sameTile(location1, location2) {
    return location1[0]==location2[0]&&location1[1]==location2[1]
}

function indexOfListMax(arr) {
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[maxIndex]) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

function mirroredPositions(pos, allaxis, axislocations) {
    let locations = [pos];
    let rotationFlips = [[0, 0]];
    
    for (let axis of allaxis) {
        let loc = [...pos];
        if (axis.Type === "linear") {
            loc[axis.Rotation] = -(pos[axis.Rotation] - axislocations[axis.Rotation]) + axislocations[axis.Rotation] + axis.Rotation * 2;
        } else if (axis.Type === "diagonal") {
            if (axis.Rotation === 0) {
                loc = [-(-pos[1]-axislocations[1])+axislocations[1], -(-pos[0]-axislocations[0])+axislocations[0]]
            } else if (axis.Rotation === 1) {
                loc = [-(pos[1]-axislocations[1])+axislocations[1], -(pos[0]-axislocations[0])+axislocations[0]]
            }  
        } else if (axis.Type === "dot") {
            loc = [-(pos[0]-axislocations[0])+axislocations[0], -(pos[1]-axislocations[1])+axislocations[1]]
        }
        locations.push(loc);
        rotationFlips.push([axis.Rotation, true]);
    }

    return [locations, rotationFlips];
}

function areLocationsSame(pos1, pos2) {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1]
}

function areBoxesOverlapping(box1, box2) {
    const [x1a, y1a] = box1[0];
    const [x1b, y1b] = box1[1];
    const [x2a, y2a] = box2[0];
    const [x2b, y2b] = box2[1];

    const minX1 = Math.min(x1a, x1b);
    const maxX1 = Math.max(x1a, x1b);
    const minY1 = Math.min(y1a, y1b);
    const maxY1 = Math.max(y1a, y1b);

    const minX2 = Math.min(x2a, x2b);
    const maxX2 = Math.max(x2a, x2b);
    const minY2 = Math.min(y2a, y2b);
    const maxY2 = Math.max(y2a, y2b);

    return !(maxX1 <= minX2 ||
             minX1 >= maxX2 ||
             maxY1 <= minY2 || 
             minY1 >= maxY2);
}
