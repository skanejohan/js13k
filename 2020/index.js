let { canvas, context } = kontra.init();

let margin = 200;
let minX = margin;
let minY = margin;
let maxX = canvas.clientWidth - 2 * margin;
let maxY = canvas.clientHeight - 2 * margin;
let cx = canvas.clientWidth / 2;

const GameState = {
    IDLE: 1,
    PLAYING: 2,
    GAMEOVER: 3
}

var gameContext = {
    x: 0,
    y: 0,
    scrollX : 0, 
    scrollY : 0,
    gameState: GameState.IDLE,

    reset() {
        this.x = 0;
        this.y = 0;
        this.roads = [];
        this.car = Car(300, 250);
        this.energyBar = EnergyBar(minX, 700, maxX, 20);
        buildCourse(1);
    },

    update() {
        if (this.gameState == GameState.PLAYING) {
            this.roads.forEach(r => r.update());
            this.car.update();
            if (!this.carInsideRoad()) {
                gameContext.energyBar.value--;
                if (gameContext.energyBar.value == 0) {
                    gameContext.setGameState(GameState.GAMEOVER);
                }
            }
            this.energyBar.update();
        }
    },

    render() {
        if (this.gameState == GameState.PLAYING) {
            this.roads.forEach(r => r.render());
            this.car.render();
            this.energyBar.render();
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                this.gameState = GameState.PLAYING;
                this.reset();
                break;
            case GameState.GAMEOVER:
                this.gameState = GameState.GAMEOVER;
                setTimeout(() => this.setGameState(GameState.IDLE), 3000);
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                break;
        }
    },

    carInsideRoad() {
        flInside = false;
        frInside = false;
        rrInside = false;
        rlInside = false;
        for (var i=0; i < this.roads.length; i++) {
            var r = this.roads[i];
            flInside = flInside || r.inside(this.car.frontLeft); 
            frInside = frInside || r.inside(this.car.frontRight); 
            rrInside = rrInside || r.inside(this.car.rearRight); 
            rlInside = rlInside || r.inside(this.car.rearLeft);
            if (flInside && frInside && rrInside && rlInside) {
                return true;
            } 
        }
        return false;
    }
}

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