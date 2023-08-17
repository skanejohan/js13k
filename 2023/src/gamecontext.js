var gameContext = {
    gameState: GameState.IDLE,
    mousePos: { x : 0, y : 0 },

    update(dt) {
    },

    render() {
        function drawSprite(sprite, x, y) {
            var left = x - sprite.width / 2;
            var top = y - sprite.height / 2;
            context.drawImage(sprite, left, top);
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
                board.draw(drawSprite, this.mousePos);
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
                this.gameState = GameState.PLAYING;
                break;
            case GameState.PLAYING:
                this.gameState = GameState.IDLE;
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
                this.gameState = GameState.PLAYING;
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                break;
            default:
                this.gameState = newState;
        }
    },
}