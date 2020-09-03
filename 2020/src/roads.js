let addStraight = () => {
    var { x, y, dir } = gameContext.currentRoadPos;
    gameContext.roads.push(Straight(x+gameContext.x, y+gameContext.y, dir));
    switch(dir) {
        case 0: 
            gameContext.currentRoadPos = {x: x+100, y: y, dir: dir};
            break;
        case 90: 
            gameContext.currentRoadPos = {x: x, y: y+100, dir: dir};
            break;
        case 180: 
            gameContext.currentRoadPos = {x: x-100, y: y, dir: dir};
            break;
        case 270: 
            gameContext.currentRoadPos = {x: x, y: y-100, dir: dir};
            break;
    }
}
    
let addRight90 = () => {
    var { x, y, dir } = gameContext.currentRoadPos;
    gameContext.roads.push(Curve(x+gameContext.x, y+gameContext.y, dir));
    switch(dir) {
        case 0: 
            gameContext.currentRoadPos = {x: x+100, y: y+100, dir: 90}; 
            break;
        case 90: 
            gameContext.currentRoadPos = {x: x-100, y: y+100, dir: 180}; 
            break;
        case 180: 
            gameContext.currentRoadPos = {x: x-100, y: y-100, dir: 270}; 
            break;
        case 270: 
            gameContext.currentRoadPos = {x: x+100, y: y-100, dir: 0}; 
            break;
    }
}
    
let addLeft90 = () => {
    var { x, y, dir } = gameContext.currentRoadPos;
    switch(dir) {
        case 0: 
            gameContext.roads.push(Curve(x+gameContext.x+100, y+gameContext.y, 90));
            gameContext.currentRoadPos = {x: x, y: y, dir: 270};
            break;
        case 90: 
            gameContext.roads.push(Curve(x+gameContext.x, y+gameContext.y+100, 180));
            gameContext.currentRoadPos = {x: x, y: y, dir: 0};
            break;
        case 180: 
            gameContext.roads.push(Curve(x+gameContext.x-100, y+gameContext.y, 270));
            gameContext.currentRoadPos = {x: x, y: y, dir: 90};
            break;
        case 270: 
            gameContext.roads.push(Curve(x+gameContext.x, y+gameContext.y-100, 0));
            gameContext.currentRoadPos = {x: x, y: y, dir: 180};
            break;
    }
}
    
let addRight180 = () => {
    addRight90();
    addStraight();
    addRight90();
}

let addRight270 = () => {
    addRight180();
    addStraight();
    addRight90();
}

let addLeft180 = () => {
    addLeft90();
    addStraight();
    addLeft90();
}

let addLeft270 = () => {
    addLeft180();
    addStraight();
    addLeft90();
}

buildCourse = level => {
    gameContext.currentRoadPos = {x:0, y:200, dir: 0};

    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addLeft90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addLeft180();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addLeft90();
    addRight90();
    addLeft90();
    addRight90();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addLeft90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addRight90();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addStraight();
    addRight90();

    gameContext.environment.push(Environment(100, 100, "blue", "green", 200));
    gameContext.environment.push(Environment(500, 500, "brown", "green", 300));
    gameContext.environment.push(Environment(800, 1200, "brown", "green", 300));
    gameContext.environment.push(Environment(1200, 1000, "blue", "green", 150));
    gameContext.environment.push(Environment(1500, 500, "brown", "green", 300));
}