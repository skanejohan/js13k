var board = {
    cells: undefined, // { row, col, x, y }
    s: HexSide,
    h: undefined,
    r: undefined,
    villages: new Set(),
    trebuchets: new Set(),
    hoveredCell: undefined,
    surroundingCells: undefined,

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

    __cell(r, c) {
        return this.cells[r][c];
    }, 

    __closestCell(mousePos) {
        var cell = undefined;
        var minDistSquared = (this.s / 2 + this.h) * (this.s / 2 + this.h);
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

    __adjacent(source) {
        var cells = new Set();
        for (row = 0; row < BoardRows; row++) {
            for (col = 0; col < BoardCols; col++) {
                var c = this.__cell(row, col);
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

    reset(villageCount, trebuchetCount) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        this.villages = new Set();
        this.trebuchets = new Set();
        var occupied = new Set();
    
        while (this.villages.size < villageCount)
        {
            var c = { r : getRandomInt(BoardRows), c : getRandomInt(BoardCols)};
            this.villages.add(c);
            occupied.add(c);
        }
        while (this.trebuchets.size < trebuchetCount)
        {
            var c = { r : getRandomInt(BoardRows), c : getRandomInt(BoardCols)};
            if (!occupied.has(c))
            {
                this.trebuchets.add(c);
                occupied.add(c);
            }
        }
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
        for (const v of this.villages) {
            var cell = this.cells[v.r][v.c];
            drawSprite(sprites("village"), cell.x, cell.y);
        }
        for (const t of this.trebuchets) {
            var cell = this.cells[t.r][t.c];
            drawSprite(sprites("trebuchet"), cell.x, cell.y);
        }
        var closestCell = this.__closestCell(mousePos);
        if (closestCell != this.hoveredCell) {
            this.hoveredCell = closestCell;
            this.surroundingCells = this.hoveredCell
                ? this.__surrounding(closestCell, 3)
                : undefined;
        }
        if (closestCell) {
            drawSprite(sprites("highlight"), closestCell.x, closestCell.y);
        }
        if (this.surroundingCells) {
            this.surroundingCells.forEach(c => drawSprite(sprites("trebuchet"), c.x, c.y))
        }
    }
};