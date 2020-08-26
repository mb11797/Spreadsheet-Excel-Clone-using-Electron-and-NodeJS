const $ = require("jquery")
const fs = require("fs")
//document => when HTML page is loaded in the browser it is called as document

const dialog = require("electron").remote.dialog;
$(document).ready(function () {
    // console.log('Jquery Loaded');
    let db;         // database
    let lsc;        // last selected cell

    $(".content-container").on("scroll", function () {
        let scrollY = $(this).scrollTop();
        let scrollX = $(this).scrollLeft();
        //console.log(scrollY);
        $("#top-row, #top-left-cell").css("top", scrollY + "px");
        $("#top-left-cell, #left-col").css("left", scrollX + "px");
    })

    $("#grid .cell").on("keyup", function () {
        let { rowId } = getrc(this);
        let ht = $(this).height();
        // $("#left-col .cell").eq(rowId).height(ht);
        $($("#left-col .cell")[rowId]).height(ht);
    })

    $(".menu").hover(function () {
        let id = $(this).attr("id");
        // File
        $(".menu-options").removeClass("selected");
        $(`#${id}-menu-options`).addClass("selected");
    })

    $(".menu").on("click", function () {
        let id = $(this).attr("id");
        // File
        $(".menu-options").removeClass("selected");
        $(`#${id}-menu-options`).addClass("selected");
    })

    let lcell;
    $("#grid .cell").on('click', function () {
        let { colId, rowId } = getrc(this);
        let value = String.fromCharCode(65 + colId) + (rowId + 1);
        console.log(value);
        let cellObj = db[rowId][colId];
        $("#address-input").val(value);

        // set cell formula ???flat?
        // if(db[rowId][colId].formula != ""){
        //     $("#formula-input").html(db[rowId][colId].formula);
        // }
        $("#formula-input").val(cellObj.formula);
        // set cell formula
        if (lcell && this != lcell) {
            $(lcell).removeClass("selected");
        }

        $(this).addClass("selected");
        if (cellObj.bold) {
            $("#bold").addClass("isOn");
        }
        else {
            $("#bold").removeClass("isOn");
        }

        if (cellObj.underline) {
            $("#underline").addClass("isOn");
        }
        else {
            $("#underline").removeClass("isOn");
        }

        if (cellObj.italic) {
            $("#italic").addClass("isOn");
        }
        else {
            $("#italic").removeClass("isOn");
        }

        if(cellObj.halign == "left"){
            $("#align-left").addClass("isOn");
            $("#align-center").removeClass("isOn");
            $("#align-right").removeClass("isOn");
        }
        else{
            $("#align-left").removeClass("isOn");
        }

        if(cellObj.halign == "center"){
            $("#align-center").addClass("isOn");
            $("#align-left").removeClass("isOn");
            $("#align-right").removeClass("isOn");
        }
        else{
            $("#align-center").removeClass("isOn");
        }

        if(cellObj.halign == "right"){
            $("#align-right").addClass("isOn");
            $("#align-left").removeClass("isOn");
            $("#align-center").removeClass("isOn");
        }
        else{
            $("#align-right").removeClass("isOn");
        }

        lcell = this;
    });

    $("#bold").on("click", function () {
        $(this).toggleClass("isOn");
        let isBold = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("font-weight", isBold ? "bolder" : "normal");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        cellObj.bold = isBold;
    })

    $('#underline').on("click", function () {
        $(this).toggleClass("isOn");
        let isUnderline = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("text-decoration", isUnderline ? "underline" : "none");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        cellObj.underline = isUnderline;
    })

    $('#italic').on("click", function () {
        $(this).toggleClass("isOn");
        let isItalic = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("font-style", isItalic ? "italic" : "normal");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        cellObj.italic = isItalic;
    })

    $("#bg-color").on("change", function () {
        let bgColor = $(this).val();
        let cellElem = $("#grid .cell.selected");
        cellElem.css("background-color", bgColor);
        let cellObj = getcell(cellElem);
        cellObj.bgColor = bgColor;
    })

    $("#font-family").on("change", function () {
        let fontFamily = $(this).val();
        $("#grid .cell.selected").css("font-family", fontFamily);
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        cellObj.fontFamily = fontFamily;
    })

    $("#font-size").on("change", function () {
        let fontSize = $(this).val();
        $("#grid .cell.selected").css("font-size", fontSize + "px");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        cellObj.fontSize = fontSize;
    })

    $('#text-color').on("change", function () {
        let textColor = $(this).val();
        let cellElem = $("#grid .cell.selected");
        cellElem.css("color", textColor);
        let cellObj = getcell(cellElem);
        cellObj.textColor = textColor;
    })

    $('#align-left').on("click", function () {
        $(this).toggleClass("isOn");
        $("#align-center").removeClass("isOn");
        $("#align-right").removeClass("isOn");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        let isLeftAlign = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("text-align", isLeftAlign ? "left" : cellObj.halign);
        cellObj.halign = isLeftAlign ? "left" : cellObj.halign;
    })

    $('#align-center').on("click", function () {
        $(this).toggleClass("isOn");
        $("#align-left").removeClass("isOn");
        $("#align-right").removeClass("isOn");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        let isCenterAlign = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("text-align", isCenterAlign ? "center" : cellObj.halign);
        cellObj.halign = isCenterAlign ? "center" : cellObj.halign;
    })

    $('#align-right').on("click", function () {
        $(this).toggleClass("isOn");
        $("#align-left").removeClass("isOn");
        $("#align-center").removeClass("isOn");
        let cellElem = $("#grid .cell.selected");
        let cellObj = getcell(cellElem);
        let isRightAlign = $(this).hasClass("isOn");
        $("#grid .cell.selected").css("text-align", isRightAlign ? "right" : cellObj.halign);
        cellObj.halign = isRightAlign ? "right" : cellObj.halign;
    })

    $("#New").on("click", function () {
        db = [];
        let AllRows = $('#grid').find('.row');
        for (let i = 0; i < AllRows.length; i++) {
            let row = [];
            let AllCols = $(AllRows[i]).find('.cell');
            for (let j = 0; j < AllCols.length; j++) {
                // DB
                let cell = {
                    value: "",
                    formula: "",
                    downstream: [],
                    upstream: [],
                    bold: false,
                    underline: false,
                    italic: false,
                    fontFamily: "Arial",
                    fontSize: 12,
                    bgColor: "white",
                    textColor: "black",
                    halign: "left"
                }
                // $(`#grid .cell[r-id=${i}][c-id=${j}]`).html('');
                $(AllCols[j]).html('');
                //JS ki help se CSS set kar rahe hain hum:
                //states of current cell elmt:
                $(AllCols[j]).css("font-weight", cell.bold ? "bolder" : "normal");
                $(AllCols[j]).css("font-style", cell.italic ? "italic" : "normal");
                $(AllCols[j]).css("text-decoration", cell.underline ? "underline" : "none");
                $(AllCols[j]).css("font-family", cell.fontFamily);
                $(AllCols[j]).css("font-size", cell.fontSize + "px");
                $(AllCols[j]).css("color", cell.textColor);
                $(AllCols[j]).css("background-color", cell.bgColor);
                $(AllCols[j]).css("text-align", cell.halign);

                row.push(cell);
            }
            db.push(row);
        }
        console.log(db);

        // let AllRows = $("#grid").find(".row");
        // for (let i = 0; i < AllRows.length; i++) {
        //     let AllCols = $(AllRows[i]).find(".cell");
        //     for (let j = 0; j < AllCols.length; j++) {
        //         //    DB
        //         $(`#grid .cell[r-id=${i}][c-id=${j}]`).html(db[i][j].value);
        //     }
        // }

        // $("grid .cell").eq(0).trigger("click");
        let cellArr = $("#grid .cell");
        $(cellArr[0]).trigger("click");
        return;
    })

    $("#Save").on("click", async function () {
        // showDialogBox
        let sdb = await dialog.showOpenDialog();
        //file path
        let fp = sdb.filePaths[0];
        if (fp == undefined) {
            console.log("Please select file first");
            return;
        }

        let jsonData = JSON.stringify(db);
        fs.writeFileSync(fp, jsonData);

        // open dialogBox
        // select file
        // write
        // Input => file

    })

    $("#Open").on("click", async function () {
        // show dialog box
        let sdb = await dialog.showOpenDialog();
        let fp = sdb.filePaths[0];
        if (fp == undefined) {
            console.log("Please select file first");
            return;
        }

        let buffer = fs.readFileSync(fp);
        db = JSON.parse(buffer);
        let AllRows = $("#grid").find(".row");
        for (let i = 0; i < AllRows.length; i++) {
            let AllCols = $(AllRows[i]).find(".cell");
            for (let j = 0; j < AllCols.length; j++) {
                // DB
                let cell = db[i][j];
                // $(`#grid .cell[row-id=${i}][col-id=${j}]`).html(db[i][j].value);
                $(AllCols[j]).html(cell.value);
                $(AllCols[j]).css("font-weight", cell.bold ? "bolder" : "normal");
                $(AllCols[j]).css("font-style", cell.italic ? "italic" : "normal");
                $(AllCols[j]).css("text-decoration", cell.underline ? "underline" : "none");
                $(AllCols[j]).css("font-family", cell.fontFamily);
                $(AllCols[j]).css("font-size", cell.fontSize);
                $(AllCols[j]).css("color", cell.textColor);
                $(AllCols[j]).css("background-color", cell.bgColor);
                $(AllCols[j]).css("text-align", cell.halign);
            }
        }
    })

    // ****************Formula Stuff starts here****************
    // val => val
    // formula => val
    $('#grid .cell').on('blur', function () {
        let { colId, rowId } = getrc(this);
        let cellObj = getcell(this);
        // if you randomly click on any cell
        lsc = this;
        if (cellObj.value == $(this).html()) {
            // lsc = this;
            return;
        }

        if (cellObj.formula) {
            rem_us_n_ds(cellObj, this);
        }

        cellObj.value = $(this).text();
        update_cell(rowId, colId, cellObj.value);
        //console.log(db);
        // lsc = this;
    })

    // val => formula convert
    // formula => new formula
    $("#formula-input").on("blur", function () {
        let cellObj = getcell(lsc);
        if (cellObj.formula == $(this).val()) {
            return;
        }

        let { colId, rowId } = getrc(lsc);

        if (cellObj.formula) {
            // delete formula -> remove upstream and downstream
            rem_us_n_ds(cellObj, lsc);
        }

        cellObj.formula = $(this).val();
        //add formula
        set_us_n_ds(lsc, cellObj.formula);
        // 4. Calculate value from formula
        let nVal = evaluate(cellObj);
        console.log(nVal);
        // update your cell
        update_cell(rowId, colId, nVal);
    });

    // upstream => go to your upstream => get there values
    function evaluate(cellObj) {
        // upstream => go to your upstream => get there values
        // ( A1 + A11 + A1 ) => [(, A1, +, A11, +, A1, )] => [(, 10, +, A11, +, 10, )] => ( 10 + A11 + 10 )
        //  ( 10 + 20 )
        // JS => eval => to evaluate expressions in JS
        let formula = cellObj.formula;
        console.log(formula);
        for (let i = 0; i < cellObj.upstream.length; i++) {
            // chhota upstream object
            let cuso = cellObj.upstream[i];
            // rid, id => A1
            let colAddress = String.fromCharCode(cuso.colId + 65);
            let cellAddress = colAddress + (cuso.rowId + 1);
            // full upstream object
            let fusokival = db[cuso.rowId][cuso.colId].value;
            let formulaCompArr = formula.split(" ");
            formulaCompArr = formulaCompArr.map(function (elem) {
                if (elem == cellAddress) {
                    return fusokival;
                }
                else {
                    return elem;
                }
            })

            formula = formulaCompArr.join(" ");
        }

        console.log(formula);
        // infix evaluations
        return eval(formula);
    }

    function update_cell(rowId, colId, nVal) {
        let cellObj = db[rowId][colId];
        cellObj.value = nVal;
        // update UI
        $(`#grid .cell[row-id=${rowId}][col-id=${colId}]`).html(nVal);

        for (let i = 0; i < cellObj.downstream.length; i++) {
            // downstream coordinates object
            let dsoCoordObj = cellObj.downstream[i];
            let dso = db[dsoCoordObj.rowId][dsoCoordObj.colId];
            let dsonVal = evaluate(dso);
            update_cell(dsoCoordObj.rowId, dsoCoordObj.colId, dsonVal);
        }
    }

    // set yourself to parents downstream and set parents to your upstream
    function set_us_n_ds(cellElem, formula) {
        // (A1 + B1)
        formula = formula.replace("(", "").replace(")", "");
        // "A1 + B1"
        let formulaComponent = formula.split(" ");
        // [A1, +, B1]
        for (let i = 0; i < formulaComponent.length; i++) {
            let charAt0 = formulaComponent[i].charCodeAt(0);
            if (charAt0 > 64 && charAt0 < 91) {
                let { r, c } = getParentRowCol(formulaComponent[i], charAt0);
                let parentCell = db[r][c];

                let { colId, rowId } = getrc(cellElem);        //self
                // 1.
                let cell = getcell(cellElem);
                // add yourself to downstream of your parent
                parentCell.downstream.push({
                    colId: colId, rowId: rowId
                });

                // 2.
                // add curr parent to your upstream
                cell.upstream.push({
                    colId: c,
                    rowId: r
                });
            }
        }
    }

    // delete formula
    function rem_us_n_ds(cellObj, cellElem) {
        // 3.
        cellObj.formula = "";
        let { rowId, colId } = getcell(cellElem);

        for (let i = 0; i < cellObj.upstream.length; i++) {
            // upstream object
            let uso = cellObj.upstream[i];
            // full upstream object
            let fuso = db[uso.rowId][uso.colId];
            // find index splice yourself -> filter yourself from parents downstream arr
            // self -> 00
            // self upstream[i] -> downstream: 01, 00, 02
            let fArr = fuso.downstream.filter(function (dCell) {
                // return dCell.colId != colId || dCell.rowId != rowId;
                return !(dCell.colId == colId && dCell.rowId == rowId);
            })

            fuso.downstream = fArr;

            // let fArr = [];
            // for(let j=0; j<fuso.downstream.length; j++){
            //     if(dCell.colId != colId && dCell.rowId != rowId){
            //         fArr.push(fuso.downstream[i]);
            //     };
            // }
        }
        cellObj.upstream = [];
    }

    // [4, 0] => "40"
    function getParentRowCol(cellName, charAt0) {
        let sArr = cellName.split("");
        sArr.shift();
        let sRow = sArr.join("");
        let r = Number(sRow) - 1;
        let c = charAt0 - 65;
        return {
            r, c
        };
    }

    // get row and col from UI
    function getrc(elmt) {
        let colId = Number($(elmt).attr("col-id"));
        let rowId = Number($(elmt).attr("row-id"));
        return {
            colId, rowId
        }
    }

    // get cell from db
    function getcell(cellElmt) {
        let { colId, rowId } = getrc(cellElmt);
        return db[rowId][colId];
    }

    // constructor -> initializer
    function init() {
        $("#File").trigger("click");
        $("#New").trigger("click");
        // db = [];
        // let AllRows = $('#grid').find('.row');
        // for(let i=0; i<AllRows.length; i++){
        //     let row = [];
        //     let AllCols = $(AllRows[i]).find('.cell');
        //     for(let j=0; j<AllCols.length; j++){
        //         // DB
        //         let cell = {
        //             value: "",
        //             formula: "",
        //             downstream: [],
        //             upstream: []
        //         }

        //         // $(AllCols[j]).html('');
        //         row.push(cell);
        //     }
        //     db.push(row);
        // }
        // console.log(db);
    }

    init();
})


// fuso -> full upstream object
// cuso -> chhota upstream object