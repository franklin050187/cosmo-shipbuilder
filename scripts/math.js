//This file is for purely mathematical functions taht are not related to cosmoteer or the website.

function vecLength(vec) {
	return Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
}

function diffVecs(vec1, vec2) {
    return vec1.map((v, i) => v - vec2[i]);
}

function addVecs(vec1, vec2) {
    return vec1.map((v, i) => v + vec2[i]);
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
    let locations = [pos]
    let rotationFlips = [[0, false, false]]
    
    for (let axis of allaxis) {
        let loc = [...pos]
        if (axis.Type === "linear") {
            loc[axis.Rotation] = -(pos[axis.Rotation] - axislocations[axis.Rotation]) + axislocations[axis.Rotation]
            rotationFlips.push([axis.Rotation, true, true])
        } else if (axis.Type === "diagonal") {
            if (axis.Rotation === 0) {
                loc = [-(-pos[1]-axislocations[1])+axislocations[1], -(-pos[0]-axislocations[0])+axislocations[0]]
                rotationFlips.push([axis.Rotation, true, false])
            } else if (axis.Rotation === 1) {
                loc = [-(pos[1]-axislocations[1])+axislocations[1], -(pos[0]-axislocations[0])+axislocations[0]]
                rotationFlips.push([axis.Rotation, true, false])
            }  
        } else if (axis.Type === "dot") {
            loc = [-(pos[0]-axislocations[0])+axislocations[0], -(pos[1]-axislocations[1])+axislocations[1]]
            rotationFlips.push([axis.Rotation, true, true])
        }
        locations.push(loc)
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

function squareWithLength(x) {//Intended to be used for the hitbox creation
    return [[0,0], [x,0], [x,x], [0,x]]
}

function rectWithLengths(x, y) {//Intended to be used for the hitbox creation
    return [[0,0], [x,0], [x,y], [0,y]]
}

function circle(pos, r) {//Intended to be used for the hitbox creation
    const points = [];
    const angleStep = (2 * Math.PI) / 32;

    for (let i = 0; i < 32; i++) {
        const angle = i * angleStep;
        const x = pos[0] + r * Math.cos(angle);
        const y = pos[1] + r * Math.sin(angle);
        points.push([ x, y ]);
    }

    return points;
}

function translatedPoly(poly, pos1) {
    let newpoly = poly.map(pos2 => [pos2[0] + pos1[0], pos2[1] + pos1[1]]);
    return newpoly;
}

function rotatePoly(poly, angle, center = [0, 0]) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const [cx, cy] = center;

    return poly.map(([x, y]) => {
        // Translate point to origin based on the center
        const dx = x - cx;
        const dy = y - cy;

        // Rotate around the origin
        const rotatedX = dx * cosA - dy * sinA;
        const rotatedY = dx * sinA + dy * cosA;

        // Translate back to the original center
        return [rotatedX + cx, rotatedY + cy];
    });
}
