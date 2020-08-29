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

let statistics = {
    s : 300,
    r90 : 10,
    r180: 5,
    r270: 5,
    l90 : 10,
    l180 : 5,
    l270 : 5,
}

let statSum = 340;

let generate = () => {
    var rnd = Math.round(Math.random() * statSum);
    var ack = statistics.s;
    if (rnd < ack) {
        addStraight();
        return;
    }
    ack += statistics.r90;
    if (rnd < ack) {
        addRight90();
        return;
    }
    ack += statistics.r180;
    if (rnd < ack) {
        addRight180();
        return;
    }
    ack += statistics.r270;
    if (rnd < ack) {
        addRight270();
        return;
    }
    ack += statistics.l90;
    if (rnd < ack) {
        addLeft90();
        return;
    }
    ack += statistics.l180;
    if (rnd < ack) {
        addLeft180();
        return;
    }
    addRight270();
}

updateRoadNet = () => {
    while(true) {
        if (gameContext.currentRoadPos.x > maxX - gameContext.x + 20 * margin || 
            gameContext.currentRoadPos.x < minX - gameContext.x - 20 * margin ||
            gameContext.currentRoadPos.y > maxY - gameContext.y + 20 * margin ||
            gameContext.currentRoadPos.y < minY - gameContext.y - 20 * margin) {
                return;
            }
        generate();
    }
}

getCoveredRoadSegments = points => {
    var segments = [];
    gameContext.roads.forEach(r => {
        if (points.some(p => r.inside(p))) {
            segments.push(r);
        }
    });
    return segments;
}
