let dirX = 0;
let dirY = 0;

document.addEventListener('keydown', e => {
    if (e.code == "ArrowLeft") {
        dirX = -1;
    }
    if (e.code == "ArrowRight") {
        dirX = 1;
    }
    if (e.code == "ArrowUp") {
        dirY = -1;
    }
    if (e.code == "ArrowDown") {
        dirY = 1;
    }
}, false);

document.addEventListener('keyup', e => {
    if ((e.code == "ArrowLeft" && dirX == -1)|| (e.code == "ArrowRight" && dirX == 1)) {
        dirX = 0;
    }
    if ((e.code == "ArrowUp" && dirY == -1)|| (e.code == "ArrowDown" && dirY == 1)) {
        dirY = 0;
    }
}, false);