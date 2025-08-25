let width = 20;
let height = 20;

let edges = generateMaze(width, height);
let mazeSvg = getMazeSvg(width, height);
svg.appendChild(mazeSvg);
let avatar = svgCircle(750, 750, 18, "blue");
svg.appendChild(avatar);

for(let i = 0; i < 10; i++) {
    addOpponent();
}
for(let i = 0; i < 8; i++) {
    addPortal();
}
for(let i = 0; i < 8; i++) {
    addGoodLuck();
}
for(let i = 0; i < 8; i++) {
    addBadLuck();
}
initAvatar();

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