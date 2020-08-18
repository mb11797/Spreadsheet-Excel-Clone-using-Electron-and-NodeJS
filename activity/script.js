const $ = require("jquery")
//document => when HTML page is loaded in the browser it is called as document

$(document).ready(function(){
    //console.log('Jquery Loaded);
    $("#grid .cell").on('click', function(){
        let colId = Number($(this).attr("c-id"));
        let rowId = Number($(this).attr("r-id"));

        let value = String.fromCharCode(65 + colId) + (rowId + 1);
        $("address-input").val(value);
    })

})