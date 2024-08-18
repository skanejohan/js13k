let getInput = doc => {
    let down = {};
    doc.addEventListener('keydown', e => down[e.code] = true, false);
    doc.addEventListener('keyup', e => down[e.code] = false, false);

    return {
        isDown: code => down[code] == true
    }
}
