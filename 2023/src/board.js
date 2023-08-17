var board = {
    cells: undefined,
    s: HexSide,
    h: undefined,
    r: undefined,

    __initializeCells()
    {
        if (this.cells == undefined) {
            this.cells = [];
            this.h = this.s * Math.sin(30 * Math.PI / 180);
            this.r = this.s * Math.cos(30 * Math.PI / 180);
    
            // Row 0 - actually calculate x and y
            this.cells[0] = [];
            for (var c = 0; c < BoardCols; c++) {
                var yOffset = c % 2 == 0 ? 0 : this.r;
                this.cells[0][c] = { 
                    x: BoardLeftMargin + this.h + this.s / 2 + c * (this.s + this.h), 
                    y: BoardTopMargin + this.r + yOffset
                };
            }
    
            // Subsequent rows - just increase y
            for (var rw = 1; rw < BoardRows; rw++) {
                this.cells[rw] = [];
                for (var c = 0; c < BoardCols; c++) {
                    this.cells[rw][c] = { x: this.cells[rw - 1][c].x, y: this.cells[rw - 1][c].y + 2 * this.r };
                }
            }
        }
    },

    __cell(r, c) {
        return this.cells[r][c];
    }, 

    __closestCell(mousePos) {
        var cell = undefined;
        var minDistSquared = (this.s / 2 + this.h) * (this.s / 2 + this.h); //100000;
        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var candidate = this.__cell(r, c);
                var distSquared = 
                    (candidate.x - mousePos.x) * (candidate.x - mousePos.x) + 
                    (candidate.y - mousePos.y) * (candidate.y - mousePos.y);
                if (distSquared < minDistSquared) {
                    cell = candidate;
                    minDistSquared = distSquared;
                }
            }
        }
        return cell;
    },

    draw(drawSprite, mousePos) {
        this.__initializeCells();
        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var cell = this.cells[r][c];
                drawSprite(sprites("grass"), cell.x, cell.y);
                drawSprite(sprites("normal"), cell.x, cell.y);
            }
        }
        var closestCell = this.__closestCell(mousePos);
        if (closestCell) {
            drawSprite(sprites("highlight"), closestCell.x, closestCell.y);
        }
    }
};