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
