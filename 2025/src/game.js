let side = 80;

let level = undefined;

const GSMENU = 0;
const GSPLAYING = 1;
const GSLEVELWON = 2;
const GSLEVELLOST = 3;
const GSGAMEOVER = 4;

let gameState = GSMENU;
displayMenu();

var lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    updateView(dt);
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

initSound();
gameLoop();