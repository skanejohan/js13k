let addCoin = indexOfRoadSegmentCoveredByCar => {
    let { road, roadIndex } = _getTargetSegment();    
    if (_canAddCoin(road, roadIndex, indexOfRoadSegmentCoveredByCar)) {
        let { x, y } = _getCoinPosition(road);
        _addCoin(x, y, road);
    }
}

let removeCoin = coin => {
    coin.road.hasCoin = false;
    gameContext.coins = gameContext.coins.filter(c => c != coin);
}

let _canAddCoin = (targetSegment, targetIndex, indexOfRoadSegmentCoveredByCar) => {
    if (gameContext.coins.length >= MAXCOINS) {
        return false;
    } 
    if (targetSegment.hasCoin) {
        return false;
    }
    if (Math.abs(indexOfRoadSegmentCoveredByCar - targetIndex) < 5) {
        return false;
    }
    return true;
}

let _getTargetSegment = () => {
    var index = Math.floor(Math.random() * gameContext.roads.length);
    return { road: gameContext.roads[index], roadIndex: index }
}

let _getCoinPosition = segment => {
    var { x, y, w, h } = getRoadRectangle(segment); 
    return { x: Math.round(x + Math.random() * w), y: Math.round(y + Math.random() * h) };
}

let _getCoinValue = () => {
    value = 1 + Math.floor(Math.random() * Math.abs(gameContext.score - 404));
    if (gameContext.score > 0 && Math.random() < 0.6) {
        value = -value;
    }
    return value;
}

let _getCoinTicksToLive = () => MINCOINTICKS + (MAXCOINTICKS-MINCOINTICKS) * Math.random();

let _addCoin = (x, y, road) => {
    var coin = createCoin(x, y, _getCoinValue(), _getCoinTicksToLive());
    gameContext.coins.push(coin);
    coin.road = road;
    road.hasCoin = true;    
}

const MAXCOINS = 40;
const MAXCOINTICKS = 500;
const MINCOINTICKS = 100;
