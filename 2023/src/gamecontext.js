var gameContext = {
    gameState: GameState.IDLE,
    mousePos: { x : 0, y : 0 },
    msRemaining: 0,
    villageCount: 1, 
    trebuchetCount: 1,

    update(ms) {
        if (this.msRemaining > 0)
        {
            this.msRemaining -= ms;
            if (this.msRemaining <= 0)
            {
                if (this.gameState == GameState.LEVELWON)
                {
                    this.setGameState(GameState.PLAYING);
                }
                else if (this.gameState == GameState.GAMEOVER)
                {
                    this.setGameState(GameState.IDLE);
                }
                return;
            }
        }
        
        if (this.gameState == GameState.PLAYING) {
            board.update(ms, this.mousePos);
        }
    },

    render() {
        function drawSprite(sprite, pos, scale, alpha) {
            var a = alpha || 1.0;
            var s = scale || 1;
            var w = sprite.width * s;
            var h = sprite.height * s;
            var left = (pos.x - w / 2) / s;
            var top = (pos.y - h / 2) / s;
            context.save();
            context.scale(s, s);
            context.globalAlpha = a;
            context.drawImage(sprite, left, top);
            context.restore();
        }

        drawing.fillRect(0, 0, 1200, 800, "#407122");
       
        switch (this.gameState)
        {
            case GameState.IDLE:
                drawing.fillText("IDLE", 600, 400, {textAlign: "center"});
                break;
            case GameState.PLAYING:
                board.draw(drawSprite);
                break;
            case GameState.LEVELWON:
                drawing.fillText("LEVEL WON", 600, 400, {textAlign: "center"});
                break;
            case GameState.GAMEOVER:
                drawing.fillText("GAME OVER", 600, 400, {textAlign: "center"});
                break;
            default:
                break;
        }
    },

    click()
    {
        switch (this.gameState)
        {
            case GameState.IDLE:
                this.setGameState(GameState.PLAYING);
                break;
            case GameState.PLAYING:
                board.click(this.mousePos);
                if (board.levelWon()) {
                    this.setGameState(GameState.LEVELWON);
                }
                if (board.levelLost()) {
                    this.setGameState(GameState.GAMEOVER);
                }
                break;
            default:
                break;
        }
    },

    mouseMove(e)
    {
        var rect = canvas.getBoundingClientRect();
        this.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                board.reset(this.villageCount, this.trebuchetCount);
                this.villageCount++;
                this.trebuchetCount++;
                this.gameState = GameState.PLAYING;
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                break;
            case GameState.LEVELWON:
                this.gameState = GameState.LEVELWON;
                this.msRemaining = 400;
                break;
            case GameState.GAMEOVER:
                this.villageCount = 1;
                this.trebuchetCount = 1;
                this.gameState = GameState.GAMEOVER;
                this.msRemaining = 1000;
            default:
                this.gameState = newState;
        }
    },
}