function svgRect(x, y, w, h, fill) {
    let r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", x);
    r.setAttribute("y", y);
    r.setAttribute("width", w);
    r.setAttribute("height", h);
    r.setAttribute("fill", fill);
    return r;
}

function svgLine(x1, y1, x2, y2, stroke, strokeWidth = 1) {
    let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1);
    l.setAttribute("y1", y1);
    l.setAttribute("x2", x2);
    l.setAttribute("y2", y2);
    l.setAttribute("stroke", stroke);
    l.setAttribute("stroke-width", strokeWidth);
    return l;
}

function svgCircle(cx, cy, r, fill) {
    let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    c.setAttribute("fill", fill);
    return c;
}

function svgText(txt, x, y, color = "black", font = "Arial", size = 20) {
    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("fill", color);
    t.setAttribute("font-family", font);
    t.setAttribute("font-size", size);
    t.textContent = txt;
    return t;
}

function svgPath(path, color) {
    let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", color);
    return p;
}

function svgGroup() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
}

function svgAvatar(x, y) {
    return svgCircle(x, y, 18, "blue");
}

function svgCat(x, y) {
    return svgCircle(x, y, 18, "black");
}

function svgPortal(x, y) {
    return svgCircle(x, y, 18, "yellow");
}

function svgBadLuck(x, y) {
    return svgCircle(x, y, 18, "red");
}

function svgGoodLuck(x, y) {
    return svgCircle(x, y, 18, "white");
}

function svgHorseshoe(x, y) {
    return svgCircle(x, y, 18, "green");
}

function svgTower(x, y, activeLevel, opacity = 1.0) {
    let tower = svgGroup();
    let moon = svgCircle(x + 80, x + 100, 80, "red");
    moon.setAttribute("opacity", opacity);
    tower.appendChild(moon);
    for (let i = 0; i < _towerLevels.length; i++) {
        let l = x + _towerLevels[i][0] - 60;
        let r = x + _towerLevels[i][1] - 60;
        let t = i * 30 + 19;
        let b = t + 30;
        let s = `M ${l} ${t} L ${r} ${t} L ${r} ${b} L ${l} ${b} Z`;
        let color = (i === activeLevel) ? "yellow" : "#080001";
        let floor = svgPath(s, color);
        floor.setAttribute("opacity", opacity);
        tower.appendChild(floor);
    }
    return tower;
}

let _towerLevels = [
    [40, 130],
    [40, 140],
    [40, 140],
    [45, 135],
    [40, 140],
    [45, 145],
    [40, 140],
    [40, 140],
    [40, 140],
    [45, 145],
    [45, 145],
    [40, 150],
    [35, 150],
    [30, 155],
    [30, 155],
    [25, 155],
    [20, 160],
    [15, 165],
    [10, 170],
    [5, 175]
]
