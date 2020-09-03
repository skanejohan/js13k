drawOverlay = (gameContext, ctx) => {
    switch(gameContext.gameState) {
        case GameState.IDLE: 
            _background(ctx);
            _overlayText("404", 170, ctx);
            _overlayText("Click to play", 250, ctx);
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
            drawCircle(dimensions.cx, 50, 40, 0, "", gameContext.score > 404 ? "red" : "green", ctx)
            fillText(404 - gameContext.score, dimensions.cx, 60, "28px Arial", "center", gameContext.score > 404 ? "white" : "black", ctx);
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
