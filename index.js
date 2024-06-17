/*
    File: index.js
    GUI Assignment: Using the JQuery Plugin with Dynamic Table
    Graham Laroche, graham_laroche@student.uml.edu
    6/13/2024
    A script that uses a form to generate a multiplication table.
*/
const MAX_RANGE = 100;    //Maximum number of rows or columns
const MAX_VALUE = 500;    //Highest valid number input 
let tableCreated = false; //Whether or not a table exists

//Add custom validation rules
jQuery.validator.addMethod('integer',  isValidInteger, 'Integer numbers are required.');
jQuery.validator.addMethod('validSize', isValidSize,
    'Numbers cannot be larger than 500, or smaller than -500.');
jQuery.validator.addMethod('lessThan', isLessThan, 
    'Minimum values cannot be greater than maximum values.');
jQuery.validator.addMethod('greaterThan', isGreaterThan,
    'Maximum values cannot be less than minimum values.');
jQuery.validator.addMethod('validRange', isValidRange, 
    'There cannot be more than 100 rows or 100 columns. Try increasing min values or decreasing max values.')

//Implement custom validation rules for text input boxes
jQuery.validator.addClassRules('numberInput', {
    required: true,
    number: true,
    integer: true,
    validSize: true
});
$('#multForm').validate({
    rules: {
        minCol: {
            lessThan: '#maxCol',
            validRange: '#maxCol'
        },
        maxCol: {
            greaterThan: '#minCol',
            validRange: '#minCol'
        },
        minRow: {
            lessThan: '#maxRow',
            validRange: '#maxRow'
        },
        maxRow: {
            greaterThan: '#minRow',
            validRange: '#minRow'
        }
    }
});

// Returns true if value is an integer, false otherwise
function isValidInteger(value) {
    return Number.isInteger(Number(value));
}

// Returns true if value is less than or equal to a max value constant, false otherwise
function isValidSize(value) {
    return Number(value) <= MAX_VALUE;
}

// Returns true if value is less than or equal to param's value, false otherwise
function isLessThan(value, _element, param) {
    if (value == '' || $(param).val() == ''){
        return true;
    }
    else if (!isValidInteger(value) || !isValidInteger($(param).val())){
        return true;
    }
    return (Number(value) <= Number($(param).val()));
}

// Returns  true if value is greater than or equal to param's value, false otherwise
function isGreaterThan(value, _element, param) {
    if (value == '' || $(param).val() == ''){
        return true;
    }
    else if (!isValidInteger(value) || !isValidInteger($(param).val())){
        return true;
    }
    return Number(value) >= Number($(param).val());
}

// Returns true if the absolute difference between value and param's value is 100, false otherwise
function isValidRange(value, _element, param) {
    if (value == '' || $(param).val() == ''){
        return true;
    }
    else if (!isValidInteger(value) || !isValidInteger($(param).val())){
        return true;
    }
    return Math.abs(Number(value) - Number($(param).val())) <= MAX_RANGE;
}

// Updates error messages for each of the text inputs
function revalidateInputs(){
    $('.numberInput').valid();
}

// Returns true if form is valid, false otherwise
function isValidForm() {
    return $('#multForm').valid()
}

/*
    Adds rows and collumns to an HTML table element.
    @param minCol   Number   The minimum column value
    @param maxCol   Number   The maximum column value
    @param minRow   Number   The minimum row value
    @param maxRow   Number   The maximum row value
*/
function createTable(minCol, maxCol, minRow, maxRow) {
    if(!tableCreated) {
        tableCreated = true;
    }

    let newTable = document.createElement('table'); // HTML table that will be saved to a tab
    
    let i, j; // Used for iterating the following for loops

    appendRow(newTable);
    appendColumn(0, null, 'td', newTable)
    for (i = minCol; i <= maxCol; i+=1){
        appendColumn(0, i, 'th', newTable);
    }

    for (i = minRow; i <= maxRow; i+=1) {
        appendRow(newTable);
        appendColumn(i-minRow+1, i, 'th', newTable)
        for (j = minCol; j <= maxCol; j+=1) {
            appendColumn(i-minRow+1, i*j, 'td', newTable);
        }
    }

    return newTable;
}

// Deletes the table and all rows of the table
function clearTable() {
    let table = $('#multTable')[0];
    
    let rowCount = table.rows.length;

    for(let i = 0; i < rowCount; i+=1) {
        table.deleteRow(0);
    }
    table.remove();
}

// Destroys the old table and replaces it with a new one
function updateTable() {
    if (!isValidForm()) {
        return;
    }
    clearTable();

    let minCol = Number($('#minCol').val());
    let maxCol = Number($('#maxCol').val());
    let minRow = Number($('#minRow').val());
    let maxRow = Number($('#maxRow').val());


    let table = createTable(minCol, maxCol, minRow, maxRow);
    $('#tableContainer').append(table);
}

//  Appends a <tr> tag to the multiplication table.
function appendRow(newTable) {
    let row = document.createElement('tr'); // Create table row element.
    newTable.appendChild(row);
}

/*
    Appends a <td> or a <th> tag to a <tr> element.
    @param rowIndex   Number   Specifies which row is being appended to
    @param value      Number   This is what is displayed in the table data element
    @param cellType   String   The name of the html element being created
*/
function appendColumn(rowIndex, value, cellType, newTable) {
    if(cellType != 'td' && cellType != 'th'){
        throw 'ERROR: tried to append invalid Column type!';
    }
    let col = document.createElement(cellType); // Create table data element.
    col.textContent = value;
    newTable.children[rowIndex].appendChild(col);
}