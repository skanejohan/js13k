let x = 0;
let y = 0;
let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");
let zoom = 0;
let zoomTarget = 500;

let avatarCell = { x : 20, y : 20 };
let targetDir = undefined;

let avatarPos = () => { return { x : avatarCell.x, y : 3 } };

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
                targetDir = undefined;
            }
        }
        else if (targetDir.y == 1) {
            y += dt * 0.5;
            if (y >= side * (avatarCell.y + 1.5)) {
                y = side * (avatarCell.y + 1.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y + 1 };
                targetDir = undefined;
            }
        }
        else if (targetDir.x == -1) {
            x -= dt * 0.5;
            if (x <= side * (avatarCell.x - 0.5)) {
                x = side * (avatarCell.x - 0.5);
                avatarCell = { x : avatarCell.x - 1, y : avatarCell.y };
                targetDir = undefined;
            }
        }
        else if (targetDir.y == -1) {
            y -= dt * 0.5;
            if (y <= side * (avatarCell.y - 0.5)) {
                y = side * (avatarCell.y - 0.5);
                avatarCell = { x : avatarCell.x, y : avatarCell.y - 1 };
                targetDir = undefined;
            }
        }
    }
    else {
        x = side * (avatarCell.x + 0.5);
        y = side * (avatarCell.y + 0.5);
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
    svg.setAttribute("viewBox", `${x+zoom-750} ${y+zoom-750} ${w-zoom-zoom} ${h-zoom-zoom}`);
}