let roads = [];

let currentRoadPos = { x:0, y:0, dir:0 }

let addStraight = () => {
    var { x, y, dir } = currentRoadPos;
    roads.push(Straight(x+gameContext.x, y+gameContext.y, dir));
    switch(dir) {
        case 0: 
            currentRoadPos = {x: x+100, y: y, dir: dir};
            break;
        case 90: 
            currentRoadPos = {x: x, y: y+100, dir: dir};
            break;
        case 180: 
            currentRoadPos = {x: x-100, y: y, dir: dir};
            break;
        case 270: 
            currentRoadPos = {x: x, y: y-100, dir: dir};
            break;
    }
}
    
let addRight90 = () => {
    var { x, y, dir } = currentRoadPos;
    roads.push(Curve(x+gameContext.x, y+gameContext.y, dir));
    switch(dir) {
        case 0: 
            currentRoadPos = {x: x+100, y: y+100, dir: 90}; 
            break;
        case 90: 
            currentRoadPos = {x: x-100, y: y+100, dir: 180}; 
            break;
        case 180: 
            currentRoadPos = {x: x-100, y: y-100, dir: 270}; 
            break;
        case 270: 
            currentRoadPos = {x: x+100, y: y-100, dir: 0}; 
            break;
    }
}
    
let addLeft90 = () => {
    var { x, y, dir } = currentRoadPos;
    switch(dir) {
        case 0: 
            roads.push(Curve(x+gameContext.x+100, y+gameContext.y, 90));
            currentRoadPos = {x: x, y: y, dir: 270};
            break;
        case 90: 
            roads.push(Curve(x+gameContext.x, y+gameContext.y+100, 180));
            currentRoadPos = {x: x, y: y, dir: 0};
            break;
        case 180: 
            roads.push(Curve(x+gameContext.x-100, y+gameContext.y, 270));
            currentRoadPos = {x: x, y: y, dir: 90};
            break;
        case 270: 
            roads.push(Curve(x+gameContext.x, y+gameContext.y-100, 0));
            currentRoadPos = {x: x, y: y, dir: 180};
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
        return currentRoadPos;
    }
    ack += statistics.r90;
    if (rnd < ack) {
        addRight90();
        return currentRoadPos;
    }
    ack += statistics.r180;
    if (rnd < ack) {
        addRight180();
        return currentRoadPos;
    }
    ack += statistics.r270;
    if (rnd < ack) {
        addRight270();
        return currentRoadPos;
    }
    ack += statistics.l90;
    if (rnd < ack) {
        addLeft90();
        return currentRoadPos;
    }
    ack += statistics.l180;
    if (rnd < ack) {
        addLeft180();
        return currentRoadPos;
    }
    addRight270();
}