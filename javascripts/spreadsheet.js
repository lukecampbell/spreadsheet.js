/*
 * spreadsheet.js
 * Author: Not really Luke Campbell but I added some stuff
 * Source: georgenava.appspot.com/demo/spreadsheet.html
 */

function Spreadsheet(container) {
    this.focusedCell = null;
    this.sheet = container.getElementById('sheet');
    container.addEventListener('click',this, true);
    container.addEventListener('keydown', this, true);
};

Spreadsheet.prototype.handleEvent = function(event) {
    return this[event.type](event);
} ;


Spreadsheet.prototype.click = function(event) {
    var target = event.target;
    if(this.isTd(target)) {  
        if(target==this.focusedCell) {
            this.cellUnfocus(target);
            this.cellEdit(target);
        } else {
            this.cellFocus(target);
        }
    } else {
        this.cellUnfocus(target);
    }

}

Spreadsheet.prototype.isTd = function (element) {
    return (element.tagName.toLowerCase() === 'td');
}

Spreadsheet.prototype.keydown = function(event) {
    var target = event.target;
    var key  = event.keyCode;
    if(this.isTd(target) ) {
        var cell = target;
        //console.debug("Key: ");
        //console.log(key);
        switch(key){
            case  9: this.onTab(cell,event.shiftKey); event.stopPropagation(); event.preventDefault(); return false; break;
            case 27: this.cellExit(cell);  return false; break;
            case 37: this.onArrowLf(cell); return false; break;
            case 38: this.onArrowUp(cell); return false; break;
            case 39: this.onArrowRg(cell); return false; break;
            case 40: this.onArrowDn(cell); return false; break;
        }
    }
    else {
        switch(key) {
            case 13:
                //console.log('Hit enter');
                event.stopPropagation();
                event.preventDefault();
                this.cellEdit(this.focusedCell);
                this.cellUnfocus(this.focusedCell);
                return false;
                break;
            case 27:
                this.cellUnfocus(this.focusedCell); return false; break;
            case 37:
                this.focusLf(); return false; break;
            case 38:
                this.focusUp(); return false; break;
            case 39:
                this.focusRg(); return false; break;
            case 40:
                this.focusDn(); return false; break;

        }
    }
}

Spreadsheet.prototype.blur = function(event) {
    if(this.isTd(event.target)) {
        this.cellExit(event.target);
        this.cellFocus(event.target);
    }
}

Spreadsheet.prototype.cellEdit = function(cell) {
    cell.contentEditable = true;
    cell.addEventListener('blur', this, true);
    cell.addEventListener('keydown',this,true);
    cell.focus();
};

Spreadsheet.prototype.cellUnfocus = function(cell) {
    cell.className = cell.className.replace(" focus","");
    if(this.focusedCell==cell) {
        this.focusedCell = null ;
    }

};

Spreadsheet.prototype.cellFocus = function(cell) {
    if (this.focusedCell != null) {
        this.cellUnfocus(this.focusedCell);
    }
    if (cell.className.search("focus") <1) {
        var newClassName = cell.className + " focus";
        //console.log(newClassName);
        cell.className = cell.className + " focus";
        this.focusedCell = cell;
    }
};

Spreadsheet.prototype.onCellExit = function(event){
    this.cellExit(event.target);
};
Spreadsheet.prototype.cellExit = function(cell){
    cell.contentEditable = false;
    cell.removeEventListener('blur',this.onCellExit.bind(this),true);
    cell.removeEventListener('keydown',this.onCellKey.bind(this),true);
    cell.blur();
};
Spreadsheet.prototype.onCellKey = function(event){
};
Spreadsheet.prototype.onArrowLf = function(event){
    //
};
Spreadsheet.prototype.onArrowUp = function(cell){
    //console.log(cell.parentNode.rowIndex,cell.cellIndex)
    var row   = this.sheet.rows[cell.parentNode.rowIndex-1];

    this.cellEdit(row.cells[cell.cellIndex]);
};
Spreadsheet.prototype.onArrowRg = function(event){
    //
};

Spreadsheet.prototype.focusUp = function() {
    if(this.focusedCell == null) {
        return;
    }
    var row = this.sheet.rows[this.focusedCell.parentNode.rowIndex-1];
    var cell = row.cells[this.focusedCell.cellIndex];
    this.cellUnfocus(this.focusedCell);
    this.cellFocus(cell);
}
Spreadsheet.prototype.focusDn = function () {
    if(this.focusedCell == null) {
        return;
    }
    var row = this.sheet.rows[this.focusedCell.parentNode.rowIndex+1];
    var cell = row.cells[this.focusedCell.cellIndex];
    this.cellUnfocus(this.focusedCell);
    this.cellFocus(cell);
}
Spreadsheet.prototype.focusRg = function () {
    if(this.focusedCell == null) {
        return;
    }
    var cell = this.focusedCell;
    this.cellUnfocus(cell);
    var row = cell.parentNode;
    if(row.cells.length > cell.cellIndex + 1) {
        this.cellFocus(row.cells[cell.cellIndex+1]);
    } 
}

Spreadsheet.prototype.focusLf = function () {
    if(this.focusedCell == null) {
        return;
    }
    var cell = this.focusedCell;
    this.cellUnfocus(cell);
    var row = cell.parentNode;
    if(cell.cellIndex > 0) {
        this.cellFocus(row.cells[cell.cellIndex-1]);
    }
}



Spreadsheet.prototype.onArrowDn = function(cell){
    var row   = this.sheet.rows[cell.parentNode.rowIndex+1];
    this.cellEdit(row.cells[cell.cellIndex]);
};
Spreadsheet.prototype.onTab = function(cell,shift){
    //console.log('TAB',shift);
    var row = cell.parentNode;
    if(shift){
        if(cell.cellIndex<1){
            if(row.rowIndex>0){ /* check first row */
                row = this.sheet.rows[cell.parentNode.rowIndex-1];
                this.cellEdit(row.cells[row.cells.length-1]);
            }
        } else {
            this.cellEdit(row.cells[cell.cellIndex-1]);
        }
    } else {
        if(row.cells.length>cell.cellIndex+1){
            this.cellEdit(row.cells[cell.cellIndex+1]);
        } else {
            if(row.rowIndex<this.sheet.rows.length-1){ /* check last row */
                row = this.sheet.rows[cell.parentNode.rowIndex+1];
                this.cellEdit(row.cells[0]);
            }
        }
    }
};
Spreadsheet.prototype.keyboardManager = function(event) {
    //console.log('Key Event');
    var key = event.keyCode;
    //console.log('Key: ' + key);

    switch(key) {
        case 13:
            //console.log('Hit enter');
            event.stopPropagation();
            event.preventDefault();
            this.cellEdit(this.focusedCell);
            this.cellUnfocus(this.focusedCell);
            return false;
            break;
    }
};

