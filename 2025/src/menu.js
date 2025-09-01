function displayMenu() {
    menu = svgGroup();
    menu.appendChild(svgCircle(80, 100, 80, "red"));
    for (let i = 0; i < towerLevels.length; i++) {
        let l = towerLevels[i][0] - 60;
        let r = towerLevels[i][1] - 60;
        let t = i * 30 + 19;
        let b = t + 31;
        let s = `M ${l} ${t} L ${r} ${t} L ${r} ${b} L ${l} ${b} Z`;
        menu.appendChild(svgPath(s, "#080001"));
    }
    menu.appendChild(svgText("TOWER OF TERROR", 200, 100, "red", "Arial", 60));
    menu.appendChild(svgGoodLuck(300, 195));
    menu.appendChild(svgText("the lucky number is on your side", 330, 200, "red"));
    menu.appendChild(svgBadLuck(330, 235));
    menu.appendChild(svgText("the unlucky number is not", 360, 240, "red"));
    menu.appendChild(svgPortal(250, 275));
    menu.appendChild(svgText("the portals... you never know where you will end up", 280, 280, "red"));
    menu.appendChild(svgCat(120, 315));
    menu.appendChild(svgText("the black cats... your biggest fear... the horror makes you sweat and clouds your vision", 150, 320, "red"));
    menu.appendChild(svgHorseshoe(320, 355));
    menu.appendChild(svgText("the horseshoe is your way out", 350, 360, "red"));
    menu.appendChild(svgText("click to escape the tower... and the terror!", 300, 500, "red"));
    menu.appendChild(svgText("uses pl_synth (https://github.com/phoboslab/pl_synth) for audio", -150, 590, "blue"));
    svg.setAttribute("viewBox", "0 0 800 600");
    svg.appendChild(menu);
    svg.addEventListener("click", _startGame);
}

function _startGame(e) {
    svg.removeEventListener("click", _startGame);
    svg.removeChild(menu);
    menu = undefined;
    startLevel(0);
    gameState = GSPLAYING;
    play(songBuffer, true);
}

let towerLevels = [
    [40, 130],
    [40, 140],
    [40, 140],
    [45, 135],
    [40, 140],
    [45, 145],
    [40, 140],
    [40, 140],
    [40, 140],
    [45, 145],
    [45, 145],
    [40, 150],
    [35, 150],
    [30, 155],
    [30, 155],
    [25, 155],
    [20, 160],
    [15, 165],
    [10, 170],
    [5, 175]
]

let menu = undefined;
