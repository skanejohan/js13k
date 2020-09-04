createEnvironment = (x, y, col1, col2, radius) => {
    return { x: x, y: y, col1: col1, col2: col2, radius: radius };
}

drawEnvironment = (e, ctx) => {
    ctx.translate(e.x, e.y);
    var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, e.radius);
    grd.addColorStop(0, e.col1);
    grd.addColorStop(1, e.col2);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, e.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.translate(-e.x, -e.y);
}

updateEnvironment = e => {
    e.x += gameContext.scrollX;
    e.y += gameContext.scrollY;
}
