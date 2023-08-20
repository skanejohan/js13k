// uses "odd-q" vertical layout as described in https://www.redblobgames.com/grids/hexagons/
// each cell is { col, row, cx, cy, q, r, s } where cx and cy are offset coords, q, r, s are cube coords

var createHexGrid = (sideLength, noOfCols, noOfRows, leftMargin, topMargin) => {

    var H, R;
    var cells = [];
    var cellsByCubeCoords = {}; // For fast lookup from cube coords

    var addCellByCubeCoords = cell => {
        cellsByCubeCoords[`${cell.q},${cell.r},${cell.s}`] = cell;
    }

    var getCellByCubeCoords = (q, r, s) => {
        return cellsByCubeCoords[`${q},${r},${s}`];
    }

    var create = () => {
        H = sideLength * Math.sin(30 * Math.PI / 180);
        R = sideLength * Math.cos(30 * Math.PI / 180);
    
        // Row 0 - actually calculate x and y
        cells[0] = [];
        for (var c = 0; c < noOfCols; c++) {
            var yOffset = c % 2 == 0 ? 0 : R;
            var cx = Math.trunc(leftMargin + H + sideLength / 2 + c * (sideLength + H));
            var cy = Math.trunc(topMargin + R + yOffset);
            var q = c;
            var r = 0 - (c - (c & 1)) / 2;
            var s = -q-r;
            cells[0][c] = { col: c, row: 0, cx: cx, cy: cy, q: q, r: r, s: s };
            addCellByCubeCoords(cells[0][c]);
        }

        // Subsequent rows - just increase y
        for (var rw = 1; rw < noOfRows; rw++) {
            cells[rw] = [];
            for (var c = 0; c < noOfCols; c++) {
                var cx = cells[rw - 1][c].cx;
                var cy = Math.trunc(cells[rw - 1][c].cy + 2 * R);
                var q = c;
                var r = rw - (c - (c & 1)) / 2;
                var s = -q-r;
                cells[rw][c] = { col: c, row: rw, cx: cx, cy: cy, q: q, r: r, s: s };
                addCellByCubeCoords(cells[rw][c]);
            }
        }
    }

    this.cell = (col, row) => { 
        return cells[row][col]; 
    }

    this.distance = (cell1, cell2) => {
        var dq = Math.abs(cell1.q - cell2.q);
        var dr = Math.abs(cell1.r - cell2.r);
        var ds = Math.abs(cell1.s - cell2.s);
        return (dq + dr + ds) / 2;
    }

    this.neighbors = (cell, distance) => {
        var d = distance == undefined ? 1 : distance;
        var neighbors = new Set();
        for (var q = -d; q <= d; q++) {
            for (var r = Math.max(-d, -q-d); r <= Math.min(d, -q+d); r++) {
                var s = -q-r
                var n = getCellByCubeCoords(cell.q + q, cell.r + r, cell.s +s); 
                if (n) {
                    neighbors.add(n);
                }
            }
        }
        return neighbors;
    }

    this.enclosingCell = (x, y) => {
        var cell = undefined;
        var minDistSquared = (sideLength / 2 + H) * (sideLength / 2 + H);
        for (var r = 0; r < noOfRows; r++) {
            for (var c = 0; c < noOfCols; c++) {
                var candidate = this.cell(c, r);
                var distSquared = (candidate.cx - x) * (candidate.cx - x) + (candidate.cy - y) * (candidate.cy - y);
                if (distSquared < minDistSquared) {
                    cell = candidate;
                    minDistSquared = distSquared;
                }
            }
        }
        return cell;
    }

    create();

    return {
        cell: this.cell, // col, row -> cell
        distance: this.distance, // cell, cell -> n
        neighbors: this.neighbors, // cell -> Set(cell)
        enclosingCell: this.enclosingCell, // mouse x, mouse y -> cell
    }
}
