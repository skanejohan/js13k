let edges = generateMaze(50, 50);
let mazeSvg = getMazeSvg(50, 50, edges);
svg.appendChild(mazeSvg);
let avatar = svgCircle(750, 750, 18, "blue");
svg.appendChild(avatar);

var lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    updateView(dt);
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();