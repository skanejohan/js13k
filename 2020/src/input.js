initInput = doc => {
    doc.addEventListener('keydown', _keyDownHandler, false);
    doc.addEventListener('keyup', _keyUpHandler, false);
}

let turnLeft = () => _turnLeft;
let turnRight = () => _turnRight;
let fastForward = () => _fastForward;

_keyDownHandler = e => {
    switch (e.keyCode) {
        case 37: _turnLeft = true; break;
        case 39: _turnRight = true; break; 
        case 32: _fastForward = true; break;
    }
}

_keyUpHandler = e => {
    switch (e.keyCode) {
        case 37: _turnLeft = false; break;
        case 39: _turnRight = false; break; 
        case 32: _fastForward = false; break;
    }
}

var _turnLeft = false;
var _turnRight = false;
var _fastForward = false;