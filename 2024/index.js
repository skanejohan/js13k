let layer3 = document.getElementById("layer3");
let hoveredLine = document.getElementById("hoveredLine");

let input = getInput(document);

let level = l2;

layer1.innerHTML = generatePolygon(generateMountain(100, 700), "gray");
layer2.innerHTML = generatePolygon(generateMountain(300, 700), "darkgray");
layer3.innerHTML = '<circle r="40" fill="none" stroke="url(#spinner-gradient)" stroke-width="8" id="circle" />' + generatePolygon(level.points, "white");
overlay.innerHTML = '<text x="100" y="40" fill="black">WHACKY WESQUE WHEEL</text>';

let lastTime = Date.now();

let cr = 40;
let cx = 975;
let cy = 100;
let ca = 0;

let offsetx = 0;

// -------------------------------------------------------------------

let line = { x1 : 0, x2 : 0 };
let point = { x : 0, y : 0 };

let findLineAndPoint = x => {
    for (i = 1; i < level.points.length; i++) {
        if (x < level.points[i].x) {
            let x1 = level.points[i-1].x;
            let y1 = level.points[i-1].y;
            let x2 = level.points[i].x;
            let y2 = level.points[i].y;
            line = { 
                x1 : x1, 
                y1 : y1, 
                x2 : x2, 
                y2 : y2, 
                v: Math.atan((y2-y1)/(x2-x1)) };
            point.x = x;
            point.y = line.y1 + ((x - line.x1) / (line.x2 - line.x1)) * (line.y2 - line.y1);
            break;
        }
    }
}

// -------------------------------------------------------------------

let da = 0;
let dx = 0;
let dy = 0;

let _updateInAir = (left, right, stop) => {
    if (left) { da -= 2; }
    if (right) { da += 2; }
    if (stop) { da = 0; }
    dy += 1;
}

let _updateOnGround = (left, right, stop) => {
    if (left) { da -= 1; }
    if (right) { da += 1; }
    if (stop) { da = 0; }
    da += Math.sin(line.v);
    dx = da * Math.cos(line.v);
    dy = da * Math.sin(line.v);
}

let _update = (left, right, stop) => {
    if (cy < point.y - cr) {
        _updateInAir(left, right, stop)
    }
    else {
        _updateOnGround(left, right, stop);
    }
}

// -------------------------------------------------------------------

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    if (cx < line.x1 || cx > line.x2) {
        findLineAndPoint(cx);
    }
    hoveredLine.setAttribute('x1', line.x1); // DEBUG
    hoveredLine.setAttribute('x2', line.x2); // DEBUG
    hoveredLine.setAttribute('y1', line.y1); // DEBUG
    hoveredLine.setAttribute('y2', line.y2); // DEBUG
    hoveredPoint.setAttribute('cx', point.x); // DEBUG
    hoveredPoint.setAttribute('cy', point.y); // DEBUG

    _update(input.isDown("ArrowLeft"), input.isDown("ArrowRight"), input.isDown("Space"));

    ca += da * (dt / 100);
    cx += dx * (dt / 100);
    cy += dy * (dt / 100);
    if (cx < level.minX) {
        cx = level.minX;
        dx = 0;
        da = 0;
        ca = 0;
    }
    if (cx > level.maxX) {
        cx = level.maxX;
        dx = 0;
        da = 0;
        ca = 0;
    }
    cy = Math.min(cy, point.y - cr);

    circle.setAttribute("transform", `translate(${cx} ${cy}) rotate(${ca})`);

    if (cx - 1720 > offsetx) {
        offsetx = cx - 1720;
    }

    if (cx < offsetx + 200) {
        offsetx = cx - 200;
    }
    layer1.setAttribute("transform", `translate(${-0.2*offsetx} 0)`); 
    layer2.setAttribute("transform", `translate(${-0.6*offsetx} 0)`); 
    layer3.setAttribute("transform", `translate(${-offsetx} 0)`); 
    debug.setAttribute("transform", `translate(${-offsetx} 0)`); 

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();