//This file is for anything related to the ships part adjacency graph
//This is experimental and currently not working

function getShipPartConnectionGraph(parts) {
    let edges = []
    let vertecies = []
    let part1
    let part2
    for (let i = 0; i < parts.length; i++) {
        part1 = parts[i]
        vertecies.push([i, part1])
        for (let j = 0; j < parts.length; j++) {
            if (i!=j) {
                part2 = parts[j]
                if (arePartsTouching(part1, part2)) {
                    edges.push([i, j, part1, part2])
                }
            } 
        }
    }
    return [edges, vertecies]
}

function getPartsGraphPartition(edges, vertecies) {
    let current_vertecies = []
    while(vertecies.length>0) {
        vertex = vertecies[0]
        for (adjacent_vertex of getAdjacentPartVertecies(vertex, edges, vertecies)) {
            current_vertecies.push(adjacent_vertex)
        }
    }
}

function getAdjacentPartVertecies(vertex, edges, vertecies) {
    let adjacent_parts = []
    let visited_parts = []
    let parts_partition = []
    let n = vertecies.length
    let j = 0
    while (visited_parts.length < n) {
        for (let i=0;i<n;i++) {
            if (!visited_parts.includes[i]) {
                adjacent_parts.push(vertecies[i])
            }
        }
        while(adjacent_parts.length > 0) {
            for (part of adjacent_parts) {
                for (edge of edges) {
                    if (!visited_parts.includes[edge[0]] && edge[0] == vertex[0]) {
                        adjacent_parts.push(edge[1])
                        visited_parts.push(part)
                        parts_partition[j].push(part)
                    }
                }  
            }
        }
        j++
    }
}

function arePartsTouching(part1, part2) {
    let bool = 0
    let locations1 = getSpriteTileLocations(part1)
    let locations2 = getSpriteTileLocations(part2)
    for (location1 in locations1) {
        for (location2 in locations2) {
            if (areCoordinatesAdjacent(location1, location2)) {
                return true
            } 
        }
    }
    return false
}