let getMovement = input => {

    let da = 0;
    let dx = 0;
    let dy = 0;
    let _input = input;
    let _circle = { x : 0, screenX : 800, y : 400, a : 0 }
    let _scene = { x : 0 }

    let _update = dt => {
        if (_input.isDown("ArrowLeft")) {
            dx -= 1;
        }
        if (_input.isDown("ArrowRight")) {
            dx += 1;
        }
        if (_input.isDown("Space")) {
            dx = 0;
        }
    
        let translationX = Math.abs(5 * (dx * dt / 100));
        if (dx > 0) { // We move right
            if (_circle.x < scene.maxX) {
                let leftToApply = rightEdge - _circle.screenX;
                let toApply = Math.min(translationX, leftToApply);
                _circle.screenX += toApply;
                _scene.x -= translationX - toApply;
                _circle.x = _circle.screenX - _scene.x;
            }
            else {
                dx = 0;
            }
        }
        else { // We move left
            if (_circle.x > scene.minX) {
                let leftToApply = _circle.screenX - leftEdge;
                let toApply = Math.min(translationX, leftToApply);
                _circle.screenX -= toApply;
                _scene.x += translationX - toApply;
                _circle.x = _circle.screenX - _scene.x;
            }
            else {
                dx = 0;
            }
        }
    }

    return {
        update: _update,
        circle: () => _circle,
        scene: () => _scene,
    }
}