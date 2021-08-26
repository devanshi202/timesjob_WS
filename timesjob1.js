let request = require("request");
let cheerio = require("cheerio");
let xlsx = require("xlsx");
let fs= require("fs");
let path = require("path");

let url ="https://www.timesjobs.com/";


request(url, cb);//main site pr request

function cb(err, res, html){
    if(err){
        console.log(err);
    }else if(res.statuscode==404){
        console.log("page not found");
    }else{
        getCategoryOfJobs(html);//main page ka html fetch(list of 6 categories of job)
    }
}



function getCategoryOfJobs(html){
    let selectorTool = cheerio.load(html);
    let ulOfJobs = selectorTool(".top-ind>ul.clearfix>li");
    let jobCategory1 = selectorTool(ulOfJobs[0]).find("a");//information technology page 

    let linksToCategory1=jobCategory1.attr("href");
    //request to info tech page for jobs
    request(linksToCategory1, cb1);
}

function cb1(err, res, html){
    if(err){
        console.log(err);
    }else if(res.statuscode==404){
        console.log("page not found");
    }else{
        // get details of each job in info tech 
        listOfJobsByCategory(html);
    }
}


let dataPath = path.join(__dirname, "jobsData.xlsx");
let jobsArr =[];

function listOfJobsByCategory(html){
    let selectorTool = cheerio.load(html);
    //25 tiles with job lists and descrp
    let eachJob = selectorTool("ul.new-joblist li.clearfix.job-bx.wht-shd-bx");

    for(let i=0; i<eachJob.length; i++){
        let jobName = selectorTool(eachJob[i]).find("h2 a").text().trim();
        let companyName = selectorTool(eachJob[i]).find("h3").text().trim();
        let otherDataArr = selectorTool(eachJob[i]).find("ul li");//other details for same job..

        if(otherDataArr.length==4){
            let experience = selectorTool(otherDataArr[0]).text().substring(15).trim();
            let place = selectorTool(otherDataArr[1]).find("span").text().trim();
            let jobDescription = selectorTool(otherDataArr[2]).text().substring(24, 175).trim();
            let skills = selectorTool(otherDataArr[3]).find("span").text().trim();
            let obj={
            "Job": jobName,
            "Company": companyName,
            "Experience": experience,
            "Place": place,
            "Description": jobDescription,
            "Skills": skills
            }  
            jobsArr.push(obj);
        }   

    }
        excelWrite(dataPath, "Sheet 1", jobsArr)
    
    console.log("data fetched!!");
}

function excelWrite(filepath, sheetname, jsonData){
    let nw = xlsx.utils.book_new();//creating a new workbook
    let ns = xlsx.utils.json_to_sheet(jsonData);//converting jason data into sheet (excel form)
    xlsx.utils.book_append_sheet(nw, ns, sheetname);//appending sheet to workbook
    xlsx.writeFile(nw, filepath);//finally creating a excel file(workbook) at a location
}


