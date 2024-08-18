let getMovement = input => {

    let dx = 0;
    let _input = input;
    let _circleTranslationX = 800;
    let _circleTranslationY = 400;
    let _sceneTranslationX = 0;

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
            if (sceneX < scene.maxX) {
                let leftToApply = rightEdge - _circleTranslationX;
                let toApply = Math.min(translationX, leftToApply);
                _circleTranslationX += toApply;
                _sceneTranslationX -= translationX - toApply;
            }
            else {
                dx = 0;
            }
        }
        else { // We move left
            if (sceneX > scene.minX) {
                let leftToApply = _circleTranslationX - leftEdge;
                let toApply = Math.min(translationX, leftToApply);
                _circleTranslationX -= toApply;
                _sceneTranslationX += translationX - toApply;
            }
            else {
                dx = 0;
            }
        }
    }

    return {
        update: _update,
        circleTranslationX: () => _circleTranslationX,
        circleTranslationY: () => _circleTranslationY,
        sceneTranslationX: () => _sceneTranslationX,
    }
}