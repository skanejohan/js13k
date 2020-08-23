let Debug = () => {
    let createText = (x, y) => kontra.Text({ x: x, y: y, font: '16px Arial', color: 'white' });

    var _offsetText = createText(30, 750);
    var _scrollText = createText(230, 750);
    var _visibleText = createText(430, 750);

    var obj = {
        render() {
            _offsetText.render();
            _scrollText.render();
            _visibleText.render();
        },
        update() {
            _offsetText.text = `Offset: ${gameContext.x}, ${gameContext.y}`;
            _scrollText.text = `Scroll: ${gameContext.scrollX}, ${gameContext.scrollY}`;
            var l = minX - gameContext.x;
            var t = minY - gameContext.y;
            var r = maxX - gameContext.x;
            var b = maxY - gameContext.y;
            _visibleText.text = `Visible area: (${l}, ${t}) - (${r}, ${b})`;
        },
    
    };
    return obj;
}
