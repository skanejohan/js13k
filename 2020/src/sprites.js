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

let Overlay = () => kontra.Sprite({
    render() {
        
        switch(gameContext.gameState) {
            case GameState.IDLE:
                this.context.fillStyle = "black";
                this.context.fillRect(0, 0, dimensions.w, dimensions.h);
                this.context.fillStyle = "white";
                this.context.font = "24px Arial";      
                this.context.textAlign = "center";  
                this.context.fillText("404", dimensions.cx, 170);
                this.context.fillText("Click to play", dimensions.cx, 250);
                break;
            case GameState.GAMEOVER:
                this.context.fillStyle = "black";
                this.context.fillRect(0, 0, dimensions.w, dimensions.h);
                this.context.fillStyle = "white";
                this.context.font = "24px Arial";      
                this.context.textAlign = "center";  
                this.context.fillText("GAME OVER", dimensions.cx, 300);
                break;
            case GameState.WELLDONE:
                this.context.fillStyle = "black";
                this.context.fillRect(0, 0, dimensions.w, dimensions.h);
                this.context.fillStyle = "white";
                this.context.font = "24px Arial";      
                this.context.textAlign = "center";  
                this.context.fillText("WELL DONE - ANOTHER MISSING LINK FOUND", dimensions.cx, 300);
                break;
            case GameState.PLAYING:
                this.context.fillStyle = "black";
                this.context.fillRect(0, 0, dimensions.w, topRowHeight);

                var gradient = this.context.createLinearGradient(0, 0, dimensions.w, 0);
                gradient.addColorStop(0, "red");
                gradient.addColorStop(0.5, "yellow");
                gradient.addColorStop(1, "green");
                this.context.fillStyle = gradient;
                this.context.fillRect(10, 20, (dimensions.w - 20) * gameContext.energy / 500, 60);

                this.context.fillStyle = "black";
                this.context.beginPath();
                this.context.arc(dimensions.cx, 50, 50, 0, Math.PI*2);
                this.context.fill();

                this.context.fillStyle = gameContext.score > 404 ? "red" : "green";
                this.context.beginPath();
                this.context.arc(dimensions.cx, 50, 40, 0, Math.PI*2);
                this.context.fill();

                this.context.font = "28px Arial";      
                this.context.textAlign = "center";  
                this.context.fillStyle = gameContext.score > 404 ? "white" : "black";
                this.context.fillText(404 - gameContext.score, dimensions.cx, 60);
            
                break;
        }
    }
});

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
