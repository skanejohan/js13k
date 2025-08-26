let x = 0;
let y = 0;
let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");
let zoom = 0;
let zoomTarget = 0;
let portals = [];
let badLucks = [];
let goodLucks = [];
let opponents = [];
let visibleCells = [];
let visibleCellsSvg = [];

let avatarCell = { x : 0, y : 0 };
let targetDir = undefined;

let maze = {};

function c(x, y) {
    return `x${x}y${y}`;
}

function generateCell(x, y, g) {
    let cell = { x: x, y : y };
    if (!edgeExists(x, y, x + 1, y)) { // Add right edge
        cell.r = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, "yellow");
        g.appendChild(cell.r);
    }
    if (!edgeExists(x, y, x, y + 1)) { // Add bottom edge
        cell.b = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, "yellow");
        g.appendChild(cell.b);
    }
    if (!edgeExists(x, y, x - 1, y)) { // Add left edge
        cell.l = svgLine(x * side, y * side, x * side, (y + 1) * side, "yellow");
        g.appendChild(cell.l);
    }
    if (!edgeExists(x, y, x, y - 1)) { // Add top edge
        cell.t = svgLine(x * side, y * side, (x + 1) * side, y * side, "yellow");
        g.appendChild(cell.t);
    }
    return cell;
}

function generateLevel(width, height) {
    maze = { g : document.createElementNS("http://www.w3.org/2000/svg", "g") };
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cell = generateCell(x, y, maze.g);
            maze[c(x, y)] = cell;
        }
    }
}

function initAvatar() {
    avatarCell.x = Math.floor(Math.random() * width);
    avatarCell.y = Math.floor(Math.random() * height);
}

function addBadLuck() {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    let displayX = side * (x + 0.5);
    let displayY = side * (y + 0.5);    
    let badLuck = svgCircle(displayX, displayY, 18, "red");
    svg.appendChild(badLuck);
    badLucks.push( {x : x, y : y, element: badLuck });
}

function addGoodLuck() {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    let displayX = side * (x + 0.5);
    let displayY = side * (y + 0.5);    
    let goodLuck = svgCircle(displayX, displayY, 18, "white");
    svg.appendChild(goodLuck);
    goodLucks.push( {x : x, y : y, element: goodLuck });
}

function addOpponent() {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    let displayX = side * (x + 0.5);
    let displayY = side * (y + 0.5);
    let opponent = svgCircle(displayX, displayY, 18, "black");
    svg.appendChild(opponent);
    opponents.push({ x: displayX, y: displayY, element: opponent, cell: { x : x, y : y }, dir: undefined });
}

function addPortal() {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    let displayX = side * (x + 0.5);
    let displayY = side * (y + 0.5);    
    let portal = svgCircle(displayX, displayY, 18, "yellow");
    svg.appendChild(portal);
    portals.push( {x : x, y : y });
}

function visibleFrom(x, y) {
    let cells = new Set();

    var i = 0;
    while(!maze[c(x + i, y)].r) {
        cells.add({ x : x + i + 1, y : y });
        i++;
    } 

    i = 0;
    while(!maze[c(x - i, y)].l) {
        cells.add({ x : x - i - 1, y : y });
        i++;
    } 

    i = 0;
    while(!maze[c(x, y + i)].b) {
        cells.add({ x : x, y : y + i + 1 });
        i++;
    } 

    i = 0;
    while(!maze[c(x, y - i)].t) {
        cells.add({ x : x, y : y - i - 1 });
        i++;
    } 

    return cells;
}

function noOfVisibleOpponents() {
    let count = 0;
    for (let opponent of opponents) {
        for (let cell of visibleCells) {
            if (opponent.cell.x == cell.x && opponent.cell.y == cell.y) {
                count++;
            }
        }
    }
    return count;
}

function updateVisibleCells() {
    for(let i = 0; i < visibleCellsSvg.length; i++) {
        svg.removeChild(visibleCellsSvg[i]);
    }
    visibleCellsSvg = [];

    visibleCells = visibleFrom(avatarCell.x, avatarCell.y);
    for (let cell of visibleCells) {
        let svgCell = svgRect(cell.x * side, cell.y * side, side, side, "rgba(255, 255, 255, 0.15)");
        visibleCellsSvg.push(svgCell);
        svg.appendChild(svgCell);
    }
}

function checkCollision() {
    if (portals.find(p => p.x == avatarCell.x && p.y == avatarCell.y)) {
        avatarCell = { x : Math.floor(Math.random() * width), y : Math.floor(Math.random() * height) };
    }
    let goodLuck = goodLucks.find(p => p.x == avatarCell.x && p.y == avatarCell.y);
    if (goodLuck) {
        svg.removeChild(goodLuck.element);
        goodLucks = goodLucks.filter(p => p != goodLuck);
        for (let i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * (width - 2)) + 1;
            var y = Math.floor(Math.random() * (height - 2)) + 1;
            let cell = maze[c(x, y)];
            console.log(c(x, y));
            if (cell.r) {
                maze.g.removeChild(cell.r);
                cell.r = undefined;
                let cell2 = maze[c(x + 1, y)];
                maze.g.removeChild(cell2.l);
                cell2.l = undefined;
            }
            if (cell.b) {
                maze.g.removeChild(cell.b);
                cell.b = undefined;
                let cell2 = maze[c(x, y + 1)];
                maze.g.removeChild(cell2.t);
                cell2.t = undefined;
            }
            if (cell.l) {
                maze.g.removeChild(cell.l);
                cell.l = undefined;
                let cell2 = maze[c(x - 1, y)];
                maze.g.removeChild(cell2.r);
                cell2.r = undefined;
            }
            if (cell.t) {
                maze.g.removeChild(cell.t);
                cell.t = undefined;
                let cell2 = maze[c(x, y - 1)];
                maze.g.removeChild(cell2.b);
                cell2.b = undefined;
            }
        }
    }
    let badLuck = badLucks.find(p => p.x == avatarCell.x && p.y == avatarCell.y);
    if (badLuck) {
        svg.removeChild(badLuck.element);
        badLucks = badLucks.filter(p => p != badLuck);
    }
}

function updateView(dt) {

    if (!targetDir) {
        let cell = maze[c(avatarCell.x, avatarCell.y)];
        if (right && !cell.r) {
            targetDir = { x : 1, y : 0 };
        }
        else if (down && !cell.b) {
            targetDir = { x : 0, y : 1 };
        }
        else if (left && !cell.l) {
            targetDir = { x : -1, y : 0 };
        }
        else if (up && !cell.t) {
            targetDir = { x : 0, y : -1 };
        }
    }

    if (targetDir) {
        if (targetDir.x == 1) {
            x += dt * 0.5;
            if (x >= side * (avatarCell.x + 1.5)) {
                x = side * (avatarCell.x + 1.5);
                avatarCell = { x : avatarCell.x + 1, y : avatarCell.y };
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == 1) {
            y += dt * 0.5;
            if (y >= side * (avatarCell.y + 1.5)) {
                y = side * (avatarCell.y + 1.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y + 1 };
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.x == -1) {
            x -= dt * 0.5;
            if (x <= side * (avatarCell.x - 0.5)) {
                x = side * (avatarCell.x - 0.5);
                avatarCell = { x : avatarCell.x - 1, y : avatarCell.y };
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == -1) {
            y -= dt * 0.5;
            if (y <= side * (avatarCell.y - 0.5)) {
                y = side * (avatarCell.y - 0.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y - 1 };
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
    }
    else {
        x = side * (avatarCell.x + 0.5);
        y = side * (avatarCell.y + 0.5);
    }

    for (let i = 0; i < opponents.length; i++) {
        let opponent = opponents[i];
        if (!opponent.dir) {
            let cell = maze[c(opponent.cell.x, opponent.cell.y)];
            let rnd = Math.floor(Math.random() * 4);
            if (rnd == 0 && !cell.r) {
                opponent.dir = { x : 1, y : 0 };
            }
            else if (rnd == 1 && !cell.b) {
                opponent.dir = { x : 0, y : 1 };
            }
            else if (rnd == 2 && !cell.l) {
                opponent.dir = { x : -1, y : 0 };
            }
            else if (rnd == 3 && !cell.t) {
                opponent.dir = { x : 0, y : -1 };
            }
        }

        if (opponent.dir) {
            if (opponent.dir.x == 1) {
                opponent.x += dt * 0.5;
                if (opponent.x >= side * (opponent.cell.x + 1.5)) {
                    opponent.x = side * (opponent.cell.x + 1.5);
                    opponent.cell = { x : opponent.cell.x + 1, y : opponent.cell.y };
                    if (maze[c(opponent.cell.x, opponent.cell.y)].r) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == 1) {
                opponent.y += dt * 0.5;
                if (opponent.y >= side * (opponent.cell.y + 1.5)) {
                    opponent.y = side * (opponent.cell.y + 1.5);
                    opponent.cell = { x : opponent.cell.x, y : opponent.cell.y + 1 };
                    if (maze[c(opponent.cell.x, opponent.cell.y)].b) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.x == -1) {
                opponent.x -= dt * 0.5;
                if (opponent.x <= side * (opponent.cell.x - 0.5)) {
                    opponent.x = side * (opponent.cell.x - 0.5);
                    opponent.cell = { x : opponent.cell.x - 1, y : opponent.cell.y };
                    if (maze[c(opponent.cell.x, opponent.cell.y)].l) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == -1) {
                opponent.y -= dt * 0.5;
                if (opponent.y <= side * (opponent.cell.y - 0.5)) {
                    opponent.y = side * (opponent.cell.y - 0.5);
                    opponent.cell = { x : opponent.cell.x, y : opponent.cell.y - 1 };
                    if (maze[c(opponent.cell.x, opponent.cell.y)].t) {
                        opponent.dir = undefined;
                    }
                }
            }
        }
        else {
            opponent.x = side * (opponent.cell.x + 0.5);
            opponent.y = side * (opponent.cell.y + 0.5);
        }
    }

    if (zoom > zoomTarget) {
        zoom -= dt * 0.1;
    }
    if (zoom < zoomTarget) {
        zoom += dt * 0.1;
    }

    let visible = noOfVisibleOpponents();
    if (visible == 0) {
        zoomTarget -= 5;
    }
    else {
        zoomTarget += visible * 20;
    }

    if (zoomTarget < 0) {
        zoomTarget = 0;
    }
    if (zoomTarget > 700) {
        zoomTarget = 700;
    }

    avatar.setAttribute("cx", x);
    avatar.setAttribute("cy", y);
    for (let i = 0; i < opponents.length; i++) {
        let opponent = opponents[i];
        opponent.element.setAttribute("cx", opponent.x);
        opponent.element.setAttribute("cy", opponent.y);
    }
    svg.setAttribute("viewBox", `${x+zoom-750} ${y+zoom-750} ${w-zoom-zoom} ${h-zoom-zoom}`);
}