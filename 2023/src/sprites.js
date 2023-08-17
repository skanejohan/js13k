let sprites = name => {

    let createSprite = (w, h) => {
        var sprite = document.createElement('canvas');
        sprite.width = w;
        sprite.height = h;
        return sprite;
    }
    
    let createHex = (color, fill) => {
        var s = HexSide;
        var h = s * Math.sin(30 * Math.PI / 180);
        var r = s * Math.cos(30 * Math.PI / 180);
        var sprite = createSprite(s + 2 * h + 4, 2 * r + 4);
        var ctx = sprite.getContext("2d");
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(h + 2, 0 + 2);
        ctx.lineTo(h + s + 2, 0 + 2);
        ctx.lineTo(h + s + h + 2, r + 2);
        ctx.lineTo(h + s + 2, r + r + 2);
        ctx.lineTo(h + 2, r + r + 2);
        ctx.lineTo(0 + 2, r + 2);
        ctx.lineTo(h + 2, 0 + 2);
        if (fill)
        {
            ctx.fill();
        }
        else
        {
            ctx.stroke();
        }
        return sprite;
    }

    if (typeof sprites.sprites == "undefined") {
        sprites.sprites = {};
        sprites.sprites.grass = createHex("#407122", true);
        sprites.sprites.normal = createHex("#1F6420", false);
        sprites.sprites.highlight = createHex("yellow", false);
        sprites.sprites.village = createHex("white", false);
        sprites.sprites.trebuchet = createHex("black", false);
    }

    return sprites.sprites[name];
}
