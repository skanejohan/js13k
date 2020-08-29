let Straight = (x, y, rotation) => {
    return kontra.Sprite({
        x: x,
        y: y,
        rotation: kontra.degToRad(rotation),
        rectangle() {
            switch(rotation) {
                case 0:         
                    return { x: this.x, y: this.y, w: 100, h: 100 };
                case 90:
                    return { x: this.x-100, y: this.y, w: 100, h: 100 };
                case 180:
                    return { x: this.x-100, y: this.y-100, w: 100, h: 100 };
                default:
                    return { x: this.x, y: this.y-100, w: 100, h: 100 };
            }
        },
        renderRectangle(color) {
            this.context.strokeStyle = color;
            var {x, y, w, h} = this.rectangle();
            this.context.strokeRect(x, y, w, h);
        },
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
        },
        inside(p) {
            var r = this.rectangle();
            return !(p.x < r.x || p.x > r.x + r.w || p.y < r.y || p.y > r.y + r.h);
        },
        outside(x, y) {
            var rr = this.rectangle();
            if (rotation == 0 || rotation == 180) {
                return !(x < rr.x || x > rr.x + rr.w) && (y < rr.y || y > rr.y + rr.h);

            }
            else {
                return (x < rr.x || x > rr.x + rr.w) && !(y < rr.y || y > rr.y + rr.h);
            }
        }
    });
}

let Curve = (x, y, rotation) => {
    return kontra.Sprite({
        x: x,
        y: y,
        rotation: kontra.degToRad(rotation),
        rectangle() {
            switch(rotation) {
                case 0:         
                    return { x: this.x, y: this.y, w: 100, h: 100 };
                case 90:
                    return { x: this.x-100, y: this.y, w: 100, h: 100 };
                case 180:
                    return { x: this.x-100, y: this.y-100, w: 100, h: 100 };
                default:
                    return { x: this.x, y: this.y-100, w: 100, h: 100 };
            }
        },
        renderRectangle(color) {
            this.context.strokeStyle = color;
            var {x, y, w, h} = this.rectangle();
            this.context.strokeRect(x, y, w, h);
        },
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
        },
        inside(p) {
            var rr = this.rectangle();
            var insideRectangle = !(p.x < rr.x || p.x > rr.x + rr.w || p.y < rr.y || p.y > rr.y + rr.h);
            if (insideRectangle) {
                switch(rotation) {
                    case 0:         
                        var dist = Math.sqrt((rr.x-p.x) * (rr.x-p.x) + (rr.y+100-p.y) * (rr.y+100-p.y));
                        break;
                    case 90:
                        var dist = Math.sqrt((rr.x-p.x) * (rr.x-p.x) + (rr.y-p.y) * (rr.y-p.y));
                        break;
                    case 180:
                        var dist = Math.sqrt((rr.x+100-p.x) * (rr.x+100-p.x) + (rr.y-p.y) * (rr.y-p.y));
                        break;
                    default:
                        var dist = Math.sqrt((rr.x+100-p.x) * (rr.x+100-p.x) + (rr.y+100-p.y) * (rr.y+100-p.y));
                }
                return dist < 100;
            }
            return false;
        },
        outside(x, y) {
            return false; // TODO
        }
    });
}

let Car = (x, y) => kontra.Sprite({
    x: x,
    y: y,
    xf: x,
    yf: y,
    width: 120,
    height: 60,
    rotationDeg: 0, 
    anchor: {x: 0.5, y: 0.5},
    collisionPoints() { // let update() calculate this!
        let diag = Math.sqrt(60*60+30*30);
        let angle1 = Math.atan(60/120);
        let angle2 = Math.PI/2 + Math.atan(120/60);
        let x1 = this.x - diag * Math.cos(angle1 + this.rotation);
        let y1 = this.y - diag * Math.sin(angle1 + this.rotation);
        let x2 = this.x + diag * Math.cos(angle1 + this.rotation);
        let y2 = this.y + diag * Math.sin(angle1 + this.rotation);
        let x3 = this.x - diag * Math.cos(angle2 + this.rotation);
        let y3 = this.y - diag * Math.sin(angle2 + this.rotation);
        let x4 = this.x + diag * Math.cos(angle2 + this.rotation);
        let y4 = this.y + diag * Math.sin(angle2 + this.rotation);
        return [ {x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4} ];
    },
    frontLeft() {
        return this.collisionPoints()[2];
    },
    frontRight() {
        return this.collisionPoints()[1];
    },
    rearLeft() {
        return this.collisionPoints()[0];
    },
    rearRight() {
        return this.collisionPoints()[3];
    },
    renderCollisionPoints() {
        this.renderCollisionPoint(this.frontLeft(), "red");
        this.renderCollisionPoint(this.frontRight(), "white");
        this.renderCollisionPoint(this.rearRight(), "green");
        this.renderCollisionPoint(this.rearLeft(), "blue");
        // this.context.fillStyle = "red";
        // this.collisionPoints().forEach(p => {
        //     this.context.beginPath();
        //     this.context.arc(p.x, p.y, 3, 0, Math.PI*2);
        //     this.context.fill();
        // });
    },
    renderCollisionPoint(p, color) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(p.x, p.y, 3, 0, Math.PI*2);
        this.context.fill();
    },
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
    rotateLeft() {
        this.rotationDeg -= 2;
    },
    rotateRight() {
        this.rotationDeg += 2;
    },
    drive(steps) {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        this.xf = this.xf + steps * cos;
        var nextX = Math.round(this.xf);
        if (nextX > maxX) {
            gameContext.scrollX = maxX - nextX;
            gameContext.x += gameContext.scrollX;
            this.xf = maxX;
            this.x = maxX;
        }
        else if (nextX < minX) {
            gameContext.scrollX = minX - nextX;
            gameContext.x += gameContext.scrollX;
            this.xf = minX;
            this.x = minX;
        }
        else {
            gameContext.scrollX = 0;
            this.x = nextX;
        }

        this.yf = this.yf + steps * sin;
        var nextY = Math.round(this.yf);
        if (nextY > maxY) {
            gameContext.scrollY = maxY - nextY;
            gameContext.y += gameContext.scrollY;
            this.yf = maxY;
            this.y = maxY;
        }
        else if (nextY < minY) {
            gameContext.scrollY = minY - nextY;
            gameContext.y += gameContext.scrollY;
            this.yf = minY;
            this.y = minY;
        }
        else {
            gameContext.scrollY = 0;
            this.y = nextY;
        }
    },
    update() {
        if (kontra.keyPressed('left')) {
            this.rotationDeg -= 2;
        }
        else if (kontra.keyPressed('right')) {
            this.rotationDeg += 2;
        }
        this.rotation = kontra.degToRad(this.rotationDeg);
        this.drive(3);
        //return;
    }
});

let EnergyBar = (x, y, w, h) => kontra.Sprite({
    x: x,
    y: y,
    w: w,
    h: h,
    value: 500,
    render() {
        if (this.value > 300) {
            this.context.fillStyle = "green";
        }
        else if (this.value > 100) {
            this.context.fillStyle = "yellow";
        }
        else {
            this.context.fillStyle = "red";
        }        
        this.context.fillRect(0, 0, w * this.value / 500, h);
    },
});

let Overlay = () => kontra.Sprite({
    render() {
        this.context.fillStyle = "white";
        this.context.font = "24px Arial";        
        if (gameContext.gameState == GameState.IDLE) {
            this.context.fillText("404", 325, 170);
            this.context.fillText("Click to play", 200, 250);
        }
        if (gameContext.gameState == GameState.LIFELOST) {
            this.context.fillText("GET READY", 325, 300);
        }
        if (gameContext.gameState == GameState.GAMEOVER) {
            this.context.fillText("GAME OVER", 325, 300);
        }
    },
});