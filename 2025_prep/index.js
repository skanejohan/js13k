var dir = 0;
var dxAvatar = 0;
var xAvatar = 300;
var xViewBox = 0;
var lastTime = Date.now();
var avatar = document.getElementById("avatar");
var scene = document.getElementById('scene');

document.addEventListener('keydown', e => {
    if (e.code == "ArrowLeft") {
        if (dir == 1)
        {
            dxAvatar = 0; // We changed direction without releasing right arrow
        }
        dir = -1;
    }
    if (e.code == "ArrowRight") {
        if (dir == -1)
        {
            dxAvatar = 0; // We changed direction without releasing left arrow
        }
        dir = 1;
    }
}, false);

document.addEventListener('keyup', e => {
    if ((e.code == "ArrowLeft" && dir == -1)|| (e.code == "ArrowRight" && dir == 1)) {
        dxAvatar = 0;
        dir = 0;
    }
}, false);

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    if (dir == 1) {
        dxAvatar += 0.3;
        if (dxAvatar > 5) {
            dxAvatar = 5;
        }
    }
    if (dir == -1) {
        dxAvatar -= 0.3;
        if (dxAvatar < -5) {
            dxAvatar = -5;
        }
    }

    xAvatar += dxAvatar * dt / 10; // Move avatar based on direction and time delta


    avatar.setAttribute("transform", `translate(${xAvatar} 0)`);

    if (dir == -1 && xAvatar < 300 + xViewBox) {
        xViewBox = xAvatar - 300;
    }
    if (dir == 1 && xAvatar > 500 + xViewBox) {
        xViewBox = xAvatar - 500;
    }

    console.log(`Avatar position: ${xAvatar}, viewbox position: ${xViewBox}`);

    scene.setAttribute("viewBox", `${xViewBox} 0 2000 1080`);
    //if (avatar)

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();