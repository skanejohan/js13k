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
            board.update(this.mousePos);
        }
    },

    render() {
        function drawSprite(sprite, x, y) {
            var left = x - sprite.width / 2;
            var top = y - sprite.height / 2;
            context.drawImage(sprite, left, top);
        }

        function drawText(text, x, y) {
            context.fillText(text, x, y);
        }

        context.fillStyle = "blue";
        context.fillRect(0, 0, 1200, 800);

        context.font = "24px Arial";      
        context.textAlign = "center";  
        context.fillStyle = "white";
        switch (this.gameState)
        {
            case GameState.IDLE:
                context.fillText("IDLE", 600, 400);
                break;
            case GameState.PLAYING:
                board.draw(drawSprite, drawText);
                break;
            case GameState.LEVELWON:
                context.fillText("LEVEL WON", 600, 400);
                break;
            case GameState.GAMEOVER:
                context.fillText("GAME OVER", 600, 400);
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