let Point = (x, y) => {
    return { x: x, y : y }
}

let sine = (start, end) => {
    let points = [];
    for (var x = start; x <= end; x += 0.1) {
        points.push(Point(x - start, Math.sin(x*Math.PI)));
    }
    return points;
}

let LineAndPoint = () => {
    return {
        line: { x1 : 0, y1: 0, x2 : 0, y2: 0, x: 0 },
        point: { x : 0, y : 0 }
    }
}


let addSkier = (x, dx, mustBeLast) => {
    return {
        x: x,
        dx: dx,
        mustBeLast: mustBeLast,
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
            addSkier(900, 1), addSkier(2100, 5), addSkier(3300, -10), addSkier(4500, -5), addSkier(5700, 10),
            addSkier(6800, -5), addSkier(8000, 5), addSkier(9200, 10), addSkier(10400, -10), addSkier(11600, -5),
            addSkier(12700, 10), addSkier(13900, -5), addSkier(15100, 10)
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
    let points = [Point(0, 800), Point(0, 0), Point(500, 0), Point(500, 600)];
    points.push(Point(2000, 600));

    // First hill
    let slope = sine(3/2, 7/2);
    slope.forEach(p => { p.x = 2000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope);

    points.push(Point(3000, 600));

    // Second hill
    let slope2 = sine(3/2, 7/2);
    slope2.forEach(p => { p.x = 3000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope2);

    // Steep wall
    points.push(Point(4000, 600));
    points.push(Point(4000, 400));

    // First valley
    slope = sine(1/2, 5/2);
    slope.forEach(p => { p.x = 5000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope);

    // Second, third and fourth valley
    slope = sine(1/2, 13/2);
    slope.forEach(p => { p.x = 7000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope);

    // Fifth - deep - valley with two hills

    slope = sine(3/2, 7/2);
    slope.forEach(p => { p.x = 11500 + p.x * 250; p.y = 300 - 70 * p.y; });
    points.push(...slope);

    points.push(Point(12000, 400));
    points.push(Point(12000, 700));
    points.push(Point(12500, 700));
    points.push(Point(12500, 400));

    slope = sine(3/2, 7/2);
    slope.forEach(p => { p.x = 12600 + p.x * 250; p.y = 300 - 70 * p.y; });
    points.push(...slope);


    // Sixth - wide - valley
    slope = sine(1/2, 3/2);
    slope.forEach(p => { p.x = 14000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope);

    slope = sine(3/2, 5/2);
    slope.forEach(p => { p.x = 15000 + p.x * 350; p.y = 500 - 100 * p.y; });
    points.push(...slope);



    points.push( {x:20000,y:600} );
    points.push( {x:20000,y:800} );

    return {
        points: points,
        minX: 200,
        maxX: 19000,
        skiers: [
            addSkier(2500, 5), addSkier(2500, -10), addSkier(2500, 20),
            addSkier(3500, 15), 
            addSkier(5500, -15), 
            addSkier(7500, 15), 
            addSkier(8000, -15), 
            addSkier(8500, 15), 
            addSkier(12200, 3, true),
            addSkier(15200, 5), 
            addSkier(15200, 10), 
            addSkier(15200, -10), 
            addSkier(15200, -5)
        ],
        blockers: [{left:0, right:540, top: -20000}, {left:3960, right:4100, top: 410}, 
            {left:12000, right:12040, top: 410},
            {left:12460, right:12500, top: 410},
            {left:19000, right:20000, top: -20000}]
    }
}