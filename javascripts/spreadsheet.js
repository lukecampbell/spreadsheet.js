var focusedCell=null;

function onCellEdit(event){
    var target = event.target;
    if(target.tagName.toLowerCase() === 'td') {  
        console.log(target.parentNode.rowIndex,target.cellIndex);
        if(target==focusedCell) {
            focuedCell = null;
            cellUnfocus(target);
            cellEdit(target);
        } else {
            cellFocus(target);
        }
    } 
}
function cellEdit(cell){
    cell.contentEditable = true;
    cell.addEventListener('blur',onCellExit,true);
    cell.addEventListener('keydown',onCellKey,true);
    cell.focus();
}

function cellUnfocus(cell) {
    cell.className = cell.className.replace(" focus","");
}

function cellFocus(cell) {
    //console.log(cell);
    //console.log(cell.className);
    if (focusedCell != null) {
        cellUnfocus(focusedCell);
        focusedCell = null;
    }
    if (cell.className.search("focus") <1) {
        var newClassName = cell.className + " focus";
        //console.log(newClassName);
        cell.className = cell.className + " focus";
        focusedCell = cell;
    }
}

function onCellExit(event){
    cellExit(event.target);
}
function cellExit(cell){
    cell.contentEditable = false;
    cell.removeEventListener('blur',onCellExit,true);
    cell.removeEventListener('keydown',onCellKey,true);
    cell.blur();
}
function onCellKey(event){
    var key  = event.keyCode;
    var cell = event.target;
    //console.debug("Key: ");
    //console.log(key);
    switch(key){
        case  9: onTab(cell,event.shiftKey); event.stopPropagation(); event.preventDefault(); return false; break;
        case 27: cellExit(cell);  return false; break;
        case 37: onArrowLf(cell); return false; break;
        case 38: onArrowUp(cell); return false; break;
        case 39: onArrowRg(cell); return false; break;
        case 40: onArrowDn(cell); return false; break;
    }
}
function onArrowLf(event){
    //
}
function onArrowUp(cell){
    //console.log(cell.parentNode.rowIndex,cell.cellIndex)
    var table = $('sheet');
    var row   = table.rows[cell.parentNode.rowIndex-1];

    cellEdit(row.cells[cell.cellIndex]);
}
function onArrowRg(event){
    //
}
function onArrowDn(cell){
    var table = $('sheet');
    var row   = table.rows[cell.parentNode.rowIndex+1];
    cellEdit(row.cells[cell.cellIndex]);
}
function onTab(cell,shift){
    //console.log('TAB',shift);
    var table = $('sheet');
    var row = cell.parentNode;
    if(shift){
        if(cell.cellIndex<1){
            if(row.rowIndex>0){ /* check first row */
                row = table.rows[cell.parentNode.rowIndex-1];
                cellEdit(row.cells[row.cells.length-1]);
            }
        } else {
            cellEdit(row.cells[cell.cellIndex-1]);
        }
    } else {
        if(row.cells.length>cell.cellIndex+1){
            cellEdit(row.cells[cell.cellIndex+1]);
        } else {
            if(row.rowIndex<table.rows.length-1){ /* check last row */
                row = table.rows[cell.parentNode.rowIndex+1];
                cellEdit(row.cells[0]);
            }
        }
    }
}
function $(id){
    return document.getElementById(id);
}

function keyboardManager(event) {
    //console.log('Key Event');
    var key = event.keyCode;
    //console.log('Key: ' + key);

    switch(key) {
        case 13:
            //console.log('Hit enter');
            event.stopPropagation();
            event.preventDefault();
            cellEdit(focusedCell);
            cellUnfocus(focusedCell);
            return false;
            break;
    }
}

function main(){
    $('sheet').addEventListener('click',onCellEdit,true);
    document.addEventListener('keydown', keyboardManager, true);
}
