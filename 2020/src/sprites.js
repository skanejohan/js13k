let Straight = (x, y, rotation) => {
    console.log(`Straight at ${x},${y} with rotation ${rotation}`)
    return kontra.Sprite({
        x: x,
        y: y,
        rotation: kontra.degToRad(rotation),
        render() {
            this.context.strokeStyle = "#aaaaaa";
            this.context.fillStyle = "#aaaaaa";
            this.context.fillRect(0, 0, 100, 100);
            this.context.fillStyle = "white";
            this.context.fillRect(0, 47, 20, 6);
            this.context.fillRect(30, 47, 40, 6);
            this.context.fillRect(80, 47, 20, 6);
        },
        update() {
            this.x += gameContext.scrollX;
            this.y += gameContext.scrollY;
        }
    });
}

let Curve = (x, y, rotation) => {
    console.log(`Curve at ${x},${y} with rotation ${rotation}`)
    return kontra.Sprite({
        x: x,
        y: y,
        rotation: kontra.degToRad(rotation),
        render() {
            this.context.fillStyle = "#aaaaaa";
            this.context.strokeStyle = '#aaaaaa';
            this.context.beginPath();
            this.context.arc(0, 100, 100, 3*Math.PI/2, Math.PI*2);
            this.context.lineTo(0, 100);
            this.context.lineTo(0, 0);
            this.context.fill();

            this.context.fillStyle = "white";
            this.context.strokeStyle = 'white';
            this.context.beginPath();
            this.context.arc(0, 100, 53, 3*Math.PI/2, Math.PI*2);
            this.context.lineTo(0, 100);
            this.context.lineTo(0, 0);
            this.context.fill();

            this.context.fillStyle = "#aaaaaa";
            this.context.strokeStyle = '#aaaaaa';
            this.context.beginPath();
            this.context.arc(0, 100, 47, 3*Math.PI/2, Math.PI*2);
            this.context.lineTo(0, 100);
            this.context.lineTo(0, 0);
            this.context.fill();
        },
        update() {
            this.x += gameContext.scrollX;
            this.y += gameContext.scrollY;
        }
    });
}

let Car = (x, y) => kontra.Sprite({
    x: x,
    y: y,
    width: 120,
    height: 60,
    rotationDeg: 0, 
    anchor: {x: 0.5, y: 0.5},
    render() {
        this.context.fillStyle = "green";
        this.context.fillRect(0, 0, 120, 60);
        this.context.fillStyle = "white";
        this.context.fillRect(0, 21, 120, 8);
        this.context.fillRect(0, 31, 120, 8);
        this.context.fillStyle = "#222222";
        this.context.fillRect(20, 2, 15, 56);
        this.context.fillRect(60, 2, 25, 56);
        this.context.fillRect(110, 4, 8, 15);
        this.context.fillRect(110, 41, 8, 15);
    },
    update() {
        if (kontra.keyPressed('left')) {
            this.rotationDeg -= 2;
        }
        else if (kontra.keyPressed('right')) {
            this.rotationDeg += 2;
        }
        this.rotation = kontra.degToRad(this.rotationDeg);
        //return;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        var nextX = Math.round(this.x + 3 * cos);
        //var nextX = gameContext.scrollX;
        if (nextX > maxX) {
            gameContext.scrollX = maxX - nextX;
            gameContext.x += gameContext.scrollX;
            this.x = maxX;
        }
        else if (nextX < minX) {
            gameContext.scrollX = minX - nextX;
            gameContext.x += gameContext.scrollX;
            this.x = minX;
        }
        else {
            gameContext.scrollX = 0;
            this.x = nextX;
        }

        var nextY = Math.round(this.y + 3 * sin);
        //var nextY = gameContext.scrollY;
        if (nextY > maxY) {
            gameContext.scrollY = maxY - nextY;
            gameContext.y += gameContext.scrollY;
            this.y = maxY;
        }
        else if (nextY < minY) {
            gameContext.scrollY = minY - nextY;
            gameContext.y += gameContext.scrollY;
            this.y = minY;
        }
        else {
            gameContext.scrollY = 0;
            this.y = nextY;
        }
    }
});
