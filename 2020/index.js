/*
    Add pause
    No getting stuck in environment
    Fix flickering on small canvas
    Eight levels
    When all levels are cleared, rotate back to the first one, but with higher speed. 

   Polish:
   - spectator stand, lake...
   - when hitting a coin, display its value and possibly the status code
   - sliding when turning
*/

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let degToRad = deg => deg * Math.PI / 180;

let topRowHeight = 100;
let bottomRowHeight = 0;
let scrollMargin = 400;

var dimensions = {
    minX: scrollMargin,
    minY: scrollMargin,
    maxX: 0,
    maxY: 0,
    cx: 0,

    update(w, h) {
        this.w = w,
        this.h = h,
        this.maxX = w - scrollMargin;
        this.maxY = h - scrollMargin;
        this.cx = w / 2;
    }
}

let lastTime = Date.now();

gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    gameContext.update(dt);

    fillRect(0, 0, dimensions.w, dimensions.h, "green", context);
    gameContext.render();
    drawOverlay(gameContext, context);
    //drawDebugInfo();

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

handleResize = (w, h) => {
    canvas.width = w;
    canvas.height = h;
    dimensions.update(canvas.clientWidth, canvas.clientHeight);
}

initialize = () => {
    handleResize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => {
        handleResize(window.innerWidth, window.innerHeight);
    });
    canvas.addEventListener('click', () => {
        if (gameContext.gameState == GameState.IDLE) {
            gameContext.setGameState(GameState.PLAYING);
        }
    });
    gameContext.setGameState(GameState.IDLE);
    initInput(document);
    gameLoop();
}

window.addEventListener('load', () => initialize()); 
