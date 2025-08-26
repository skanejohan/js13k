let side = 40;
let cells = {};

function _s2(x, y) {
    return `${x},${y}`;
}

function _s4(x1, y1, x2, y2) {
    return `${x1},${y1},${x2},${y2}`;
}

function generateMaze(width, height) {
    const stack = [];
    const edges = new Set();
    const visited = new Set();

    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    visited.add(_s2(x, y));

    while (true) {

        // Calculate unvisited neighbors
        const neighbors = [];
        if (x > 0 && !visited.has(_s2(x-1, y))) {
            neighbors.push([x - 1, y]);
        }
        if (x < width - 1 && !visited.has(_s2(x+1, y))) {
            neighbors.push([x + 1, y]); 
        }
        if (y > 0 && !visited.has(_s2(x, y-1))) {
            neighbors.push([x, y-1]); 
        }
        if (y < height-1 && !visited.has(_s2(x, y+1))) {
            neighbors.push([x, y+1]); 
        }

        if (neighbors.length > 0) {
            const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
            edges.add(_s4(x, y, nextX, nextY));
            visited.add(_s2(nextX, nextY));
            stack.push([x, y]);
            x = nextX;
            y = nextY;
        } else if (stack.length > 0) {
            [x, y] = stack.pop();
        } else {
            break;
        }
    }

    return edges;
}

function edgeExists(x1, y1, x2, y2) {
    return edges.has(_s4(x1, y1, x2, y2)) || edges.has(_s4(x2, y2, x1, y1));
}
