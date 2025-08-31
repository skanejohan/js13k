function displayMenu() {
    menu = svgGroup();
    menu.appendChild(svgText("TOWER OF TERROR", 400, 400));
    menu.appendChild(svgText("the lucky number is on your side", 400, 500));
    menu.appendChild(svgText("the unlucky number is not", 400, 540));
    menu.appendChild(svgText("the portals... you never know where you will end up", 400, 580));
    menu.appendChild(svgText("the black cats... your biggest fear... the horror makes you sweat and clouds your vision", 400, 620));
    menu.appendChild(svgText("the horseshoe... your way out", 400, 660));
    menu.appendChild(svgText("escape the tower... escape the terror!", 400, 800));
    menu.appendChild(svgText("Click to start", 400, 1000, 20, "white"));
    menu.appendChild(svgText("Uses pl_synth (https://github.com/phoboslab/pl_synth)", 400, 1200, 20, "white"));
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

let menu = undefined;
