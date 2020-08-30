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
    });
}

let Car = (x, y) => kontra.Sprite({
    x: x,
    y: y,
    xf: x,
    yf: y,
    width: 60,
    height: 30,
    rotationDeg: 0, 
    anchor: {x: 0.5, y: 0.5},
    frontLeft: {},
    frontRight: {},
    rearLeft: {},
    rearRight: {},

    render() {
        this.context.fillStyle = "green";
        this.context.fillRect(0, 0, 60, 30);
        this.context.fillStyle = "white";
        this.context.fillRect(0, 10, 60, 4);
        this.context.fillRect(0, 16, 60, 4);
        this.context.fillStyle = "#222222";
        this.context.fillRect(10, 2, 8, 26);
        this.context.fillRect(30, 2, 12, 26);
        this.context.fillRect(53, 2, 5, 8);
        this.context.fillRect(53, 20, 5, 8);
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
        let diag = Math.sqrt(30*30+15*15);
        let angle1 = Math.atan(1/2);
        let angle2 = Math.PI/2 + Math.atan(2);
        this.frontLeft = {
            x: this.x - diag * Math.cos(angle2 + this.rotation),
            y: this.y - diag * Math.sin(angle2 + this.rotation),
        };
        this.frontRight = {
            x: this.x + diag * Math.cos(angle1 + this.rotation),
            y: this.y + diag * Math.sin(angle1 + this.rotation),
        };
        this.rearRight = {
            x: this.x + diag * Math.cos(angle2 + this.rotation),
            y: this.y + diag * Math.sin(angle2 + this.rotation),
        };
        this.rearLeft = {
            x: this.x - diag * Math.cos(angle1 + this.rotation),
            y: this.y - diag * Math.sin(angle1 + this.rotation),
        };
        if (kontra.keyPressed('left')) {
            this.rotationDeg -= 2;
        }
        else if (kontra.keyPressed('right')) {
            this.rotationDeg += 2;
        }
        this.rotation = kontra.degToRad(this.rotationDeg);
        this.drive(3);
    }
});

let EnergyBar = (x, y, w, h) => kontra.Sprite({
    x: x,
    y: y,
    w: w,
    h: h,
    value: 500,
    ticksBetweenUpdates: 10,

    update() {
        if (gameContext.tick % this.ticksBetweenUpdates == 0 && gameContext.energyBar.value < 500) {
            this.value++;
        }
    },

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
        this.context.textAlign = "center";  
        
        switch(gameContext.gameState) {
            case GameState.IDLE:
                this.context.fillText("404", cx, 170);
                this.context.fillText("Click to play", cx, 250);
                break;
            case GameState.GAMEOVER:
                this.context.fillText("GAME OVER", cx, 300);
                break;
            case GameState.PLAYING:
                this.context.textAlign = "left";  
                this.context.fillText(`TARGET SCORE: 404`, 100, 100);
                this.context.fillText(`SCORE: ${gameContext.score}`, 500, 100);
                this.context.fillText(`TIME: ${Date.now() - gameContext.startTime}`, 900, 100);
                //best time
                break;
        }
    }
});

let Coin = (x, y, value, ticksToLive) => kontra.Sprite({
    x: x,
    y: y,
    anchor: {x: 0.5, y: 0.5},
    value: value,
    ticksToLive: ticksToLive,

    render() {
        this.context.fillStyle = this.value < 0 ? "red" : "green";
        this.context.beginPath();
        this.context.arc(0, 0, 30, 0, Math.PI*2);
        this.context.fill();

        this.context.font = "24px Arial";      
        this.context.textAlign = "center";  
        this.context.fillStyle = this.value < 0 ? "white" : "black";
        this.context.fillText(Math.abs(value), 0, 8);
    },

    update() {
        this.x += gameContext.scrollX;
        this.y += gameContext.scrollY;
        this.ticksToLive--;
    },

    alive() {
        return this.ticksToLive > 0;
    },

    inside(p) {
        return (p.x-this.x) * (p.x-this.x) + (p.y-this.y) * (p.y-this.y) < 900;
    },

});