let drawCircle = (x, y, radius, lineWidth, strokeStyle, fillStyle, ctx) => {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.stroke();
    ctx.fill();
}

let fillText = (text, x, y, font, textAlign, fillStyle, ctx) => {
    ctx.font = font;      
    ctx.textAlign = textAlign;  
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
}
