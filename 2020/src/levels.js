buildLevel = level => {
    gameContext.roads = [];
    gameContext.environment = [];
    _currX = _levels[level].startX;
    _currY = _levels[level].startY;
    _currDir = _levels[level].startDir;
    _levels[level].roads.split(",").forEach(c => {
        switch(c) {
            case "s": _straight(); break;
            case "l": _left(); break;
            case "r": _right(); break;
            case "c": _cross(); break;
        }
    });
    _levels[level].environments.forEach(e => {
        gameContext.environment.push(e.create());
    });
    return { x: _levels[level].carX, y: _levels[level].carY, dir: _levels[level].carDir };
}

_levels = [
    {
        carX: 200,
        carY: 240,
        carDir: 0,
        startX: 200,
        startY: 200,
        startDir: 0,
        roads: "s,s,s,s,s,s,s,s,s,s,l,s,s,s,s,s,l,s,l,s,s,r,s,s,r,s,s,s,s,s,r,s,s,s,s,s,s,s,r,s,s,s,s,s,s,s,s,s,s,s,s,s,s,l,r,l,r,s,r,s,s,s,s,s,s,r,s,s,l,s,s,s,s,s,s,s,s,r,s,s,s,s,s,r",
        environments: [
            { create: () => createEnvironment(100, 100, "blue", "green", 200) },
            { create: () => createEnvironment(500, 500, "brown", "green", 300) },
            { create: () => createEnvironment(800, 1200, "brown", "green", 300) },
            { create: () => createEnvironment(1200, 1000, "blue", "green", 150) },
            { create: () => createEnvironment(1500, 500, "brown", "green", 300) },
        ]
    },
    {
        carX: 200,
        carY: 240,
        carDir: 0,
        startX: 200,
        startY: 200,
        startDir: 0,
        roads: "s,s,s,s,s,c,s,s,s,s,s,r,s,s,s,s,r,s,s,s,s,s,r,s,s,s,s,c,s,s,s,s,s,s,l,s,s,s,s,s,s,s,s,s,l,s,s,s,s,s,s,l,s,s,s,s",
        environments: [
            { create: () => createTree(100, 100) },
            { create: () => createHouse(200, 100) },
            { create: () => createEnvironment(500, 500, "brown", "green", 300) },
            { create: () => createEnvironment(800, 1200, "brown", "green", 300) },
            { create: () => createEnvironment(1200, 1000, "blue", "green", 150) },
            { create: () => createEnvironment(1500, 500, "brown", "green", 300) },
        ]
    },
    {
        carX: 200,
        carY: 200,
        carDir: 270,
        startX: 200,
        startY: 200,
        startDir: 90,
        roads: "s,s,s,s,s,s,s,s,s,s,l,s,s,s,s,s,l,s,l,s,s,r,s,s,r,s,s,s,s,s,r,s,s,s,s,s,s,s,r,s,s,s,s,s,s,s,s,s,s,s,s,s,s,l,r,l,r,s,r,s,s,s,s,s,s,r,s,s,l,s,s,s,s,s,s,s,s,r,s,s,s,s,s,r",
        environments: [
            { create: () => createEnvironment(100, 100, "blue", "green", 200) },
            { create: () => createEnvironment(500, 500, "brown", "green", 300) },
            { create: () => createEnvironment(800, 1200, "brown", "green", 300) },
            { create: () => createEnvironment(1200, 1000, "blue", "green", 150) },
            { create: () => createEnvironment(1500, 500, "brown", "green", 300) },
        ]
    },
]

var _currX;
var _currY;
var _currDir;

let _straight = () => {
    gameContext.roads.push(createStraightRoad(_currX, _currY, _currDir));
    switch(_currDir) {
        case   0: _currX += 100; break; 
        case  90: _currY -= 100; break; 
        case 180: _currX -= 100; break; 
        case 270: _currY += 100; break; 
    }
}

let _cross = () => {
    gameContext.roads.push(createCrossRoad(_currX, _currY, _currDir));
    switch(_currDir) {
        case   0: _currX += 100; break; 
        case  90: _currY -= 100; break; 
        case 180: _currX -= 100; break; 
        case 270: _currY += 100; break; 
    }
}

let _left = () => {
    switch(_currDir) {
        case   0: 
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 90));
            _currDir = 90;
            _currY -= 100; 
            break; 
        case  90:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 0));
            _currDir = 180;
            _currX -= 100; 
            break; 
        case  180:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 270));
            _currDir = 270;
            _currY += 100; 
            break;             
        case 270:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 180));
            _currDir = 0;
            _currX += 100; 
            break;             
    }
}

let _right = () => {
    switch(_currDir) {
        case   0: 
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 0));
            _currDir = 270;
            _currY += 100; 
            break; 
        case  90:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 270));
            _currDir = 0;
            _currX += 100; 
            break; 
        case  180:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 180));
            _currDir = 90;
            _currY -= 100; 
            break;             
        case 270:
            gameContext.roads.push(createCurvedRoad(_currX, _currY, 90));
            _currDir = 180;
            _currX -= 100; 
            break;             
    }
}
