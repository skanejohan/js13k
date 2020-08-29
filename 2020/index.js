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
    LIFELOST: 3,
    GAMEOVER: 4
}

var gameContext = {
    x: 0,
    y: 0,
    scrollX : 0, 
    scrollY : 0,
    gameState: GameState.IDLE,

    reset() {
        this.roads = [];
        this.car = Car(300, 250);
        this.currentRoadPos = {x:0, y:200, dir: 0};
        this.energyBar = EnergyBar(minX, 700, maxX, 20);
        for (var i = 0; i < 10; i++) {    
            addStraight();
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
    }
}




var coveredRoadSegments = [];

handleCollisions = () => {
    /* TODO but use individual points instead of collisionPoints
    coveredRoadSegments = getCoveredRoadSegments(gameContext.car.collisionPoints());
    frontLeftInside = false;
    frontRightInside = false;
    rearLeftInside = false;
    rearRightInside = false;
    coveredRoadSegments.forEach(s => {
        if (s.inside(gameContext.car.frontLeft())) {
            frontLeftInside = true;
        }
        if (s.inside(gameContext.car.frontRight())) {
            frontRightInside = true;
        }
        if (s.inside(gameContext.car.rearLeft)) {
            rearLeftInside = true;
        }
        if (s.inside(gameContext.car.rearRight())) {
            rearRightInside = true;
        }
    });
    if (!(frontLeftInside && frontRightInside && rearLeftInside && rearRightInside)) {
        gameContext.energyBar.value--;
        if (gameContext.energyBar.value == 0) {
            gameContext.setGameState(GameState.GAMEOVER);
        }
    }
    // if (frontLeftInside && frontRightInside) { // && rearLeftInside && rearRightInside) {
    //     return;
    // }
    coveredRoadSegments.forEach(s => {
        if (s.inside(gameContext.car.frontLeft()) && !(s.inside(gameContext.car.frontRight()))) {
            gameContext.car.rotateLeft();
        }
        if (s.inside(gameContext.car.frontRight()) && !(s.inside(gameContext.car.frontLeft()))) {
            gameContext.car.rotateRight();
        }
        // if (!(s.inside(car.frontRight().x, car.frontRight().y)) && !(s.inside(car.frontLeft().x, car.frontLeft().y))) {
        //     car.drive(-7);
        // }
    })
    */
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
        if (gameContext.gameState == GameState.PLAYING) {
            updateRoadNet();
            gameContext.roads.forEach(r => r.update());
            gameContext.car.update();
            gameContext.energyBar.update();
            handleCollisions();
            debug.update();
        }
    },

    render() {
        if (gameContext.gameState == GameState.PLAYING) {
            gameContext.roads.forEach(r => r.render());
            gameContext.car.render();
            gameContext.energyBar.render();
            debug.render();
        }
        overlay.render();
    }
});

loop.start();