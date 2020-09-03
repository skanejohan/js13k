let Environment = (x, y, col1, col2, radius) => kontra.Sprite({
    x: x,
    y: y,
    anchor: {x: 0.5, y: 0.5},

    render() {
        var grd = this.context.createRadialGradient(0, 0, 0, 0, 0, radius);
        grd.addColorStop(0, col1);
        grd.addColorStop(1, col2);
        this.context.fillStyle = grd;
        this.context.beginPath();
        this.context.arc(0, 0, radius, 0, Math.PI*2);
        this.context.fill();
    },

    update() {
        this.x += gameContext.scrollX;
        this.y += gameContext.scrollY;
    },
});
