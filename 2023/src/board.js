var board = {
    hexGrid: undefined,
    villages: new Set(), // set of { cell, strength, surroundingCells }
    villageCells: new Set(), // Set of cell
    trebuchets: new Set(), // set of { cell, strength, surroundingCells, state }
    trebuchetCells: new Set(), // Set of cell
    hoveredCell: undefined, // cell
    activeTrebuchet: undefined, // { cell, strength, surroundingCells } - while in trebuchet range

    __randomCell() {
        var c = Math.floor(Math.random() * BoardCols);
        var r = Math.floor(Math.random() * BoardRows);
        return this.hexGrid.cell(c, r);
    }, 

    __addVillage(v) {
        this.villages.add(v);
        this.villageCells.add(v.cell);
    },

    __deleteVillage(v) {
        this.villages.delete(v);
        this.villageCells.delete(v.cell);
    },

    __addTrebuchet(t) {
        this.trebuchets.add(t);
        this.trebuchetCells.add(t.cell);
    },

    __deleteTrebuchet(t) {
        this.trebuchets.delete(t);
        this.trebuchetCells.delete(t.cell);
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

    __replaceOrRemoveTrebuchet(trebuchet, cell, newStrength) {
        this.__deleteTrebuchet(trebuchet);
        if (newStrength >= 0) { // A trebuchet may have strength 0
            var t = this.__createVillageOrTrebuchet(cell, newStrength);
            this.__addTrebuchet(t);
        }
        return t;
    },

    __replaceOrRemoveVillage(village, newStrength) {
        this.__deleteVillage(village);
        if (newStrength > 0) { // A village may not have strength 0
            var v = this.__createVillageOrTrebuchet(village.cell, newStrength);
            this.__addVillage(v);
        }
        return v;
    },

    __setFireOrDoneStateForActiveTrebuchet() {
        this.activeTrebuchet.state = TrebuchetState.DONE;
        for (const v of this.villages) {
            if (this.hexGrid.distance(this.activeTrebuchet.cell, v.cell) <= this.activeTrebuchet.strength) {
                this.activeTrebuchet.state = TrebuchetState.FIRE;
                break;
            }
        }
    },

    __load() {
        var newStrength = this.activeTrebuchet.strength + 1;
        this.activeTrebuchet = this.__replaceOrRemoveTrebuchet(this.activeTrebuchet, this.hoveredCell, newStrength);
        this.__setFireOrDoneStateForActiveTrebuchet();
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __move() {
        this.activeTrebuchet = this.__replaceOrRemoveTrebuchet(this.activeTrebuchet, this.hoveredCell, this.activeTrebuchet.strength);
        this.__setFireOrDoneStateForActiveTrebuchet();
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtVillage(village) {
        var distance = this.hexGrid.distance(this.activeTrebuchet.cell, village.cell);
        var power = this.activeTrebuchet.strength - distance + 1;
        this.activeTrebuchet = this.__replaceOrRemoveTrebuchet(this.activeTrebuchet, this.activeTrebuchet.cell, 0);
        this.__replaceOrRemoveVillage(village, village.strength - power);
        this.activeTrebuchet.state = TrebuchetState.DONE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtTrebuchet(trebuchet, village) {
        var distance = this.hexGrid.distance(trebuchet.cell, village.cell);
        if (distance < village.strength) {
            var power = 1;
            var newTrebuchet = this.__replaceOrRemoveTrebuchet(trebuchet, trebuchet.cell, trebuchet.strength - power);
            if (trebuchet == this.activeTrebuchet) {
                this.activeTrebuchet = newTrebuchet;
            }
            return newTrebuchet;
        }
        return undefined;
    },

    __attackWithVillagesWhenAllTrebuchetsDone() {
        for (const t of this.trebuchets) {
            if (t.state != TrebuchetState.DONE) {
                return;
            }
        }

        // if a trebuchet is in range of a village, the village will attack it. If not, the village's strength increases
        var villageList = Array.from(this.villages);
        var trebuchetList = Array.from(this.trebuchets);
        for (var i = 0; i < villageList.length; i++) {
            var v = villageList[i];
            for (var j = 0; j < trebuchetList.length; j++) {
                var t = trebuchetList[j];
                var hit = this.__fireAtTrebuchet(t, v);
                if (hit) {
                    if (hit.strength < 1) {
                        this.__deleteTrebuchet(hit);
                    }
                }
                else {
                    this.__replaceOrRemoveVillage(v, v.strength + 1);
                }
            }
        }

        for (var t of this.trebuchets) {
            t.state = TrebuchetState.LOAD_OR_MOVE;
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
            this.__addVillage(c);
            occupied.add(c);
        }
        while (this.trebuchets.size < trebuchetCount)
        {
            var c = this.__createVillageOrTrebuchet(this.__randomCell(), 3);
            if (!occupied.has(c))
            {
                this.__addTrebuchet(c);
                occupied.add(c);
            }
        }
        for (var t of this.trebuchets) {
            t.state = TrebuchetState.LOAD_OR_MOVE;
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
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.activeTrebuchet.cell == this.hoveredCell) { 
                    this.__load();
                }
                else { 
                    this.__move();
                }
            }
            if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                for (const v of this.villages) {
                    if (v.cell == this.hoveredCell) {
                        this.__fireAtVillage(v);
                        break;
                    }
                }
            }
        }
    },

    draw(drawSprite, drawText) {

        var villageRange = new Set();
        var trebuchetRange = new Set();
        var combinedRange = new Set();
        this.villages.forEach(v => v.surroundingCells.forEach(c => villageRange.add(c)));
        this.trebuchets.forEach(v => v.surroundingCells.forEach(c => {
            trebuchetRange.add(c);
            if (villageRange.has(c)) {
                combinedRange.add(c);
            }
        }));

        for (r = 0; r < BoardRows; r++) {
            for (c = 0; c < BoardCols; c++) {
                var cell = this.hexGrid.cell(c, r);

                var frame = "fr_normal";
                var background = "bg_grass";
                if (this.villageCells.has(cell)) {
                    background = "bg_village";
                }
                else if (this.trebuchetCells.has(cell)) {
                    background = "bg_trebuchet";
                }
                else if (combinedRange.has(cell)) {
                    background = "bg_trebuchet_and_village_range";
                }
                else if (villageRange.has(cell)) {
                    background = "bg_village_range";
                }
                else if (trebuchetRange.has(cell)) {
                    background = "bg_trebuchet_range";
                }

                drawSprite(sprites(background), cell.cx, cell.cy);
                drawSprite(sprites(frame), cell.cx, cell.cy);
            }
        }

        this.trebuchets.forEach(t => {
            if (t.state == TrebuchetState.LOAD_OR_MOVE) {
                drawSprite(sprites("fr_trebuchet_load_or_move"), t.cell.cx, t.cell.cy);
            }
            if (t.state == TrebuchetState.FIRE) {
                drawSprite(sprites("fr_trebuchet_fire"), t.cell.cx, t,cell.cy);
            }
        });

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.activeTrebuchet.cell == this.hoveredCell) {
                    drawText("Click to load or hover over another cell to move", 600, 780);
                }
                else {
                    drawText("Click to move here", 600, 780);
                }
            }
            if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                drawText("Click on a village to attack it", 600, 780);
            }
        }
    },

    levelWon() {
        return this.villages.size == 0 && this.trebuchets.size > 0;
    },

    levelLost() {
        return this.trebuchets.size == 0;
    }
};
