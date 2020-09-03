let addCoinToRoad = (coins, roads, indexOfRoadSegmentCoveredByCar) => {
    var roadIndex = Math.floor(Math.random() * roads.length);
    var road = roads[roadIndex];
    
    if (road.hasCoin || Math.abs(indexOfRoadSegmentCoveredByCar - roadIndex) < 5) {
        return;
    }

    var coinX, coinY;
    var { x, y, w, h } = getRoadRectangle(road); 
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

    var coin = createCoin(
        Math.round(coinX), 
        Math.round(coinY), 
        _generateCoinValue(), 
        MINCOINTICKS + (MAXCOINTICKS-MINCOINTICKS) * Math.random()
    );

    coins.push(coin);
    coin.road = road;
    road.hasCoin = true;
}

_generateCoinValue = () => {
    value = 1 + Math.floor(Math.random() * Math.abs(gameContext.score - 404));
    if (gameContext.score > 0 && Math.random() < 0.6) {
        value = -value;
    }
    return value;
}
