var board = {
    s: HexSide,
    h: undefined,
    r: undefined,
    cells: undefined, // matrix of { row, col, x, y }
    villages: new Set(), // set of { row, col, strength, surroundingCells }
    trebuchets: new Set(), // set of { row, col, strength }
    hoveredCell: undefined, // { row, col, x, y }
    surroundingCells: undefined, // set of { row, col, x, y }

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
                    row : 0,
                    col : c,
                    x: BoardLeftMargin + this.h + this.s / 2 + c * (this.s + this.h), 
                    y: BoardTopMargin + this.r + yOffset
                };
            }

            // Subsequent rows - just increase y
            for (var rw = 1; rw < BoardRows; rw++) {
                this.cells[rw] = [];
                for (var c = 0; c < BoardCols; c++) {
                    this.cells[rw][c] = { 
                        row: rw,
                        col: c,
                        x: this.cells[rw - 1][c].x, 
                        y: this.cells[rw - 1][c].y + 2 * this.r 
                    };
                }
            }
        }
    },

    __cell(col, row) {
        return this.cells[row][col];
    }, 

    __randomCell() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        return this.cells[getRandomInt(BoardRows)][getRandomInt(BoardCols)];
    }, 

    __closestCell(mousePos) {
        var cell = undefined;
        var minDistSquared = (this.s / 2 + this.h) * (this.s / 2 + this.h);
        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var candidate = this.__cell(c, r);
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

    __adjacent(source) {
        var cells = new Set();
        for (row = 0; row < BoardRows; row++) {
            for (col = 0; col < BoardCols; col++) {
                var c = this.__cell(col, row);
                if (Math.abs(c.row - source.row) > 1) {
                    continue;
                } 
                if (Math.abs(c.col - source.col) > 1) {
                    continue;
                } 
                if (source.col % 2 == 0) {
                    if (c.col - source.col == 1 && c.row - source.row == 1)
                    {
                        continue;
                    } 
                    if (c.col - source.col == -1 && c.row - source.row == 1)
                    {
                        continue;
                    } 
                } 
                else {
                    if (c.col - source.col == -1 && c.row - source.row == -1)
                    {
                        continue;
                    } 
                    if (c.col - source.col == 1 && c.row - source.row == -1)
                    {
                        continue;
                    } 
                }
                if (c.col == source.col && c.row == source.row) {
                    continue;
                }
                cells.add(c);
            }
        }
        return cells;
    },

    __surrounding(source, dist) {
        var stack = [];
        var set = new Set();
        stack.push({ c : source, d : dist });
        while (stack.length > 0) {
            var { c, d } = stack.pop();
            set.add(c);
            if (d > 0) {
                this.__adjacent(c).forEach(a => stack.push({ c : a, d : d - 1 }));
            }
        }
        return set;
    },

    __villageAt(col, row) {
        for (const v of this.villages) {
            if (v.col == col && v.row == row) {
                return v;
            }
        }
        return undefined;
    },

    __trebuchetAt(col, row) {
        for (const t of this.trebuchets) {
            if (t.col == col && t.row == row) {
                return t;
            }
        }
        return undefined;
    },

    __villageOrTrebuchetAt(col, row) {
        var v = this.__villageAt(col, row); 
        return v ? v : this.__trebuchetAt(col, row);
    },

    __createVillageOrTrebuchet(cell, strength) {
        return {
            col : cell.col,
            row : cell.row,
            strength : strength,
            surroundingCells : this.__surrounding(cell, strength)
        }
    },

    reset(villageCount, trebuchetCount) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        this.villages = new Set();
        this.trebuchets = new Set();
        var occupied = new Set();
    
        this.__initializeCells();

        while (this.villages.size < villageCount)
        {
            var c = this.__createVillageOrTrebuchet(this.__randomCell(), 2);
            this.villages.add(c);
            occupied.add(c);
        }
        while (this.trebuchets.size < trebuchetCount)
        {
            var c = this.__createVillageOrTrebuchet(this.__randomCell(), 3);
            if (!occupied.has(c))
            {
                this.trebuchets.add(c);
                occupied.add(c);
            }
        }
    },

    update(mousePos) {
        var c = this.__closestCell(mousePos);
        if (c != this.hoveredCell) {
            this.hoveredCell = c;
            if (this.hoveredCell == undefined) {
                this.surroundingCells = undefined;
            }
            else {
                var over = this.__trebuchetAt(c.col, c.row);
                if (over) { 
                    // I have moved to a trebuchet - its range should be highlighted
                    this.surroundingCells = this.__surrounding(this.hoveredCell, over.strength);
                }
                else if (this.surroundingCells != undefined && !this.surroundingCells.has(this.hoveredCell))
                {
                    // I have moved out of the highlighted area - nothing is highlighted
                    this.surroundingCells = undefined;
                }
            }
        }
    },

    draw(drawSprite) {
        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var cell = this.cells[r][c];
                drawSprite(sprites("grass"), cell.x, cell.y);
                drawSprite(sprites("normal"), cell.x, cell.y);
            }
        }
        for (const v of this.villages) {
            var cell = this.cells[v.row][v.col];
            v.surroundingCells.forEach(c => drawSprite(sprites("villageRange"), c.x, c.y))
        }
        if (this.surroundingCells) {
            this.surroundingCells.forEach(c => drawSprite(sprites("trebuchetRange"), c.x, c.y))
        }
        for (const t of this.trebuchets) {
            var cell = this.cells[t.row][t.col];
            drawSprite(sprites("trebuchet"), cell.x, cell.y);
        }
        for (const v of this.villages) {
            var cell = this.cells[v.row][v.col];
            drawSprite(sprites("village"), cell.x, cell.y);
        }
    }
};