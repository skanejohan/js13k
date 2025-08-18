let Circle = (x, y, r, maxSqDist) => {
    let da = 0;
    let dx = 0;
    let dy = 0;
    let p = P(x, y);
    let rsq = r * r * 1.1; // Slightly more than radius
    let touchInfo = undefined;
    let debugInfo = undefined;

    let calcTouchInfo = (p, lines) => {
        let [ti, di] = calculateTouchInfo(p, lines, rsq, maxSqDist);
        if (ti) {
            if (samePoint(ti.p, ti.l.p2) && da < 0) { // When moving right, select the right-most line when the nearest point is an endpoint
                let l = lines.find(l => samePoint(ti.p, l.p1));
                ti = l ? { p : p, l : l, previousLine : ti.l } : undefined;
            }
            else if (samePoint(ti.p, ti.l.p1) && da > 0) { // When moving left, select the left-most line when the nearest point is an endpoint
                let l = lines.find(l => samePoint(ti.p, l.p2));
                ti = l ? { p : p, l : l, previousLine : ti.l } : undefined;
            }
            else {
                ti.previousLine = ti.l;
            }
        }
        return [ti, di];
    }

    let update = (lines, left, right, stop, dt) => {
        if (!touchInfo) { // We are in the air - increase dy, and let the keys affect da.
            if (left) { da += 2; }
            if (right) { da -= 2; }
            if (stop) { da = 0; }
            dy += 2;
        } else { // On ground
            if (left) { da += 1; }
            if (right) { da -= 1; }
            if (stop) { da = 0; }
            da += Math.sin(touchInfo.l.v);
            dx = -da * Math.cos(touchInfo.l.v);
            dy = da * Math.sin(touchInfo.l.v);
        }

        let [ti, _] = calcTouchInfo(P(p.x + dx * (dt / 100), p.y - dy * (dt / 100)), lines);
        if (ti && ti.l == ti.previousLine) { // We are on a line - place the circle so that it touches the touch point
            p.x = ti.p.x - Math.trunc(r * Math.sin(ti.previousLine.v));
            p.y = ti.p.y + Math.trunc(r * Math.cos(ti.previousLine.v));
        }
        else { // We are in the air - update x and y according to dx and dy
            p.x += dx * (dt / 100);
            p.y -= dy * (dt / 100);
        }

        [touchInfo, debugInfo] = calcTouchInfo(p, lines);
        debugInfo.da = da;
        debugInfo.dx = dx;
        debugInfo.dy = dy;
    }

    return {
        update: update,
        x : () => p.x,
        y : () => p.y,
        debugInfo : () => debugInfo
    }
}