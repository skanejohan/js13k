drawOverlay = (gameContext, ctx) => {
    switch(gameContext.gameState) {
        case GameState.IDLE: 
            _background(ctx);
            fillText("404", dimensions.cx, 170, "40px Arial", "center", "white", ctx);
            _overlayText("target score is 404", 300, ctx);
            _overlayText("use left and right arrow to steer, space to boost", 340, ctx);
            _overlayText("hit coins for positive (green) or negative (red) score", 380, ctx);
            _overlayText("preserve energy by staying on the road and by hitting coins", 420, ctx);
            _overlayText("Click to play", 550, ctx);
            break;
        case GameState.GAMEOVER:
            _background(ctx);
            _overlayText("GAME OVER", 300, ctx);
            break;
        case GameState.WELLDONE:
            _background(ctx);
            _overlayText("WELL DONE - ANOTHER MISSING LINK FOUND", 300, ctx);
            break;
        case GameState.PLAYING:
            fillRect(0, 0, dimensions.w, topRowHeight, "black", ctx);
            fillRect(10, 20, (dimensions.w - 20) * gameContext.energy / 500, 60, _energyBarGradient(ctx), ctx);
            drawCircle(dimensions.cx, 50, 50, 0, "", "black", ctx)
            drawCircle(dimensions.cx, 50, 40, 0, "", gameContext.scoreNeeded() < 0 ? "red" : "green", ctx)
            fillText(gameContext.scoreNeeded(), dimensions.cx, 60, "28px Arial", "center", gameContext.score > 404 ? "white" : "black", ctx);
            break;
    }
}

let _background = ctx => fillRect(0, 0, dimensions.w, dimensions.h, "black", ctx);

let _overlayText = (text, y, ctx) => fillText(text, dimensions.cx, y, "24px Arial", "center", "white", ctx);

let _energyBarGradient = ctx => {
    var g = ctx.createLinearGradient(0, 0, dimensions.w, 0);
    g.addColorStop(0, "red");
    g.addColorStop(0.5, "yellow");
    g.addColorStop(1, "green");
    return g;
}
