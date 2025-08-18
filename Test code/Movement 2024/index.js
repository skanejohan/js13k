// https://en.wikipedia.org/wiki/Sine_and_cosine#/media/File:Sine_cosine_one_period.svg

// Constants

let CX = 400;
let CY = 300;
let CR = 40;
let H = 780; // Height of scene
let MAX_SQ_DIST = 120 * 120; // Needs to be the squared length of the longest line, or the circle radius.

// HTML elements

let CIRCLE_ELEMENT = document.getElementById("circle");
let LINES_ELEMENT = document.getElementById("lines");
let CANDIDATE_POINTS_ELEMENT = document.getElementById("candidate-points");
let CANDIDATE_LINES_ELEMENT = document.getElementById("candidate-lines");
let NEAREST_POINT_ELEMENT = document.getElementById("nearest-point");
let NEAREST_LINE_ELEMENT = document.getElementById("nearest-line");
let DA_ELEMENT = document.getElementById("da");
let DX_ELEMENT = document.getElementById("dx");
let DY_ELEMENT = document.getElementById("dy");

// Input

let down = {};
document.addEventListener('keydown', e => down[e.code] = true, false);
document.addEventListener('keyup', e => down[e.code] = false, false);

// Set the scene

let points = [P(0, 0), P(100, 50), P(200, 50), P(300,150), P(310,200), P(490, 200), P(500, 150), P(600, 50), P(700, 50), P(800, 100)]
LINES_ELEMENT.setAttribute("points", points.map(p => `${p.x},${H-p.y}`).join(" "));
let lines = [];
for (let i = 0; i < points.length-1; i++) {
    let curr = points[i];
    let next = points[i+1];
    lines.push(L(curr.x, curr.y, next.x, next.y));
}

// Debug info

let displayDebugInfo = debugInfo => {
    let candidateLinesHtml = "";
    let candidatePointsHtml = "";
    for (let i = 0; i < debugInfo.candidateLines.length; i++) {
        let l = debugInfo.candidateLines[i];
        candidateLinesHtml += `<line x1="${l.p1.x}" y1="${H-l.p1.y}" x2="${l.p2.x}" y2="${H-l.p2.y}" stroke="yellow" stroke-width="3" />`;
    }
    for (let i = 0; i < debugInfo.candidatePoints.length; i++) {
        let p = debugInfo.candidatePoints[i];
        candidatePointsHtml += `<circle stroke="none" fill="yellow" r="5" cx="${p.x}" cy="${H-p.y}" />`;
    }
    CANDIDATE_POINTS_ELEMENT.innerHTML = candidatePointsHtml;
    CANDIDATE_LINES_ELEMENT.innerHTML = candidateLinesHtml;
    if (debugInfo.touchInfo && debugInfo.touchInfo.p) {
        let tp = debugInfo.touchInfo.p;
        let tl = debugInfo.touchInfo.l;
        NEAREST_POINT_ELEMENT.innerHTML = `<circle stroke="none" fill="red" r="5" cx="${tp.x}" cy="${H-tp.y}" />`;
        NEAREST_LINE_ELEMENT.innerHTML = `<line x1="${tl.p1.x}" y1="${H-tl.p1.y}" x2="${tl.p2.x}" y2="${H-tl.p2.y}" stroke="red" stroke-width="3"/>`;
    }
    else {
        NEAREST_POINT_ELEMENT.innerHTML = "";
        NEAREST_LINE_ELEMENT.innerHTML = "";
    }
    DA_ELEMENT.textContent = "da: " + debugInfo.da;
    DX_ELEMENT.textContent = "dx: " + debugInfo.dx;
    DY_ELEMENT.textContent = "dy: " + debugInfo.dy;
}

// Run

let last = Date.now();
let circle = Circle(CX, CY, CR, MAX_SQ_DIST);

let loop = () => {
    let now = Date.now();
    let dt = (now - last);

    circle.update(lines, down["ArrowLeft"], down["ArrowRight"], down["Space"], dt);
    CIRCLE_ELEMENT.setAttribute("transform", `translate(${circle.x()} ${H-circle.y()})`);
    displayDebugInfo(circle.debugInfo());

    requestAnimationFrame(loop);
    last = now;
}

loop();