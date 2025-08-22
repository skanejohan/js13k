let x = 0;
let y = 0;
let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");
let zoom = 0;
let zoomTarget = 500;
let opponents = [];
let visibleCellsSvg = [];

let avatarCell = { x : 20, y : 20 };
let targetDir = undefined;

let avatarPos = () => { return { x : avatarCell.x, y : 3 } };

function addOpponent(x, y) {
    let displayX = side * (x + 0.5);
    let displayY = side * (y + 0.5);
    let opponent = svgCircle(displayX, displayY, 18, "red");
    svg.appendChild(opponent);
    opponents.push({ x: displayX, y: displayY, element: opponent, cell: { x : x, y : y }, dir: undefined });
}

function visibleFrom(x, y) {
    let cells = new Set();

    var i = 0;
    while(edgeExists(x + i, y, x + i + 1, y)) {
        cells.add({ x : x + i + 1, y : y });
        i++;
    } 

    i = 0;
    while(edgeExists(x - i, y, x - i - 1, y)) {
        cells.add({ x : x - i - 1, y : y });
        i++;
    } 

    i = 0;
    while(edgeExists(x, y + i, x, y + i + 1)) {
        cells.add({ x : x, y : y + i + 1 });
        i++;
    } 

    i = 0;
    while(edgeExists(x, y - i, x, y - i - 1)) {
        cells.add({ x : x, y : y - i - 1 });
        i++;
    } 

    return cells;
}

function updateVisibleCells() {
    for(let i = 0; i < visibleCellsSvg.length; i++) {
        svg.removeChild(visibleCellsSvg[i]);
    }
    visibleCellsSvg = [];

    let visibleCells = visibleFrom(avatarCell.x, avatarCell.y);
    for (let cell of visibleCells) {
        let svgCell = svgRect(cell.x * side, cell.y * side, side, side, "rgba(255, 255, 255, 0.15)");
        visibleCellsSvg.push(svgCell);
        svg.appendChild(svgCell);
    }
}

function updateView(dt) {

    if (!targetDir) {
        if (right && edgeExists(avatarCell.x, avatarCell.y, avatarCell.x + 1, avatarCell.y)) {
            targetDir = { x : 1, y : 0 };
        }
        else if (down && edgeExists(avatarCell.x, avatarCell.y, avatarCell.x, avatarCell.y + 1)) {
            targetDir = { x : 0, y : 1 };
        }
        else if (left && edgeExists(avatarCell.x, avatarCell.y, avatarCell.x - 1, avatarCell.y)) {
            targetDir = { x : -1, y : 0 };
        }
        else if (up && edgeExists(avatarCell.x, avatarCell.y, avatarCell.x, avatarCell.y - 1)) {
            targetDir = { x : 0, y : -1 };
        }
    }

    if (targetDir) {
        if (targetDir.x == 1) {
            x += dt * 0.5;
            if (x >= side * (avatarCell.x + 1.5)) {
                x = side * (avatarCell.x + 1.5);
                avatarCell = { x : avatarCell.x + 1, y : avatarCell.y };
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == 1) {
            y += dt * 0.5;
            if (y >= side * (avatarCell.y + 1.5)) {
                y = side * (avatarCell.y + 1.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y + 1 };
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.x == -1) {
            x -= dt * 0.5;
            if (x <= side * (avatarCell.x - 0.5)) {
                x = side * (avatarCell.x - 0.5);
                avatarCell = { x : avatarCell.x - 1, y : avatarCell.y };
                updateVisibleCells();
                targetDir = undefined;
            }
        }
        else if (targetDir.y == -1) {
            y -= dt * 0.5;
            if (y <= side * (avatarCell.y - 0.5)) {
                y = side * (avatarCell.y - 0.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y - 1 };
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
            let rnd = Math.floor(Math.random() * 4);
            if (rnd == 0 && edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x + 1, opponent.cell.y)) {
                opponent.dir = { x : 1, y : 0 };
            }
            else if (rnd == 1 && edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x, opponent.cell.y + 1)) {
                opponent.dir = { x : 0, y : 1 };
            }
            else if (rnd == 2 && edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x - 1, opponent.cell.y)) {
                opponent.dir = { x : -1, y : 0 };
            }
            else if (rnd == 3 && edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x, opponent.cell.y - 1)) {
                opponent.dir = { x : 0, y : -1 };
            }
        }

        if (opponent.dir) {
            if (opponent.dir.x == 1) {
                opponent.x += dt * 0.5;
                if (opponent.x >= side * (opponent.cell.x + 1.5)) {
                    opponent.x = side * (opponent.cell.x + 1.5);
                    opponent.cell = { x : opponent.cell.x + 1, y : opponent.cell.y };
                    if (!edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x + 1, opponent.cell.y)) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == 1) {
                opponent.y += dt * 0.5;
                if (opponent.y >= side * (opponent.cell.y + 1.5)) {
                    opponent.y = side * (opponent.cell.y + 1.5);
                    opponent.cell = { x : opponent.cell.x, y : opponent.cell.y + 1 };
                    if (!edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x, opponent.cell.y + 1)) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.x == -1) {
                opponent.x -= dt * 0.5;
                if (opponent.x <= side * (opponent.cell.x - 0.5)) {
                    opponent.x = side * (opponent.cell.x - 0.5);
                    opponent.cell = { x : opponent.cell.x - 1, y : opponent.cell.y };
                    if (!edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x - 1, opponent.cell.y)) {
                        opponent.dir = undefined;
                    }
                }
            }
            else if (opponent.dir.y == -1) {
                opponent.y -= dt * 0.5;
                if (opponent.y <= side * (opponent.cell.y - 0.5)) {
                    opponent.y = side * (opponent.cell.y - 0.5);
                    opponent.cell = { x : opponent.cell.x, y : opponent.cell.y - 1 };
                    if (!edgeExists(opponent.cell.x, opponent.cell.y, opponent.cell.x, opponent.cell.y - 1)) {
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
        zoomTarget = 0;
    }
    if (zoom < zoomTarget) {
        zoom += dt * 0.1;
        zoomTarget = 500;
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