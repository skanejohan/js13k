const GameState = {
    IDLE: 1,
    PLAYING: 2
}

var gameContext = {
    gameState: GameState.IDLE,

    update(dt) {
    },

    render() {
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
                context.fillText("PLAYING", 600, 400);
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