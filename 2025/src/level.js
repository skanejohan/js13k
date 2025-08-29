function noOfLevel() {
    return _levels.length;
}

function generateLevel(levelIndex) {
    let lvl = _levels[levelIndex];

    level = { 
        g : svgGroup(), 
        index: levelIndex,
        width: lvl.width, 
        height: lvl.height,
        portals: [],
        badLucks: [],
        goodLucks: [],
        cats: [] 
    };

    let openings = _generateMaze();
    for (let y = 0; y < lvl.height; y++) {
        for (let x = 0; x < lvl.width; x++) {
            level[c(x, y)] = _generateCell(x, y, level.g, openings);
        }
    }

    _occupiedCells = [];
    level.avatar = _addObject(svgAvatar,  lvl.width, lvl.height);
    for(let i = 0; i < lvl.cats; i++) {
        level.cats.push(_addObject(svgCat, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.portals; i++) {
        level.portals.push(_addObject(svgPortal, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.badLucks; i++) {
        level.badLucks.push(_addObject(svgBadLuck, lvl.width, lvl.height));
    }
    for(let i = 0; i < lvl.goodLucks; i++) {
        level.goodLucks.push(_addObject(svgGoodLuck, lvl.width, lvl.height));
    }
    level.horseshoe = _addObject(svgHorseshoe, lvl.width, lvl.height);
    return level;
}

function catAt(x, y) {
    return _objectAt(x, y, level.cats);
}

function portalAt(x, y) {
    return _objectAt(x, y, level.portals);
}

function goodLuckAt(x, y) {
    return _objectAt(x, y, level.goodLucks);
}

function badLuckAt(x, y) {
    return _objectAt(x, y, level.badLucks);
}

function consumeObjectAt(x, y, list, set) {
    let obj = _objectAt(x, y, list);
    if (obj) {
        set(list.filter(o => o != obj));
        level.g.removeChild(obj.element);
    }
    return obj;
}

function getFreeCell() {
    let cellX;
    let cellY;
    freeCellFound = false;
    while (!freeCellFound) {
        cellX = Math.floor(Math.random() * level.width);
        cellY = Math.floor(Math.random() * level.height);
        if (!_occupiedCells.find(c => c.x == cellX && c.y == cellY)) {
            return ({ x: cellX, y: cellY })
        }
    }
}

function _objectAt(x, y, list) {
    return list.find(o => o.cellX == x && o.cellY == y);
}

let _levels = [
    { width : 10, height: 10, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 12, height: 12, cats: 5, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 14, height: 14, cats: 7, portals: 8, badLucks: 8, goodLucks: 8},
    { width : 16, height: 8, cats: 8, portals: 8, badLucks: 8, goodLucks: 10},
    { width : 8, height: 20, cats: 12, portals: 10, badLucks: 10, goodLucks: 10},
    { width : 15, height: 15, cats: 12, portals: 10, badLucks: 10, goodLucks: 10},
    { width : 15, height: 15, cats: 15, portals: 10, badLucks: 10, goodLucks: 10},
];

function _generateCell(x, y, g, openings) {
    let cell = { x: x, y : y };
    if (!_openingExists(x, y, x + 1, y, openings)) { // Add right edge
        cell.r = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, "yellow");
        g.appendChild(cell.r);
    }
    if (!_openingExists(x, y, x, y + 1, openings)) { // Add bottom edge
        cell.b = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, "yellow");
        g.appendChild(cell.b);
    }
    if (!_openingExists(x, y, x - 1, y, openings)) { // Add left edge
        cell.l = svgLine(x * side, y * side, x * side, (y + 1) * side, "yellow");
        g.appendChild(cell.l);
    }
    if (!_openingExists(x, y, x, y - 1, openings)) { // Add top edge
        cell.t = svgLine(x * side, y * side, (x + 1) * side, y * side, "yellow");
        g.appendChild(cell.t);
    }
    return cell;
}

function _generateMaze() {
    const stack = [];
    const openings = new Set();
    const visited = new Set();

    let x = Math.floor(Math.random() * level.width);
    let y = Math.floor(Math.random() * level.height);
    visited.add(_s2(x, y));

    while (true) {
        const neighbors = [];
        if (x > 0 && !visited.has(_s2(x-1, y))) {
            neighbors.push([x - 1, y]);
        }
        if (x < level.width - 1 && !visited.has(_s2(x+1, y))) {
            neighbors.push([x + 1, y]); 
        }
        if (y > 0 && !visited.has(_s2(x, y-1))) {
            neighbors.push([x, y-1]); 
        }
        if (y < level.height-1 && !visited.has(_s2(x, y+1))) {
            neighbors.push([x, y+1]); 
        }
        if (neighbors.length > 0) {
            const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
            openings.add(_s4(x, y, nextX, nextY));
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
    return openings;
}

function _openingExists(x1, y1, x2, y2, openings) {
    return openings.has(_s4(x1, y1, x2, y2)) || openings.has(_s4(x2, y2, x1, y1));
}

function _addObject(svgFunction, width, height) {
    let cell = getFreeCell();
    _occupiedCells.push({ x: cell.x, y: cell.y });
    let displayX = side * (cell.x + 0.5);
    let displayY = side * (cell.y + 0.5);
    let element = svgFunction(displayX, displayY);
    level.g.appendChild(element);
    return { 
        cellX: cell.x, 
        cellY: cell.y,
        displayX: displayX, 
        displayY: displayY, 
        element: element
    };
}

function _s2(x, y) {
    return `${x},${y}`;
}

function _s4(x1, y1, x2, y2) {
    return `${x1},${y1},${x2},${y2}`;
}

let _occupiedCells = [];