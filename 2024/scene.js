let getScene = (points, minX, maxX) => {

    let _minX = minX;
    let _maxX = maxX;

    let _lines = [];
    let _points = [];
    let _controlPoints = [];

    let R = 45;

    let _addPoint = (p) => {
        _points.push(p);
        if (_points.length > 1) {
            let pp = _points[_points.length-2]; // Previous point
            let w = p.x - pp.x;
            let h = p.y - pp.y;
            let a = h;
            let b = -w;
            let line = { 
                x1: pp.x,
                y1: pp.y, 
                x2: p.x, 
                y2: p.y,
                a: a,
                b: -Math.abs(b),
                c: a * p.x + b * p.y,
                v: Math.atan(h/w) }
            line.cx1 = line.x1 + Math.sin(line.v) * R;
            line.cy1 = line.y1 - Math.cos(line.v) * R;
            line.cx2 = line.x2 + Math.sin(line.v) * R;
            line.cy2 = line.y2 - Math.cos(line.v) * R;
            _lines.push(line);
        }
    }

    let _calculateControlPoints = () => {
        _controlPoints.push( { x: _lines[0].cx1, y : _lines[0].cy1 });
        for (let i = 1; i < _lines.length; i++) {
            let v = (_lines[i-1].v + _lines[i].v) / 2;
            let x = _lines[i-1].x2 + Math.sin(v) * R;
            let y = _lines[i-1].y2 - Math.cos(v) * R;
            _controlPoints.push( { x: x, y : y });
        }
        _controlPoints.push( { x: _lines[_lines.length-1].cx2, y : _lines[_lines.length-1].cy2 });
    }

    let _polygon = (showHoveredLine, showControlPoints) => {
        let p = generatePolygon(_points, "white");
        if (showHoveredLine) {
            p += `<line x1="0" y1="0" x2="0" y2="0" stroke-width="4" stroke="black" id="hoveredLine" />`;
        }
        if (showControlPoints) {
            _controlPoints.forEach(cp => p += `<circle cx="${cp.x}" cy="${cp.y}" r="6" fill="green" />`);
        }
        return p;
    }

    let _findLine = x => {
        for (i = 0; i < points.length-1; i++) {
            if (x < points[i+1].x) {
                return { 
                    x1: points[i].x, 
                    y1: points[i].y, 
                    x2: points[i+1].x, 
                    y2: points[i+1].y 
                }
            }
        }
    }
    
    points.forEach(p => _addPoint(p));
    _calculateControlPoints();

    return {
        findLine: _findLine,
        polygon: _polygon,
        points: _points,
        minX: _minX,
        maxX: _maxX
    }
}
