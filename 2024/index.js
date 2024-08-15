let leftEdge = 200;
let rightEdge = 1720;
let circleTranslationX = 800;
let circleTranslationY = 400;
let sceneTranslationX = 0;
let sceneX = 0;
let dx = 0;

let circle = document.getElementById("circle");
let layer1 = document.getElementById("layer1");
let layer2 = document.getElementById("layer2");
let layer3 = document.getElementById("layer3");
let overlay = document.getElementById("overlay");

let level = l2;

let scene = getScene(level.points, level.minX, level.maxX);

document.addEventListener('keydown', 
    e => {
        if (e.code == "ArrowLeft") {
            dx -= 1;
        }
        if (e.code == "ArrowRight") {
            dx += 1;
        }
        if (e.code == "Space") {
            dx = 0;
        }
    }, false);

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

    let translationX = Math.abs(5 * (dx * dt / 100));
    if (dx > 0) { // We move right
        if (sceneX < scene.maxX) {
            let leftToApply = rightEdge - circleTranslationX;
            let toApply = Math.min(translationX, leftToApply);
            circleTranslationX += toApply;
            sceneTranslationX -= translationX - toApply;
        }
        else {
            dx = 0;
        }
    }
    else { // We move left
        if (sceneX > scene.minX) {
            let leftToApply = circleTranslationX - leftEdge;
            let toApply = Math.min(translationX, leftToApply);
            circleTranslationX -= toApply;
            sceneTranslationX += translationX - toApply;
        }
        else {
            dx = 0;
        }
    }
    circle.setAttribute("transform", `translate(${circleTranslationX} ${circleTranslationY})`);
    layer3.setAttribute("transform", `translate(${sceneTranslationX} 0)`); 
    layer2.setAttribute("transform", `translate(${0.6 * sceneTranslationX} 0)`); 
    layer1.setAttribute("transform", `translate(${0.2 * sceneTranslationX} 0)`); 

    sceneX = circleTranslationX - sceneTranslationX;

    let line = findLine(scene.points);
    document.getElementById("hoveredLine").setAttribute('x1', line.x1);
    document.getElementById("hoveredLine").setAttribute('y1', line.y1);
    document.getElementById("hoveredLine").setAttribute('x2', line.x2);
    document.getElementById("hoveredLine").setAttribute('y2', line.y2);

    requestAnimationFrame(gameLoop);
    lastTime = now;

    console.log(`${sceneX} - circle: ${circleTranslationX}, scene: ${sceneTranslationX}`);
}

gameLoop();