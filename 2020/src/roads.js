var currX;
var currY;
var currDir;

straight = () => {
    gameContext.roads.push(createStraightRoad(currX, currY, currDir));
    switch(currDir) {
        case   0: currX += 100; break; 
        case  90: currY -= 100; break; 
        case 180: currX -= 100; break; 
        case 270: currY += 100; break; 
    }
}

left = () => {
    switch(currDir) {
        case   0: 
            gameContext.roads.push(createCurvedRoad(currX, currY, 90));
            currDir = 90;
            currY -= 100; 
            break; 
        case  90:
            gameContext.roads.push(createCurvedRoad(currX, currY, 0));
            currDir = 180;
            currX -= 100; 
            break; 
        case  180:
            gameContext.roads.push(createCurvedRoad(currX, currY, 270));
            currDir = 270;
            currY += 100; 
            break;             
        case 270:
            gameContext.roads.push(createCurvedRoad(currX, currY, 180));
            currDir = 0;
            currX += 100; 
            break;             
    }
}

right = () => {
    switch(currDir) {
        case   0: 
            gameContext.roads.push(createCurvedRoad(currX, currY, 0));
            currDir = 270;
            currY += 100; 
            break; 
        case  90:
            gameContext.roads.push(createCurvedRoad(currX, currY, 270));
            currDir = 0;
            currX += 100; 
            break; 
        case  180:
            gameContext.roads.push(createCurvedRoad(currX, currY, 180));
            currDir = 90;
            currY -= 100; 
            break;             
        case 270:
            gameContext.roads.push(createCurvedRoad(currX, currY, 90));
            currDir = 180;
            currX -= 100; 
            break;             
    }
}

buildCourse = level => {

    currX = 200;
    currY = 200;
    currDir = 0;

    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    left();
    straight();
    straight();
    straight();
    straight();
    straight();
    left();
    straight();
    left();
    straight();
    straight();
    right();
    straight();
    straight();
    right();
    straight();
    straight();
    straight();
    straight();
    straight();
    right();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    right();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    left();
    right();
    left();
    right();
    straight();
    right();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    right();
    straight();
    straight();
    left();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    straight();
    right();
    straight();
    straight();
    straight();
    straight();
    straight();
    right();

    gameContext.environment.push(Environment(100, 100, "blue", "green", 200));
    gameContext.environment.push(Environment(500, 500, "brown", "green", 300));
    gameContext.environment.push(Environment(800, 1200, "brown", "green", 300));
    gameContext.environment.push(Environment(1200, 1000, "blue", "green", 150));
    gameContext.environment.push(Environment(1500, 500, "brown", "green", 300));
}
