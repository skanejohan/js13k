let layer3 = document.getElementById("layer3");
let hoveredLine = document.getElementById("hoveredLine");

let input = getInput(document);

let level = l3();

let skiersCaught = 0;

let getOverlayText = () => {
    if (skiersCaught == 13) {
        return `<text x="100" y="40" fill="black">WHACKY WESQUE WHEEL - LEVEL WON</text>`;
    }
    return `<text x="100" y="40" fill="black">WHACKY WESQUE WHEEL - ${skiersCaught} SKIERS CAUGHT</text>`;
}

layer1.innerHTML = generatePolygon(generateMountain(100, 100, 20000, 700, 50), "gray");
layer2.innerHTML = generatePolygon(generateMountain(100, 300, 20000, 700, 50), "darkgray");
layer3.innerHTML = '<circle r="40" fill="none" stroke="url(#spinner-gradient)" stroke-width="8" id="circle" />' + 
    generatePolygon(level.points, "white") +
    generateSkiers(level.skiers) + 
    generateBlockers(level.blockers); // DEBUG
overlay.innerHTML = getOverlayText();

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
            let l = { 
                x1 : x1, 
                y1 : y1, 
                x2 : x2, 
                y2 : y2, 
                v: Math.atan((y2-y1)/(x2-x1)) };
            let p = {
                x : x,
                y : y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
            }
            return { line: l, point: p };
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

let rightX = 1520;
let rightY = 400;

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    if (cx < line.x1 || cx > line.x2) {
        let lp = findLineAndPoint(cx);
        point = lp.point;
        line = lp.line;
    }
    hoveredLine.setAttribute('x1', line.x1); // DEBUG
    hoveredLine.setAttribute('x2', line.x2); // DEBUG
    hoveredLine.setAttribute('y1', line.y1); // DEBUG
    hoveredLine.setAttribute('y2', line.y2); // DEBUG
    hoveredPoint.setAttribute('cx', point.x); // DEBUG
    hoveredPoint.setAttribute('cy', point.y); // DEBUG

    _update(input.isDown("ArrowLeft"), input.isDown("ArrowRight"), input.isDown("Space"));

    for (let i = 0; i < level.blockers.length; i++) {
        let b = level.blockers[i];
        if (cx < b.left && cx + dx * (dt / 100) > b.left && cy > b.top) {
            da = 0;
            dx = 0;
            cx = b.left - 1;
            break;
        }
    }

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

    for (let i = 0; i < level.skiers.length; i++) {
        let s = level.skiers[i];
        let lp = findLineAndPoint(s.x);

        if ((s.dx > 0 && lp.line.v < -0.4) || (s.dx < 0 && lp.line.v > 0.4)) {
            s.dx = -s.dx
        }

        s.x += s.dx;
        s.y = lp.point.y - 20;
        var el = document.getElementById(`skier_${i}`);
        if (el) {
            el.setAttribute("transform", `translate(${s.x} ${s.y})`);
        }
    }

    for (let i = 0; i < level.skiers.length; i++) {
        let s = level.skiers[i];
        if ((s.x - cx) * (s.x - cx) + (s.y - cy) * (s.y - cy) < 3600) {
            var el = document.getElementById(`skier_${i}`);
            if (el) {
                el.remove();
                skiersCaught++;
                overlay.innerHTML = getOverlayText();
            }
            break;
        }
    }

    if (cx - rightX > offsetx) {
        offsetx = cx - rightX;
    }

    if (cx < offsetx + rightY) {
        offsetx = cx - rightY;
    }
    layer1.setAttribute("transform", `translate(${-0.2*offsetx} 0)`); 
    layer2.setAttribute("transform", `translate(${-0.6*offsetx} 0)`); 
    layer3.setAttribute("transform", `translate(${-offsetx} 0)`); 
    debug.setAttribute("transform", `translate(${-offsetx} 0)`); 

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();