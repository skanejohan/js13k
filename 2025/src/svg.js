function svgRect(x, y, w, h, fill) {
    let r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", x);
    r.setAttribute("y", y);
    r.setAttribute("width", w);
    r.setAttribute("height", h);
    r.setAttribute("fill", fill);
    return r;
}

function svgLine(x1, y1, x2, y2, stroke) {
    let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1);
    l.setAttribute("y1", y1);
    l.setAttribute("x2", x2);
    l.setAttribute("y2", y2);
    l.setAttribute("stroke", stroke);
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
