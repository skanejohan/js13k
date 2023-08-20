var board = {
    hexGrid: undefined,
    villages: new Set(), // set of { cell, strength, surroundingCells }
    trebuchets: new Set(), // set of { cell, strength, surroundingCells }
    hoveredCell: undefined, // cell
    activeTrebuchet: undefined, // { cell, strength, surroundingCells } - while in trebuchet range

    __randomCell() {
        var c = Math.floor(Math.random() * BoardCols);
        var r = Math.floor(Math.random() * BoardRows);
        return this.hexGrid.cell(c, r);
    }, 

    __trebuchetAt(cell) {
        for (const t of this.trebuchets) {
            if (t.cell == cell) {
                return t;
            }
        }
        return undefined;
    },

    __createVillageOrTrebuchet(cell, strength) {
        return {
            cell : cell,
            strength : strength,
            surroundingCells : this.hexGrid.neighbors(cell, strength)
        }
    },

    reset(villageCount, trebuchetCount) {
        this.villages = new Set();
        this.trebuchets = new Set();
        var occupied = new Set();
    
        this.hexGrid = createHexGrid(HexSide, BoardCols, BoardRows, BoardLeftMargin, BoardTopMargin);

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
        var cell = this.hexGrid.enclosingCell(mousePos.x, mousePos.y);
        if (cell != this.hoveredCell) {
            this.hoveredCell = cell;
            if (this.hoveredCell == undefined) {
                this.activeTrebuchet = undefined;
            }
            else {
                var trebuchet = this.__trebuchetAt(cell);
                if (trebuchet) { 
                    this.activeTrebuchet = trebuchet; // I am hovering over a trebuchet
                }
                else if (this.activeTrebuchet != undefined && !this.activeTrebuchet.surroundingCells.has(this.hoveredCell))
                {
                    this.activeTrebuchet = undefined; // I have moved out of the highlighted area - nothing is highlighted
                }
                // Otherwise, I remain in the trebuchet range
            }
        }
    },

    click() {
        if (this.activeTrebuchet) {
            var newStrength = 0;
            if (this.activeTrebuchet.cell == this.hoveredCell) { 
                // load the trebuchet, i.e. increase its strength
                newStrength = this.activeTrebuchet.strength + 1;
            }
            else { 
                // move the trebuchet, i.e. decrease its strength
                var distance = this.hexGrid.distance(this.hoveredCell, this.activeTrebuchet.cell);
                newStrength = this.activeTrebuchet.strength - distance;
            }
            this.trebuchets.delete(this.activeTrebuchet);
            var t = this.__createVillageOrTrebuchet(this.hoveredCell, newStrength);
            this.activeTrebuchet = t;
            this.trebuchets.add(t);
        }
    },

    draw(drawSprite, drawText) {
        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var cell = this.hexGrid.cell(c, r); 
                drawSprite(sprites("grass"), cell.cx, cell.cy);
                drawSprite(sprites("normal"), cell.cx, cell.cy);
            }
        }
        for (const v of this.villages) {
            v.surroundingCells.forEach(c => drawSprite(sprites("villageRange"), c.cx, c.cy))
        }

        if (this.activeTrebuchet) {
            this.activeTrebuchet.surroundingCells.forEach(c => drawSprite(sprites("trebuchetRange"), c.cx, c.cy))
        }

        for (const t of this.trebuchets) {
            drawSprite(sprites("trebuchet"), t.cell.cx, t.cell.cy);
        }
        for (const v of this.villages) {
            drawSprite(sprites("village"), v.cell.cx, v.cell.cy);
        }

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.cell == this.hoveredCell) {
                drawText("Click to load or hover over another cell to move", 600, 780);
            }
            else {
                drawText("Click to move here", 600, 780);
            }
        }
    }
};
