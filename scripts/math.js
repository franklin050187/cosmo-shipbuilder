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

function scaleVec(vec, r) {
    return [vec[0]*r, vec[1]*r]
}

function pointDist(vec1, vec2) {
	return vecLength([vec1[0] - vec2[0], vec1[1] - vec2[1]]);
}

function crossProduct(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
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


function getCircleRingTiles(center_in, r1, r2) {
    const tiles = [];
    const r1Sq = r1 * r1;
    const r2Sq = r2 * r2;
    const center = [center_in[0], center_in[1]] //Shift center to the center of the center part

    // Iterate over a bounding box around the outer radius
    for (let x = Math.floor(center[0] - r2); x <= Math.ceil(center[0] + r2); x++) {
        for (let y = Math.floor(center[1] - r2); y <= Math.ceil(center[1] + r2); y++) {
            // Calculate the distance from the center of the tile
            const distSq = (x + 0.5 - center[0]) ** 2 + (y + 0.5 - center[1]) ** 2;
            if (distSq >= r1Sq && distSq <= r2Sq) {
                tiles.push([x, y]);
            }
        }
    }

    return tiles;
}

function convexHull(points) {
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    let lower = [];
    for (let p of points) {
        while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
        }
        lower.push(p);
    }

    let upper = [];
    for (let p of points.reverse()) {
        while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
        }
        upper.push(p);
    }

    upper.pop();
    lower.pop();

    return lower.concat(upper);
}

function welzl(points, boundary = []) {
    if (points.length === 0 || boundary.length === 3) {
        if (boundary.length === 0) return { center: [0, 0], radius: 0 };
        if (boundary.length === 1) return { center: boundary[0], radius: 0 };
        if (boundary.length === 2) {
        const center = [(boundary[0][0] + boundary[1][0]) / 2, (boundary[0][1] + boundary[1][1]) / 2];
        const radius = pointDist(boundary[0], center);
        return { center, radius };
        }
        const [p1, p2, p3] = boundary;
        const ax = p1[0], ay = p1[1];
        const bx = p2[0], by = p2[1];
        const cx = p3[0], cy = p3[1];

        const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
        const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
        const radius = pointDist([ux, uy], p1);
        return { center: [ux, uy], radius };
    }

    const point = points.pop();
    const circle = welzl(points, boundary);

    if (pointDist(circle.center, point) <= circle.radius) {
        points.push(point);
        return circle;
    }

    boundary.push(point);
    const result = welzl(points, boundary);
    boundary.pop();
    points.push(point);

    return result;
}

function smallestEnclosingCircle(points) {
    const hull = convexHull(points);
    return welzl(hull);
}

function getArc(angle, cardinal_direction) {
    let toadd = cardinal_direction*Math.PI/2
    return [3 * Math.PI / 2 - angle * Math.PI / 360 + toadd,3 * Math.PI / 2 + angle * Math.PI / 360 + toadd];
}
