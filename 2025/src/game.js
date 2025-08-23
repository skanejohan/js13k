let edges = generateMaze(50, 50);
let mazeSvg = getMazeSvg(50, 50, edges);
svg.appendChild(mazeSvg);
let avatar = svgCircle(750, 750, 18, "blue");
svg.appendChild(avatar);
addOpponent(15, 15);
addOpponent(25, 25);
addOpponent(15, 25);
addOpponent(25, 15);
addOpponent(18, 18);
addOpponent(22, 22);
addOpponent(18, 22);
addOpponent(22, 18);
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