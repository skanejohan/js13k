let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");
let zoom = 0;
let zoomTarget = 0;
let visibleCells = [];
let visibleCellsSvg = [];

let targetDir = undefined;

function nextLevel() {
    if (level && level.g) {
        svg.removeChild(level.g);
    }
    level = generateLevel(width, height, 10, 8, 8, 8);
    svg.appendChild(level.g);
}

function c(x, y) {
    return `x${x}y${y}`;
}

function visibleFrom(x, y) {
    let cells = new Set();

    var i = 0;
    while(!level[c(x + i, y)].r) {
        cells.add({ x : x + i + 1, y : y });
        i++;
    } 

    i = 0;
    while(!level[c(x - i, y)].l) {
        cells.add({ x : x - i - 1, y : y });
        i++;
    } 

    i = 0;
    while(!level[c(x, y + i)].b) {
        cells.add({ x : x, y : y + i + 1 });
        i++;
    } 

    i = 0;
    while(!level[c(x, y - i)].t) {
        cells.add({ x : x, y : y - i - 1 });
        i++;
    } 

    return cells;
}

function noOfVisibleOpponents() {
    let count = 0;
    for (let opponent of level.cats) {
        for (let cell of visibleCells) {
            if (opponent.cellX == cell.x && opponent.cellY == cell.y) {
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

    visibleCells = visibleFrom(level.avatar.cellX, level.avatar.cellY);
    for (let cell of visibleCells) {
        let svgCell = svgRect(cell.x * side, cell.y * side, side, side, "rgba(255, 255, 255, 0.15)");
        visibleCellsSvg.push(svgCell);
        svg.appendChild(svgCell);
    }
}

function consumeObject(list, set) {
    let obj = list.find(o => o.cellX == level.avatar.cellX && o.cellY == level.avatar.cellY);
    if (obj) {
        set(list.filter(o => o != obj));
        level.g.removeChild(obj.element);
    }
    return obj;
}
function checkCollision() {
    if (consumeObject(level.portals, l => level.portals = l)) {
        level.avatar.cellX = Math.floor(Math.random() * width);
        level.avatar.cellY = Math.floor(Math.random() * height);
        left = false;
        right = false;
        up = false;
        down = false;
    }

    if (consumeObject(level.goodLucks, l => level.goodLucks = l)) {
        for (let i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * (width - 2)) + 1;
            var y = Math.floor(Math.random() * (height - 2)) + 1;
            let cell = level[c(x, y)];
            if (cell.r) {
                level.g.removeChild(cell.r);
                cell.r = undefined;
                let cell2 = level[c(x + 1, y)];
                level.g.removeChild(cell2.l);
                cell2.l = undefined;
            }
            if (cell.b) {
                level.g.removeChild(cell.b);
                cell.b = undefined;
                let cell2 = level[c(x, y + 1)];
                level.g.removeChild(cell2.t);
                cell2.t = undefined;
            }
            if (cell.l) {
                level.g.removeChild(cell.l);
                cell.l = undefined;
                let cell2 = level[c(x - 1, y)];
                level.g.removeChild(cell2.r);
                cell2.r = undefined;
            }
            if (cell.t) {
                level.g.removeChild(cell.t);
                cell.t = undefined;
                let cell2 = level[c(x, y - 1)];
                level.g.removeChild(cell2.b);
                cell2.b = undefined;
            }
        }
    }

    if (consumeObject(level.badLucks, l => level.badLucks = l)) {
        for (let i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * (width - 2)) + 1;
            var y = Math.floor(Math.random() * (height - 2)) + 1;
            let cell = level[c(x, y)];
            if (!cell.r) {
                cell.r = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell.r);
                let cell2 = level[c(x + 1, y)];
                cell2.l = svgLine((x + 1) * side, y * side, (x + 1) * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell2.l);
            }
            else if (!cell.b) {
                cell.b = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell.b);
                let cell2 = level[c(x, y + 1)];
                cell2.t = svgLine(x * side, (y + 1) * side, (x + 1) * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell2.t);
            }
            else if (!cell.l) {
                cell.l = svgLine(x * side, y * side, x * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell.l);
                let cell2 = level[c(x - 1, y)];
                cell2.r = svgLine(x * side, y * side, x * side, (y + 1) * side, "yellow");
                level.g.appendChild(cell2.r);
            }
            else if (!cell.t) {
                cell.t = svgLine(x * side, y * side, (x + 1) * side, y * side, "yellow");
                level.g.appendChild(cell.t);
                let cell2 = level[c(x, y - 1)];
                cell2.b = svgLine(x * side, y * side, (x + 1) * side, y * side, "yellow");
                level.g.appendChild(cell2.b);
            }
        }
    }

    if (level.horseshoe.cellX == level.avatar.cellX && level.horseshoe.cellY == level.avatar.cellY) {
        nextLevel();
    }
}

function updateView(dt) {

    if (!targetDir) {
        let cell = level[c(level.avatar.cellX, level.avatar.cellY)];
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
            if (x >= side * (level.avatar.cellX + 1.5)) {
                x = side * (level.avatar.cellX + 1.5);
                level.avatar.cellX++;
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == 1) {
            y += dt * 0.5;
            if (y >= side * (level.avatar.cellY + 1.5)) {
                y = side * (level.avatar.cellY + 1.5);
                level.avatar.cellY++;
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.x == -1) {
            x -= dt * 0.5;
            if (x <= side * (level.avatar.cellX - 0.5)) {
                x = side * (level.avatar.cellX - 0.5);
                level.avatar.cellX--;
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == -1) {
            y -= dt * 0.5;
            if (y <= side * (level.avatar.cellY - 0.5)) {
                y = side * (level.avatar.cellY - 0.5);
                level.avatar.cellY--;
                checkCollision();
                updateVisibleCells();
                targetDir = undefined;
            }
        }
    }
    else {
        x = side * (level.avatar.cellX + 0.5);
        y = side * (level.avatar.cellY + 0.5);
    }

    for (let i = 0; i < level.cats.length; i++) {
        let opponent = level.cats[i];
        if (!opponent.dir) {
            let cell = level[c(opponent.cellX, opponent.cellY)];
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
                opponent.displayX += dt * 0.5;
                if (opponent.displayX >= side * (opponent.cellX + 1.5)) {
                    opponent.displayX = side * (opponent.cellX + 1.5);
                    opponent.cellX++;
                    if (level[c(opponent.cellX, opponent.cellY)].r) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == 1) {
                opponent.displayY += dt * 0.5;
                if (opponent.displayY >= side * (opponent.cellY + 1.5)) {
                    opponent.displayY = side * (opponent.cellY + 1.5);
                    opponent.cellY++;
                    if (level[c(opponent.cellX, opponent.cellY)].b) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.x == -1) {
                opponent.displayX -= dt * 0.5;
                if (opponent.displayX <= side * (opponent.cellX - 0.5)) {
                    opponent.displayX = side * (opponent.cellX - 0.5);
                    opponent.cellX--;
                    if (level[c(opponent.cellX, opponent.cellY)].l) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == -1) {
                opponent.displayY -= dt * 0.5;
                if (opponent.displayY <= side * (opponent.cellY - 0.5)) {
                    opponent.displayY = side * (opponent.cellY - 0.5);
                    opponent.cellY--;
                    if (level[c(opponent.cellX, opponent.cellY)].t) {
                        opponent.dir = undefined;
                    }
                }
            }
        }
        else {
            opponent.displayX = side * (opponent.cellX + 0.5);
            opponent.displayY = side * (opponent.cellY + 0.5);
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

    level.avatar.element.setAttribute("cx", x);
    level.avatar.element.setAttribute("cy", y);
    for (let i = 0; i < level.cats.length; i++) {
        let opponent = level.cats[i];
        opponent.element.setAttribute("cx", opponent.displayX);
        opponent.element.setAttribute("cy", opponent.displayY);
    }
    svg.setAttribute("viewBox", `${x+zoom-750} ${y+zoom-750} ${w-zoom-zoom} ${h-zoom-zoom}`);
}