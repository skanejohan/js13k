/*
    Fix flickering on small canvas
    When hitting score 404, go to the next level
    When all levels are cleared, rotate back to the first one, but with higher speed. 

   Polish:
   - green and blue around the road
   - possibly "fog of war when too far from the road"
   - when hitting a coin, display its value and possibly the status code
   - sliding when turning
*/


let { canvas, context } = kontra.init();

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

gameContext.setGameState(GameState.IDLE);

let debug = Debug(context, gameContext);

handleResize = (w, h) => {
    canvas.width = w;
    canvas.height = h;
    dimensions.update(canvas.clientWidth, canvas.clientHeight);
}

kontra.initKeys();
kontra.initPointer();
kontra.onPointerUp(function(e, object) {
    if (gameContext.gameState == GameState.IDLE) {
        gameContext.setGameState(GameState.PLAYING);
    }
});

let turnLeft = () => kontra.keyPressed('left');
let turnRight = () => kontra.keyPressed('right');
let fastForward = () => kontra.keyPressed('space');

let loop = kontra.GameLoop({

    update() {
        gameContext.update();
        //debug.update();
    },

    render() {
        gameContext.render();
        drawOverlay(gameContext, context);
        //debug.render();
    }
});

loop.start();