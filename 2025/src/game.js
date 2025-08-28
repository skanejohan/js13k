let width = 20;
let height = 20;
let side = 40;

let level = undefined;

level = generateLevel(width, height, 10, 8, 8, 8);
svg.appendChild(level.g);

updateVisibleCells();

var lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    updateView(dt);
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();