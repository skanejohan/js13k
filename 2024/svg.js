let generatePolygon = (points, color) => {
    let x = 0;
    let s = '<polygon points="';
    points.forEach(p => {
        s += `${p.x},${p.y} `;
        x = p.x;
    });
    s += `${x},800 0,800" fill="${color}" />`;
    return s;
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

let generateSkiers = positions => {
    let s = "";
    let i = 0;
    positions.forEach(p => {
        s += `<use href="#skier" id="skier_${i}" />`;
        i++;
    });
    return s;
}
