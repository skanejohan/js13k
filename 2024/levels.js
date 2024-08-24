let LineAndPoint = () => {
    return {
        line: { x1 : 0, y1: 0, x2 : 0, y2: 0, x: 0 },
        point: { x : 0, y : 0 }
    }
}

let addSkier = (x, y, dx) => {
    return {
        x: x,
        y: y,
        dx: dx,
        lp: LineAndPoint()    
    }
}


let l1 = {
    points: [{x:0,y:500}, {x:500,y:500}, {x:700,y:400},  {x:800,y:200}, {x:900,y:100}, {x:1200,y:200}, {x:1500,y:200}, {x:1800,y:300}, {x:1900,y:500}, {x:2400,y:500}],
    minX: 200,
    maxX: 2100
}

let l2 = () => {
    return {
        points: generateMountain(100, 500, 20000, 700, 50),
        minX: 200,
        maxX: 19000,
        skiers: [
            addSkier(900, 480, 1), addSkier(2100, 480, 5), addSkier(3300, 480, -10), addSkier(4500, 480, -5), addSkier(5700, 480, 10),
            addSkier(6800, 480, -5), addSkier(8000, 480, 5), addSkier(9200, 480, 10), addSkier(10400, 480, -10), addSkier(11600, 480, -5),
            addSkier(12700, 480, 10), addSkier(13900, 480, -5), addSkier(15100, 480, 10)
        ],
        blockers: []
    }
}

let l3 = () => {
    let points = [{x:0,y:800}];
    generateSine(points, 100, 500, 2000, 700, 600, 50);
    generateSine(points, 2001, 500, 10000, 700, 200, 50);
    points.push( {x:20000,y:800} );

    return {
        points: points,
        minX: 200,
        maxX: 9000,
        skiers: [
        ],
        blockers: [{left:1900, right:2200, top: 500}]
    }
}

let l4 = () => {
    let points = [{x:0,y:800}];
    points.push( {x:0,y:400} );
    points.push( {x:2000,y:400});
    points.push( {x:2000,y:200});
    points.push( {x:20000,y:400} );
    points.push( {x:20000,y:800} );

    return {
        points: points,
        minX: 200,
        maxX: 19000,
        skiers: [
            // {x:900,y:480,dx:1}, {x:2100,y:480,dx:5}, {x:3300,y:480,dx:-10}, {x:4500,y:480,dx:-5}, {x:5700,y:480,dx:10},
            // {x:6800,y:480,dx:-5}, {x:8000,y:480,dx:5}, {x:9200,y:480,dx:10}, {x:10400,y:480,dx:-10}, {x:11600,y:480,dx:-5},
            // {x:12700,y:480,dx:10}, {x:13900,y:480,dx:-5}, {x:15100,y:480,dx:10}
        ],
        blockers: []
    }
}