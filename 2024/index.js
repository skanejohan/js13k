let x = 0;
let dx = 0;

document.addEventListener('keydown', 
    e => {
        if (e.code == "ArrowLeft") {
            dx += 1;
        }
        if (e.code == "ArrowRight") {
            dx -= 1;
        }
        if (e.code == "Space") {
            dx = 0;
        }
    }, false);

document.getElementById("layer1").innerHTML = '<rect width="200" height="100" x="100" y="100" rx="20" ry="20" fill="blue" />';
document.getElementById("layer2").innerHTML = '<rect width="200" height="100" x="100" y="300" rx="20" ry="20" fill="red" />';
document.getElementById("layer3").innerHTML = '<rect width="200" height="100" x="100" y="500" rx="20" ry="20" fill="yellow" />';
document.getElementById("overlay").innerHTML = '<text x="500" y="300" fill="black">WHACKY WESQUE WHEEL</text>';

let lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);

    x = x + dx * dt / 100; 
    document.getElementById("layer1").setAttribute("transform", `translate(${x} 0)`); 
    document.getElementById("layer2").setAttribute("transform", `translate(${3 * x} 0)`); 
    document.getElementById("layer3").setAttribute("transform", `translate(${5 * x} 0)`); 

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

gameLoop();