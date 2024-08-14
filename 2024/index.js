let leftEdge = 200;
let rightEdge = 1200;
let circleTranslationX = 800;
let circleTranslationY = 400;
let sceneTranslationX = 0;
let dx = 0;

let circle = document.getElementById("circle");
let layer1 = document.getElementById("layer1");
let layer2 = document.getElementById("layer2");
let layer3 = document.getElementById("layer3");
let overlay = document.getElementById("overlay");

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

// Set up the scene
layer1.innerHTML = '<rect width="200" height="100" x="100" y="100" rx="20" ry="20" fill="blue" />';
layer2.innerHTML = '<rect width="200" height="100" x="100" y="300" rx="20" ry="20" fill="red" />';
layer3.innerHTML = '<rect width="200" height="100" x="600" y="500" rx="20" ry="20" fill="yellow" />';
overlay.innerHTML = '<text x="500" y="300" fill="black">WHACKY WESQUE WHEEL</text>';

let lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    let translationX = Math.abs(5 * (dx * dt / 100));
    if (dx > 0) { // We move right
        let leftToApply = rightEdge - circleTranslationX;
        let toApply = Math.min(translationX, leftToApply);
        circleTranslationX += toApply;
        sceneTranslationX -= translationX - toApply;
    }
    else { // We move left
        let leftToApply = circleTranslationX - leftEdge;
        let toApply = Math.min(translationX, leftToApply);
        circleTranslationX -= toApply;
        sceneTranslationX += translationX - toApply;
    }
    circle.setAttribute("transform", `translate(${circleTranslationX} ${circleTranslationY})`);
    layer3.setAttribute("transform", `translate(${sceneTranslationX} 0)`); 
    layer2.setAttribute("transform", `translate(${0.6 * sceneTranslationX} 0)`); 
    layer1.setAttribute("transform", `translate(${0.2 * sceneTranslationX} 0)`); 

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();