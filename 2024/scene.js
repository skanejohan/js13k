let generatePolygon = (ps, color) => {
    let x = 0;
    let s = '<polygon points="';
    ps.forEach(p => {
        s += `${p.x},${p.y} `;
        x = p.x;
    });
    s += `${x},800 0,800" fill="${color}" />`;
    return s;
}

let getScene = n => {

    let _points = points1();
    let _minX = 200;
    let _maxX = 2100;
    if (n == 2) {
        _points = points2();
        _minX = 200;
        _maxX = 19000;
        }
    let _polygon = generatePolygon(_points, "white") + `<line x1="0" y1="0" x2="0" y2="0" stroke-width="4" stroke="black" id="debug" />`;

    return {
        polygon: _polygon,
        points: _points,
        minX: _minX,
        maxX: _maxX
    }
}

let generateMountain = (ymin, ymax, color) => {
    let points = [{x:0,y:800}];
    for (var i = 100; i < 20000; i += 50) {
        var diff = (ymax - ymin) / 2;
        var y = 400 + diff * Math.sin(i);
        points.push( {x:i,y:y} );
    }
    points.push( {x:20000,y:800} );
    return points;
}

let points1 = () => [{x:0,y:500}, {x:500,y:500}, {x:700,y:400},  {x:800,y:200}, {x:900,y:100}, {x:1200,y:200}, {x:1500,y:200}, {x:1800,y:300}, {x:1900,y:500}, {x:2400,y:500}];
let points2 = () => generateMountain(500, 700);
