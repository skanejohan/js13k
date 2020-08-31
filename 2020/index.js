/*
    More coins - test with "all values" between 1 and 500
    When hitting score 404, go to the next level
    When all levels are cleared, game over. 

   Polish:
   - green and blue around the road
   - possibly "fog of war when too far from the road"
   - when hitting a coin, display its value and possibly the status code
   - sliding when turning
*/


let { canvas, context } = kontra.init();

let topRowHeight = 50;
let bottomRowHeight = 50;
let scrollMargin = 200;

var dimensions = {
    minX: scrollMargin,
    minY: scrollMargin,
    maxX: 0,
    maxY: 0,
    cx: 0,

    update(w, h) {
        this.w = w,
        this.h = h,
        this.maxX = w - 2 * scrollMargin;
        this.maxY = h - 2 * scrollMargin;
        this.cx = w / 2;
    }
}

let overlay = Overlay();
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

let loop = kontra.GameLoop({

    update() {
        gameContext.update();
        //debug.update();
    },

    render() {
        gameContext.render();
        overlay.render();
        //debug.render();
    }
});

loop.start();