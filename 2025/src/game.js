let width = 20;
let height = 20;
let side = 40;

let level = undefined;

level = generateLevel(width, height, 10);
svg.appendChild(level.g);

for(let i = 0; i < 8; i++) {
    addPortal();
}
for(let i = 0; i < 8; i++) {
    addGoodLuck();
}
for(let i = 0; i < 8; i++) {
    addBadLuck();
}

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