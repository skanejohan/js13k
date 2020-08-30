/*
    When hitting score 404, go to the next level
    When all levels are cleared, game over. 

   Polish:
   - green and blue around the road
   - possibly "fog of war when too far from the road"
   - when hitting a coin, display its value and possibly the status code
   - sliding when turning
*/


let { canvas, context } = kontra.init();

let margin = 200;
let minX = margin;
let minY = margin;
let maxX = canvas.clientWidth - 2 * margin;
let maxY = canvas.clientHeight - 2 * margin;
let cx = canvas.clientWidth / 2;

let overlay = Overlay();
let debug = Debug(context, gameContext);

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