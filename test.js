const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');
const readline = require('readline');
const argentinaBaseUrl="https://www.linkedin.com/jobs/search/?f_E=4%2C5%2C6&f_TPR=r86400&f_WT=2%2C3&geoId=100446943&keywords=";
const latamBaseUrl="https://www.linkedin.com/jobs/search/?f_E=4%2C5%2C6&f_TPR=r86400&f_WT=2&geoId=91000011&keywords=";



var crapCompanyMap = new Map();
var companyMap = new Map();
var jobsBySkils = new Map();

var tecnologyJobList = new Map();
var seniorityJobList = new Map();
var tarascaJobList = new Map();





function delay(timeInSeconds) {
    return new Promise(resolve => setTimeout(resolve, timeInSeconds * 1000));
}

async function runTest() {

    processFileLineByLine('data.txt');



    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless=new')) // Optional: configure Chrome options
        .build();



    //await login(driver);

    await processAll(driver,argentinaBaseUrl,true);

    await processAll(driver,latamBaseUrl,false);

    await listNewCompanies();

    for (const key of tarascaJobList.keys()) {
        if (tecnologyJobList.has(key) && seniorityJobList.has(key)){
            console.log(key+" "+tarascaJobList.get(key).company+" "+tarascaJobList.get(key).company+" "+tarascaJobList.get(key).jobTitle)
        }
    }



    await driver.quit();
}


async function processAll(driver,baseUrl,argentina){


    //await login(driver);

    var url=baseUrl+"java";
    await processUrl(driver,url,tecnologyJobList);
    console.log("tecnologyJobList "+tecnologyJobList.size);

    url=baseUrl+"selenium";
    await processUrl(driver,url,tecnologyJobList);
    console.log("tecnologyJobList "+tecnologyJobList.size);

    url=baseUrl+"qa";
    await processUrl(driver,url,tecnologyJobList);
    console.log("tecnologyJobList "+tecnologyJobList.size);

    url=baseUrl+"jenkins";
    await processUrl(driver,url,tecnologyJobList);
    console.log("tecnologyJobList "+tecnologyJobList.size);



    url=baseUrl+"lider";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"leader";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"lead";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"bachelor";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"engineer";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"ingeniero";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);

    url=baseUrl+"senior";
    await processUrl(driver,url,seniorityJobList);
    console.log("seniorityJobList "+seniorityJobList.size);


    ///// tarasca
    if (argentina) {
        url = baseUrl + "osde";
        await processUrl(driver,url,tarascaJobList);

        url = baseUrl + "prepaga";
        await processUrl(driver,url,tarascaJobList);

        url = baseUrl + "bono";
        await processUrl(driver,url,tarascaJobList);

        url = baseUrl + "bonus";
        await processUrl(driver,url,tarascaJobList);
    }else {
        url = baseUrl + "argentina";
        await processUrl(driver,url,tarascaJobList);

        url = baseUrl + "remote";
        await processUrl(driver,url,tarascaJobList);

        url = baseUrl + "remoto";
        await processUrl(driver,url,tarascaJobList);
    }

    url = baseUrl + "usd";
    await processUrl(driver,url,tarascaJobList);



}


async function processUrl(driver,url,jobsMap) {


    await driver.get(url);

    try {
        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//button[@data-tracking-control-name='public_jobs_contextual-sign-in-modal_modal_dismiss']"))), 5000);
    }catch (error){
        //ignore it does not exist
    }
    const elements = await driver.findElements(By.xpath("//button[@data-tracking-control-name='public_jobs_contextual-sign-in-modal_modal_dismiss']"));
    if (elements.length > 0) {
        element = elements[0];
        var present=false
        try {
            await driver.wait(until.elementIsVisible(element), 5000);
            present=true;
        }catch (error){
            //ignore it does not exist
        }
        if (present){
            await element.click();
        }
    }


    var webElementList;
    var present=false;
    try{
        webElementList = await driver.findElements(By.xpath("//button//*[@id='close-small']"));
        present=true;
    }catch (NoSuchElementError){

        console.log("no se pudo recuperar el titulo "+href);
        //ignore?
    }
    if (present){
        for (let item of webElementList) {
            var present2=false;
            try {
                await driver.wait(until.elementIsVisible(item), 5000);
                present2=true;
            }catch (error){
                //ignore it does not exist
            }
            if (present2){
                await item.click();
            }
        }
    }


    await driver.executeScript("window.scrollBy(0, document.body.scrollHeight);");
    delay(5);
    await driver.executeScript("window.scrollBy(0, document.body.scrollHeight);");

    let elementsList = await driver.findElements(By.xpath("//a[contains(@href, '/jobs/view')]/../.."));

    for (const element of elementsList) {
        element2 = await element.findElement(By.xpath(".//div/h4"));
        let company = await element2.getText();

        if (crapCompanyMap.has(company)){
            const companyObject=crapCompanyMap.get(company);
            if (companyObject.crap=="true"){
                continue;
            }
        }

        element3 = await element.findElement(By.xpath("*/a[contains(@href, '/jobs/view')]"));
        let href = await element3.getAttribute("href");

        href=href.slice(0,href.indexOf("?"))

        var jobTitle="N/A";
        present=false;
        try{
            //element4 = await element.findElement(By.xpath(".//a/span"));
            element4 = await element.findElement(By.xpath(".//div/h3"));
            present=true;
        }catch (NoSuchElementError){
            //ignore?
        }
        if (present){
            jobTitle = await element4.getText();
        }

        const jobOfferObject = {
            url: href,
            jobTitle: jobTitle,
            company: company,
            crap: false
        };

        const companyObject = {
            company: company,
            count: 1,
            crap: false
        };


        if (!jobsMap.has(href)) {
            jobsMap.set(href,jobOfferObject);
        }

        if (!crapCompanyMap.has(company)){
            if (!companyMap.has(company)) {
                companyMap.set(company,companyObject);
            }else{
                let count = companyMap.get(company).count+1;
                const companyObject2 = {
                    company: company,
                    count: count,
                    crap: false
                };
                companyMap.set(company,companyObject2);
            }
        }

    }


}


async function listNewCompanies() {
    for (const [key, value] of companyMap) {
        console.log(companyMap.get(key).count+" "+key);
    }
}

async function processFileLineByLine(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // Handle all common newline characters
    });

    for await (const line of rl) {
        const position=line.indexOf(";");
        const name = line.slice(0,position);
        const crap = line.slice(position+1);

        const crapCompanyObject = {
            company: name,
            crap: crap
        };

        crapCompanyMap.set(name,crapCompanyObject)
    }

    console.log('Finished reading file line by line.');
}


runTest();