let { canvas, context } = kontra.init();

let margin = 200;
let minX = margin;
let minY = margin;
let maxX = canvas.clientWidth - 2 * margin;
let maxY = canvas.clientHeight - 2 * margin;

const GameState = {
    IDLE: 1,
    PLAYING: 2,
    LIFELOST: 3,
    GAMEOVER: 4
}

var gameContext = {
    scrollX : 0, 
    scrollY : 0,
    x: 0,
    y: 0,
    gameState: GameState.IDLE,
}

let car = Car(300, 250);
currentRoadPos = {x:0, y:200, dir: 0};
for (var i = 0; i < 10; i++) {    
    addStraight();
}

let energyBar = EnergyBar(minX, 700, maxX, 20);

var tickCount = 0;
var energyUpdateEveryTick = 10;

let debug = Debug();

var coveredRoadSegments = [];

let overlay = Overlay();

kontra.initPointer();

kontra.onPointerUp(function(e, object) {
    if (gameContext.gameState == GameState.IDLE) {
        gameContext.gameState = GameState.PLAYING;
    }
});

// function setGameState(newState) {
//     gameContext.gameState = newState;
//     if (newState == GameState.IDLE) {
//         resetGame();
//         gameCanvas.style.cursor = defaultCursor;
//         gameCanvas.addEventListener('click', () => setGameState(GameState.PLAYING), {once: true});
//     }
//     if (newState == GameState.LIFELOST) {
//         gameContext.ships -= 1;
//         if (gameContext.ships == 0) {
//             gameContext.high = Math.max(gameContext.high, gameContext.score);
//             setGameState(GameState.GAMEOVER);
//         }
//         else {
//             setTimeout(() => setGameState(GameState.PLAYING), 1000);
//         }
//     }
//     if (newState == GameState.PLAYING) {
//         gameCanvas.style.cursor = "none";
//         respawnPlayer();
//     }
//     if (newState == GameState.GAMEOVER) {
//         setTimeout(() => setGameState(GameState.IDLE), 3000);
//     }
// }

updateRoadNet = () => {
    while(true) {
        if (currentRoadPos.x > maxX - gameContext.x + 20 * margin || 
            currentRoadPos.x < minX - gameContext.x - 20 * margin ||
            currentRoadPos.y > maxY - gameContext.y + 20 * margin ||
            currentRoadPos.y < minY - gameContext.y - 20 * margin) {
                return;
            }
        generate();
    }
}

renderRectangles = () => {
    car.renderCollisionPoints();
    roads.forEach(r => r.renderRectangle("green"));
    coveredRoadSegments.forEach(r => r.renderRectangle("red"));
}

handleCollisions = () => {
    coveredRoadSegments = getCoveredRoadSegments(car.collisionPoints());
    frontLeftInside = false;
    frontRightInside = false;
    rearLeftInside = false;
    rearRightInside = false;
    coveredRoadSegments.forEach(s => {
        if (s.inside(car.frontLeft())) {
            frontLeftInside = true;
        }
        if (s.inside(car.frontRight())) {
            frontRightInside = true;
        }
        if (s.inside(car.rearLeft())) {
            rearLeftInside = true;
        }
        if (s.inside(car.rearRight())) {
            rearRightInside = true;
        }
    });
    if (!(frontLeftInside && frontRightInside && rearLeftInside && rearRightInside)) {
        energyBar.value--;
        if (energyBar.value == 0) {
            gameContext.gameState = GameState.GAMEOVER;
            setTimeout(() => gameContext.gameState = GameState.IDLE, 3000);
        }
    }
    // if (frontLeftInside && frontRightInside) { // && rearLeftInside && rearRightInside) {
    //     return;
    // }
    coveredRoadSegments.forEach(s => {
        if (s.inside(car.frontLeft()) && !(s.inside(car.frontRight()))) {
            car.rotateLeft();
        }
        if (s.inside(car.frontRight()) && !(s.inside(car.frontLeft()))) {
            car.rotateRight();
        }
        // if (!(s.inside(car.frontRight().x, car.frontRight().y)) && !(s.inside(car.frontLeft().x, car.frontLeft().y))) {
        //     car.drive(-7);
        // }
    })

    debug.update();
    console.log(energyBar.value);
}

kontra.initKeys();

let loop = kontra.GameLoop({
    update() {
        if (gameContext.gameState == GameState.PLAYING) {
            tickCount++;
            if (tickCount % energyUpdateEveryTick == 0 && energyBar.value < 500) {
                energyBar.value++;
            }
            updateRoadNet();
            roads.forEach(r => r.update());
            car.update();
            handleCollisions();
        }
    },
    render() {
        if (gameContext.gameState == GameState.PLAYING) {
            roads.forEach(r => r.render());
            car.render();
            debug.render();
            renderRectangles();
            energyBar.render();
        }
        overlay.render();
    }
});
loop.start();