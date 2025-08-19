let side = 40;

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

function getMazeSvg(width, height, edges) {

    let rect = (x, y, side) => {
        let r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", x * side);
        r.setAttribute("y", y * side);
        r.setAttribute("width", side);
        r.setAttribute("height", side);
        r.setAttribute("fill", "red");
        return r;
    }

    let line = (x, y, side, hor) => {
        let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", x * side);
        l.setAttribute("y1", y * side);
        l.setAttribute("x2", hor ? (x + 1) * side : x * side);
        l.setAttribute("y2", hor ? y * side : (y + 1) * side);
        l.setAttribute("stroke", "black");
        return l;
    }

    let has = (x1, y1, x2, y2) => {
        return edges.has(_s4(x1, y1, x2, y2)) || edges.has(_s4(x2, y2, x1, y1));
    }

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            g.appendChild(rect(x, y, side));
            if (!has(x, y, x - 1, y)) {
                g.appendChild(line(x, y, side, false));
            }
            if (!has(x, y, x + 1, y)) {
                g.appendChild(line(x + 1, y, side, false));
            }
            if (!has(x, y, x, y - 1)) {
                g.appendChild(line(x, y, side, true));
            }
            if (!has(x, y, x, y + 1)) {
                g.appendChild(line(x, y + 1, side, true));
            }
        }
    }

    return g;
}