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

let generateSine = (points, xmin, ymin, xmax, ymax, yoffset, lineLength) => {
    for (var i = xmin; i < xmax; i += lineLength) {
        var diff = (ymax - ymin) / 2;
        var y = yoffset + diff * Math.sin(i);
        points.push( {x:i,y:y} );
    }
}

let generateMountain = (xmin, ymin, xmax, ymax, lineLength) => {
    let points = [{x:0,y:800}];
    generateSine(points, xmin, ymin, xmax, ymax, 400, lineLength);
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

let generateBlockers = blockers => {
    let s = "";
    blockers.forEach(b => {
        s += `<rect x="${b.left}" y="${b.top}" width="${b.right-b.left}" height="800" fill="black" opacity="0.1" />`
    });
    return s;
}
