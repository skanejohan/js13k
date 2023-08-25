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

    let createCircle = (color, fill) => {
        var sprite = createSprite(200, 200);
        var ctx = sprite.getContext("2d");
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(100, 100, 100, 0, 2 * Math.PI);
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
        sprites.sprites.bg_village = createCircle("#244012", true);
        sprites.sprites.bg_trebuchet = createCircle("#5ca82d", true);
        sprites.sprites.bg_village_range = createCircle("#38631c", true);
        sprites.sprites.bg_trebuchet_range = createCircle("#486F38", true);

        sprites.sprites.fg_trebuchet = createCircle("black", false);
        sprites.sprites.fg_village = createCircle("black", false);
        sprites.sprites.fr_normal = createHex("#1F6420", false);
        sprites.sprites.fr_trebuchet_load_or_move = createHex("#c3cc1f", false);
        sprites.sprites.fr_trebuchet_fire = createHex("#a1625f", false);
    }

    return sprites.sprites[name];
}
