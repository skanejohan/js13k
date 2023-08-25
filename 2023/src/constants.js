const GameState = {
    IDLE: 1,
    PLAYING: 2,
    LEVELWON: 3,
    GAMEOVER: 4
}

const TrebuchetState = {
    LOAD_OR_MOVE: 1,
    FIRE: 2,
    DONE: 3
}

const AnimationState = {
    NONE: 0, 
    HIGHLIGHT_ATTACKER: 1,
    HIGHLIGHT_ATTACK: 2,
    HIGHLIGHT_ATTACKEE: 3,
}

const HexSide = 30;

const BoardLeftMargin = 30;
const BoardTopMargin = 30;
const BoardCols = 25;
const BoardRows = 14;
const BoardWidth = 1100;
const BoardHeight = 700;
const BaseRadius = 50;