let { canvas, context } = kontra.init();

let margin = 200;
let minX = margin;
let minY = margin;
let maxX = canvas.clientWidth - 2 * margin;
let maxY = canvas.clientHeight - 2 * margin;

var gameContext = {
    scrollX : 0, 
    scrollY : 0,
    x: 0,
    y: 0,
}

let car = Car(300, 250);
currentRoadPos = {x:0, y:200, dir: 0};
for (var i = 0; i < 10; i++) {    
    addStraight();
}

let debug = Debug();

var coveredRoadSegments = [];

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

kontra.initKeys();

let loop = kontra.GameLoop({
    update() {
        updateRoadNet();
        roads.forEach(r => r.update());
        car.update();
        coveredRoadSegments = getCoveredRoadSegments(car.collisionPoints());
        debug.update();
    },
    render() {
        roads.forEach(r => r.render());
        car.render();
        debug.render();
        renderRectangles();
    }
});
loop.start();