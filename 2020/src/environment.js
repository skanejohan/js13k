createTree = (x, y) => {

    let rot = Math.random() * Math.PI * 2;

    return { 
        x: x, 
        y: y,
        draw: () => {
            context.rotate(rot);
            drawCircle(0, 0, 40, 2, "#166e16", "#166e16", context);
            drawCircle(10, 20, 30, 2, "#166e16", "#166e16", context);
            drawCircle(35, 10, 15, 2, "#166e16", "#166e16", context);
            drawCircle(5, -35, 15, 2, "#166e16", "#166e16", context);
            drawCircle(-15, 0, 30, 2, "#166e16", "#166e16", context);
            context.rotate(-rot);
        } 
    };
}

createHouse = (x, y) => {

    let drawPane = (x, y) => {
        context.fillRect(x, y, 14, 6);
        context.strokeRect(x, y, 14, 6);
    }

    let drawSmallPane = (x, y) => {
        context.fillRect(x, y, 7, 6);
        context.strokeRect(x, y, 7, 6);
    }

    let drawEvenRow = (x, y) => {
        drawPane(x+0, y);
        drawPane(x+14, y);
        drawPane(x+28, y);
        drawSmallPane(x+42, y);
    }

    let drawOddRow = (x, y) => {
        drawSmallPane(x+0, y);
        drawPane(x+7, y);
        drawPane(x+21, y);
        drawPane(x+35, y);
    }

    let drawHalf = (x) => {
        drawEvenRow(x, 0);
        drawOddRow(x, 7);
        drawEvenRow(x, 14);
        drawOddRow(x, 21);
        drawEvenRow(x, 28);
        drawOddRow(x, 35);
        drawEvenRow(x, 42);
        drawOddRow(x, 49);
        drawEvenRow(x, 56);
        drawOddRow(x, 63);
        drawEvenRow(x, 70);
        drawOddRow(x, 77);
        drawEvenRow(x, 84);
        drawOddRow(x, 91);
   }

    return {
        x: x,
        y: y,
        draw: () => {
            context.lineWidth = 2;
            context.strokeStyle = "#2c2c2c";
            context.fillStyle = "#585858";
            drawHalf(0);
            context.strokeStyle = "#111111";
            context.fillStyle = "#444444";
            drawHalf(50);
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.strokeRect(0, 0, 49, 97);
            context.strokeRect(50, 0, 49, 97);
        }
    }
}

createEnvironment = (x, y, col1, col2, radius) => {
    return { 
        x: x, 
        y: y, 
        draw: () => {
            var grd = context.createRadialGradient(0, 0, 0, 0, 0, radius);
            grd.addColorStop(0, col1);
            grd.addColorStop(1, col2);
            context.fillStyle = grd;
            context.beginPath();
            context.arc(0, 0, radius, 0, Math.PI*2);
            context.fill();
        }
    }
}

drawEnvironment = (e) => {
    context.translate(e.x, e.y);
    e.draw();
    context.translate(-e.x, -e.y);
}

updateEnvironment = e => {
    e.x += gameContext.scrollX;
    e.y += gameContext.scrollY;
}
