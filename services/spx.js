const puppeteer = require('puppeteer');
const express = require("express");
const path = require('path');
const fetch = require("node-fetch");
const router = express.Router();
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const catchAsync = require("./../catchAsync");
var x = {};
var arrTotal = [];
var xy = 0;

exports.spx = catchAsync(async (code, res) => {
    xy++;
    const bro = await puppeteer.launch({
        // headless:false,
        executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        userDataDir: 'C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
        args: [
            // '--user-data-dir=C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
            '--profile-directory=Profile 5'
        ]
        //args: minimal_args,
        // userDataDir: "C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data",
        // args: [
        //     '--profile-directory=Profile 5'
        // ]

    });
    const page = await bro.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });
    const start = Date.now();
    await page.goto("https://spx.vn/", {
        //waitUntil: 'domcontentloaded'
        waitUntil: 'networkidle2'
    });
    var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
    await a.click()
    await a.type(String(code));
    var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
    await Promise.all([
        b.click(),
        page.waitForSelector('div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0')
    ]);
    const results = await page.evaluate(() => {
        var a = document.querySelector("div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0").innerHTML;
        return a;
    });
    //console.log(results)

    //await bro.close();

    var q = {
        m: results,
        n: code
    }
    arrTotal.push(q);
    console.log(code + ' Time:', Date.now() - start, 'ms');
    console.log(arrTotal.length);
    console.log("xySPX1: " + xy);
    name(xy);

    function name(xy) {
        if (arrTotal.length == xy) {
            res //ngat cuoi cung
        } else {
            xy++;
        }
        xy++;
    }
    console.log("xySPX2: " + xy);

});