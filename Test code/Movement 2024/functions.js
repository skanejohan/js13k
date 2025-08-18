// Point and line constructors
let P = (x, y) => { return { x: Math.round(x), y: Math.round(y) }; }
let L = (x1, y1, x2, y2) => { return { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 }, v: Math.atan((y2-y1)/(x2-x1)) }; }

let samePoint = (p1, p2) => p1.x == p2.x && p1.y == p2.y;

// let getLineStartingAt = (lines, p) => lines.find(l => samePoint(l.p1, p));
// let getLineEndingAt = (lines, p) => lines.find(l => samePoint(l.p2, p));

// Squared distance between two points
let sqDist = (p1, p2) => (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);

// Calculate the nearest point on a line
let findNearestPointOnLine = (p, l) => { 
    let atob = P(l.p2.x - l.p1.x, l.p2.y - l.p1.y);
    let atop = P(p.x - l.p1.x, p.y - l.p1.y);
    let len = (atob.x * atob.x) + (atob.y * atob.y);
    let dot = (atop.x * atob.x) + (atop.y * atob.y);
    let t = Math.min(1, Math.max(0, dot / len));
    dot = ((l.p2.x - l.p1.x) * (p.y - l.p1.y)) - ((l.p2.y - l.p1.y) * (p.x - l.p1.x));
    return P(l.p1.x + (atob.x * t), l.p1.y + (atob.y * t));
}

// Is the line close enough, meaning is the squared distance from the point to either endpoint closer than distSquared?
let lineCloseEnough = (l, p, distSquared) => sqDist(l.p1, p) < distSquared || sqDist(l.p2, p) < distSquared;

// Among the given lines, calculate the point that is closest to the center point cp. If that point is close enough (with
// the squared distance closer than distSquared, return the point and the line to which it belongs. If not, return undefined.
let calculateTouchInfo = (cp, lines, maxSqDistCircle, maxSqDistLine) => {
    let touchInfo = undefined;
    let debugInfo = { candidateLines : [], candidatePoints : [] };
    let dist = Number.MAX_SAFE_INTEGER;
    var candidates = lines.filter(l => lineCloseEnough(l, cp, maxSqDistLine));
    for(let i = 0; i < candidates.length; i++) {
        let l = candidates[i];
        let p = findNearestPointOnLine(cp, l);
        debugInfo.candidateLines.push(l);
        debugInfo.candidatePoints.push(p);
        let d = sqDist(p, cp);
        if (d < dist && d < maxSqDistCircle) {
            dist = d;
            touchInfo = { 
                p : p, 
                l : l 
            };
        }
    }
    debugInfo.touchInfo = touchInfo;
    return [ touchInfo, debugInfo];
}
    
