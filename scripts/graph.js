//This file is for anything related to the ships part adjacency graph
//This is experimental and currently not working
//Graphs are a pair of directed eges and vertices. All edges/vertices contain the ids as well as the part objects. 
//Example: We have 3 parts where 1 is connected to 2 and 2 to 3:
//graph = [[[partid1, partid2, part1, part2], [partid2, partid1, part1, part2], [partid2, partid3, part2, part3], [partid3, paridt 2, part3, part2]], [[partid1, part1], [partid2, part2], [partdi3, part3]]]

function getShipPartConnectionGraph(parts) {
	const edges = [];
	const vertices = [];
	let part1;
	let part2;
	for (let i = 0; i < parts.length; i++) {
		part1 = parts[i];
		vertices.push([i, part1]);
		for (let j = 0; j < parts.length; j++) {
			if (i !== j) {
				part2 = parts[j];
				if (arePartsTouching(part1, part2)) {
					edges.push([i, j, part1, part2]);
				}
			}
		}
	}
	return [edges, vertices];
}

function getConnectedComponents(edges, vertices) {
	const visited = new Set(); // To track visited vertex ids
	const components = [];

	// Helper function to perform DFS
	function dfs(vertexId, component) {
		visited.add(vertexId);

		// Find the vertex with this id and add it to the component
		const vertex = vertices.find((v) => v[0] === vertexId);
		if (vertex) {
			component.push(vertex);
		}

		// Explore all edges to find connected vertices
		for (const edge of edges) {
			const [id1, id2] = edge;

			// Check for adjacency and explore unvisited neighbors
			if (id1 === vertexId && !visited.has(id2)) {
				dfs(id2, component);
			} else if (id2 === vertexId && !visited.has(id1)) {
				dfs(id1, component);
			}
		}
	}

	// Loop through all vertices to start DFS from unvisited nodes
	for (const [vertexId, object] of vertices) {
		if (!visited.has(vertexId)) {
			const component = [];
			dfs(vertexId, component);
			components.push(component);
		}
	}

	return components;
}

function arePartsTouching(part1, part2) {
	const locations1 = getSpriteTileLocations(part1);
	const locations2 = getSpriteTileLocations(part2);
	for (let location1 of locations1) {
		for (let location2 of locations2) {
			if (areCoordinatesAdjacent(location1, location2)) {
				return true;
			}
		}
	}
	return false;
}

function getTouchingParts(part, graph) {
	list = []
	for (edge of graph[1]) {
		if (isSameSprite(edge[3], part)) {
			list.push(edge[4])
		}
	}
	return list
}
