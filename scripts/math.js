//This file is for purely mathematical functions taht are not related to cosmoteer or the website.

function vecLength(vec) {
    return Math.sqrt(vec[0]**2+vec[1]**2)
}

function pointDist(vec1, vec2) {
    return vecLength([vec1[0]-vec2[0], vec1[1]-vec2[1]]) 
}

function InverseLerp(interval, delimiter) {
    if (interval[0]>delimiter) {
        return 0
    }
    if (interval[1]<delimiter) {
        return 1
    }
    return (delimiter - interval[0])/(interval[1]-interval[0])
}

function areCoordinatesAdjacent(pos1, pos2) {
    let x_dif = Math.abs(pos1[0]-pos2[0])
    let y_dif = Math.abs(pos1[1]-pos2[1])
    if ((x_dif==1 && y_dif==0) || (x_dif==0 && y_dif==1)) {
        return true
    }
    return false
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