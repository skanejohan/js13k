const GameState = {
    IDLE: 1,
    PLAYING: 2,
    GAMEOVER: 3
}

var gameContext = {
    x: 0,
    y: 0,
    scrollX : 0, 
    scrollY : 0,
    gameState: GameState.IDLE,
    tick: 0,
    score: 0,
    startTime: 0,
    bestTime: null,

    reset() {
        this.x = 0;
        this.y = 0;
        this.tick = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.roads = [];
        this.coins = [];
        this.car = Car(300, 250);
        this.energyBar = EnergyBar(minX, 700, maxX, 20);
        buildCourse(1);
    },

    update() {
        if (this.gameState == GameState.PLAYING) {
            this.tick++;
            this.coins.filter(c => !c.alive()).forEach(c => c.road.hasCoin = false);
            this.coins = this.coins.filter(c => c.alive());
            this.addCoin();
            this.roads.forEach(r => r.update());
            this.coins.forEach(c => c.update());
            this.car.update();
            if (!this.carInsideRoad()) {
                gameContext.energyBar.value--;
                if (gameContext.energyBar.value == 0) {
                    gameContext.setGameState(GameState.GAMEOVER);
                }
            }
            var coinHit = this.coins.find(c => this.carInsideCoin(c));
            if (coinHit) {
                this.score += coinHit.value;
                if (this.score > 404) {
                    // TODO;
                }
                coinHit.road.hasCoin = false;
                this.coins = this.coins.filter(c => c != coinHit);
                gameContext.energyBar.value += 10;
                if (gameContext.energyBar.value > 500) {
                    gameContext.energyBar.value = 500;
                }
            }
            this.energyBar.update();
        }
    },

    render() {
        if (this.gameState == GameState.PLAYING) {
            this.roads.forEach(r => r.render());
            this.coins.forEach(c => c.render());
            this.car.render();
            this.energyBar.render();
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                this.gameState = GameState.PLAYING;
                this.reset();
                break;
            case GameState.GAMEOVER:
                this.gameState = GameState.GAMEOVER;
                setTimeout(() => this.setGameState(GameState.IDLE), 3000);
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                break;
        }
    },

    carInsideRoad() {
        flInside = false;
        frInside = false;
        rrInside = false;
        rlInside = false;
        for (var i=0; i < this.roads.length; i++) {
            var r = this.roads[i];
            flInside = flInside || r.inside(this.car.frontLeft); 
            frInside = frInside || r.inside(this.car.frontRight); 
            rrInside = rrInside || r.inside(this.car.rearRight); 
            rlInside = rlInside || r.inside(this.car.rearLeft);
            if (flInside && frInside && rrInside && rlInside) {
                return true;
            } 
        }
        return false;
    },

    carInsideCoin(coin) {
        return coin.inside(this.car.frontLeft) || 
            coin.inside(this.car.frontRight) || 
            coin.inside(this.car.rearRight) || 
            coin.inside(this.car.rearLeft);
    },

    addCoin() {
        if (this.coins.length < 20) {
            var road = this.roads[Math.floor(Math.random() * this.roads.length)];
            if (!road.hasCoin) {
                var statusCodes = this.positiveCoinShouldBeCreated() ? okStatusCodes : errorStatusCodes;
                var statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];            
                var coinX, coinY;
                var { x, y, w, h } = road.rectangle(); 
                switch(Math.floor(Math.random() * 4)) {
                    case 0: 
                        coinX = x + w / 4;
                        coinY = y + h / 4;
                        break;
                    case 1: 
                        coinX = x + 3 * w / 4;
                        coinY = y + h / 4;
                        break;
                    case 2: 
                        coinX = x + 3 * w / 4;
                        coinY = y + 3 * h / 4;
                        break;
                    case 3: 
                        coinX = x + w / 4;
                        coinY = y + 3 * h / 4;
                        break;
                }
                var coin = Coin(Math.round(coinX), Math.round(coinY), statusCode.value, 200 + 1000 * Math.random());
                this.coins.push(coin);
                coin.road = road;
                road.hasCoin = true;
            }
        }
    },

    positiveCoinShouldBeCreated() {
        var intervalMin = Math.min(-596, this.score);
        var intervalMax = Math.max(1404, this.score);
        var rnd = Math.random() * (intervalMax - intervalMin) + intervalMin;
        return rnd < 404;
    }
}

let okStatusCodes = [
    { value: 100, name: "Continue" },
    { value: 101, name: "Switching Protocols" },
    { value: 200, name: "OK" },
    { value: 201, name: ""},
    { value: 202, name: ""},
    { value: 203, name: ""},
    { value: 204, name: ""},
    { value: 205, name: ""},
    { value: 206, name: ""},
    { value: 300, name: "" },
    { value: 301, name: ""},
    { value: 302, name: ""},
    { value: 303, name: ""},
    { value: 304, name: ""},
    { value: 305, name: ""},
    { value: 306, name: ""},
    { value: 307, name: ""},
    { value: 308, name: ""}
]

let errorStatusCodes = [
    { value: -400, name: "Bad Request" },
    { value: -401, name: "Unauthorized" },
    { value: -403, name: ""},
    { value: -405, name: ""},
    { value: -406, name: ""},
    { value: -407, name: ""},
    { value: -408, name: ""},
    { value: -409, name: ""},
    { value: -410, name: ""},
    { value: -411, name: ""},
    { value: -412, name: ""},
    { value: -413, name: ""},
    { value: -414, name: ""},
    { value: -415, name: ""},
    { value: -416, name: ""},
    { value: -417, name: ""},
    { value: -418, name: ""},
    { value: -500, name: ""},
    { value: -501, name: ""},
    { value: -502, name: ""},
    { value: -503, name: ""},
    { value: -504, name: ""},
    { value: -505, name: ""},
    { value: -509, name: ""},
]

