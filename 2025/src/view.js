let x = 0;
let y = 0;
let w = 1500;
let h = 1500;
let svg = document.getElementById("svg");

function updateView(dt) {
    if (dirX == 1) {
        x += dt * 0.5;
    }
    if (dirX == -1) {
        x -= dt * 0.5;
    }
    if (dirY == 1) {
        y += dt * 0.5;
    }
    if (dirY == -1) {
        y -= dt * 0.5;
    }
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
}