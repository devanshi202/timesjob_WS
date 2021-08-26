let xlsx = require("xlsx");
let fs = require("fs");
function excelReader(filepath, sheetname){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);//given filepath se workbook read 
    let ws= wb.Sheets[sheetname];//workbook se worksheet ke form me data read
    let data = xlsx.utils.sheet_to_json(ws);//excel sheet form se json form me data read
    return data;//jason data return..
}
function excelWrite(filepath, sheetname, jsonData){
    let nw = xlsx.utils.book_new();//creating a new workbook
    let ns = xlsx.utils.json_to_sheet(jsonData);//converting jason data into sheet (excel form)
    xlsx.utils.book_append_sheet(nw, ns, sheetname);//appending sheet to workbook
    xlsx.writeFile(nw, filepath);//finally creating a excel file(workbook) at a location
}