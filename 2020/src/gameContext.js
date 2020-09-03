const GameState = {
    IDLE: 1,
    PLAYING: 2,
    WELLDONE: 3,
    GAMEOVER: 4
}

const MAXCOINS = 40;
const MAXCOINTICKS = 500;
const MINCOINTICKS = 100;

var gameContext = {
    x: 0,
    y: 0,
    scrollX : 0, 
    scrollY : 0,
    gameState: GameState.IDLE,
    tick: 0,
    score: 0,
    startTime: 0,
    linksFound: 0,
    bestTime: null,

    reset() {
        this.x = 0;
        this.y = 0;
        this.tick = 0;
        this.score = 0;
        this.linksFound = 0;
        this.startTime = Date.now();
        this.roads = [];
        this.coins = [];
        this.environment = [];
        this.car = createCar(300, 250);
        this.energy = 500;
        buildCourse(1);
    },

    update() {
        if (this.gameState == GameState.PLAYING) {
            this.tick++;
            this.coins.filter(c => !coinIsAlive(c)).forEach(c => c.road.hasCoin = false);
            this.coins = this.coins.filter(c => coinIsAlive(c));
            this.roads.forEach(r => r.update());
            this.environment.forEach(e => e.update());
            this.coins.forEach(c => updateCoin(c));
            updateCar(this.car, turnLeft(), turnRight(), fastForward());
            var coveredRoad = this.coveredRoad();
            if (coveredRoad == -1) {
                this.removeEnergy(2);
            }
            this.addCoin(coveredRoad);
            var coinHit = this.coins.find(c => this.carInsideCoin(c));
            if (coinHit) {
                this.score += coinHit.value;
                if (this.score == 404) {
                    this.linksFound++;
                    this.setGameState(GameState.WELLDONE);
                }
                coinHit.road.hasCoin = false;
                this.coins = this.coins.filter(c => c != coinHit);
                this.addEnergy(10);
            }
            if (this.tick % 20 == 0) {
                this.removeEnergy(1);
            }
        }
    },

    render() {
        if (this.gameState == GameState.PLAYING) {
            this.environment.forEach(r => r.render());
            this.roads.forEach(r => r.render());
            this.coins.forEach(c => drawCoin(c, context));
            drawCar(this.car, context);
        }
    },

    addEnergy(value) {
        this.energy += value;
        if (this.energy > 500) {
            this.energy = 500;
        }
    },

    removeEnergy(value) {
        this.energy -= value;
        if (this.energy <= 0) {
            this.setGameState(GameState.GAMEOVER);
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                this.gameState = GameState.PLAYING;
                break;
            case GameState.GAMEOVER:
                this.gameState = GameState.GAMEOVER;
                setTimeout(() => this.setGameState(GameState.IDLE), 3000);
                break;
            case GameState.WELLDONE:
                this.gameState = GameState.WELLDONE;
                // TODO build next course
                setTimeout(() => this.setGameState(GameState.PLAYING), 3000);
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                this.reset();
                break;
        }
    },

    coveredRoad() {
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
                return i;
            } 
        }
        return -1;
    },

    carInsideCoin(coin) {
        return isInsideCoin(this.car.frontLeft, coin) || 
            isInsideCoin(this.car.frontRight, coin) || 
            isInsideCoin(this.car.rearRight, coin) || 
            isInsideCoin(this.car.rearLeft, coin);
    },

    addCoin(coveredRoad) {
        if (this.coins.length < MAXCOINS) {
            addCoinToRoad(this.coins, this.roads, coveredRoad);
        }
    },
}
