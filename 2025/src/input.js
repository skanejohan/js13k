let left = false;
let right = false;
let up = false;
let down = false;

document.addEventListener('keydown', e => {
    if (e.code == "ArrowLeft") {
        left = true;
    }
    if (e.code == "ArrowRight") {
        right = true;
    }
    if (e.code == "ArrowUp") {
        up = true;
    }
    if (e.code == "ArrowDown") {
        down = true;
    }
}, false);

document.addEventListener('keyup', e => {
    if (e.code == "ArrowLeft") {
        left = false;
    }
    if (e.code == "ArrowRight") {
        right = false;
    }
    if (e.code == "ArrowUp") {
        up = false;
    }
    if (e.code == "ArrowDown") {
        down = false;
    }
}, false);