let leftEdge = 200;
let rightEdge = 1720;
let sceneX = 0;

let circle = document.getElementById("circle");
let layer1 = document.getElementById("layer1");
let layer2 = document.getElementById("layer2");
let layer3 = document.getElementById("layer3");
let overlay = document.getElementById("overlay");

let level = l2;

let input = getInput(document);
let scene = getScene(level.points, level.minX, level.maxX);
let movement = getMovement(input);

let findLine = ps => {
    for (i = 0; i < ps.length-1; i++) {
        if (sceneX < ps[i+1].x) {
            return { x1: ps[i].x, y1: ps[i].y, x2: ps[i+1].x, y2: ps[i+1].y }
        }
    }
}

layer1.innerHTML = generatePolygon(generateMountain(100, 700), "gray");
layer2.innerHTML = generatePolygon(generateMountain(300, 700), "darkgray");
layer3.innerHTML = scene.polygon(true, true);
overlay.innerHTML = '<text x="100" y="40" fill="black">WHACKY WESQUE WHEEL</text>';

let lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    movement.update(dt);

    circle.setAttribute("transform", `translate(${movement.circleTranslationX()} ${movement.circleTranslationY()})`);
    layer3.setAttribute("transform", `translate(${movement.sceneTranslationX()} 0)`); 
    layer2.setAttribute("transform", `translate(${0.6 * movement.sceneTranslationX()} 0)`); 
    layer1.setAttribute("transform", `translate(${0.2 * movement.sceneTranslationX()} 0)`); 

    sceneX = movement.circleTranslationX() - movement.sceneTranslationX();

    let line = findLine(scene.points);
    document.getElementById("hoveredLine").setAttribute('x1', line.x1);
    document.getElementById("hoveredLine").setAttribute('y1', line.y1);
    document.getElementById("hoveredLine").setAttribute('x2', line.x2);
    document.getElementById("hoveredLine").setAttribute('y2', line.y2);

    requestAnimationFrame(gameLoop);
    lastTime = now;

    console.log(`${sceneX} - circle: ${movement.circleTranslationX()}, scene: ${movement.sceneTranslationX()}`);
}

gameLoop();