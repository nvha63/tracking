const puppeteer = require('puppeteer');
const express = require("express");
const path = require('path');
const fetch = require("node-fetch");
const router = express.Router();
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const pptr = require('puppeteer-core');
const cheerio = require('cheerio');
const request = require('request');
//var popup = require('popups');
let alert = require('alert');
const spx = require("./services/spx");
const {
    Cluster
} = require('puppeteer-cluster');
const app = express();
const port = 3000;
const minimal_args = require("../minimal");
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));

var x = {};
var arrTotal = [];
var xy = 0;
app.get("/", async (req, res, next) => {
    res.render('form', {
        arrTotal
    });
});

app.post("/", async (req, res, next) => {
    console.log(req.body.name);

    try {
        var arr = req.body.name.split(",");
        //var arr = ["SPXVN021459790824", "GAPAV36C",];SPXVN021459790824,GAPAV36C
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slice(0, 3) == "SPX") {
                //spx(arr[i], res.redirect('/'));
                (async () => {
                    xy++;
                    const bro = await puppeteer.launch({
                        minimal_args

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
                        waitUntil: 'networkidle2',
                        timeout: 60000
                    });
                    var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
                    await a.click()
                    await a.type(arr[i]);
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
                        n: arr[i]
                    }
                    arrTotal.push(q);
                    console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
                    // console.log(arrTotal.length);
                    // console.log("xySPX1: " + xy);
                    name(xy);

                    function name(xy) {
                        if (arrTotal.length == xy) {
                            res.redirect('/'); //ngat cuoi cung
                        } else {
                            xy++;
                        }
                        xy++;
                    }
                    //console.log("xySPX2: " + xy);
                    //res.redirect(req.get('referer'));
                })();
            }
            //ghn
            if (arr[i].slice(0, 2) == "GA") {
                //if (arr[i].slice(0, 2) == "12") {
                (async () => {
                    xy++;
                    const bro = await puppeteer.launch({
                        //headless:false,
                        minimal_args,
                    });

                    const page = await bro.newPage();
                    const start = Date.now();
                    await page.setViewport({
                        width: 1920,
                        height: 1080
                    });
                    await page.setRequestInterception(true);
                    page.on('request', (req) => {
                        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                            req.abort();
                        } else {
                            req.continue();
                        }
                    });
                    await page.goto(`https://donhang.ghn.vn/?order_code=${arr[i]}`, {
                        waitUntil: 'networkidle2',
                        //waitUntil: 'domcontentloaded'
                        timeout: 60000
                    });
                    await page.waitForSelector('.m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content')
                    const results = await page.evaluate(() => {
                        var a = document.querySelector(".m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content").innerHTML;
                        return a;
                    });
                    await bro.close();
                    var p = {
                        m: results,
                        n: arr[i]
                    }
                    arrTotal.push(p);
                    console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
                    name(xy);

                    function name(xy) {
                        if (arrTotal.length == xy) {
                            res.redirect('/'); //ngat cuoi cung
                        } else {
                            xy++;
                        }
                        xy++;
                    }
                })();

            }

            //j&t
            // if (arr[i].slice(0,1) == "8") {
            //     (async () => {
            //         xy++;
            //         const bro = await puppeteer.launch({
            //             headless:false,
            //             executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            //             minimal_args,
            //         });
            //         const page = await bro.newPage();
            //         await page.setViewport({
            //             width: 1920,
            //             height: 1080
            //         });
            //         await page.setRequestInterception(true);
            //         page.on('request', (req) => {
            //             if (req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() == 'stylesheet') {
            //                 req.abort();
            //             } else {
            //                 req.continue();
            //             }
            //         });
            //         const start = Date.now();
            //         await page.goto(`https://jtexpress.vn/track?billcodes=${arr[i]}&btn_track=`, {
            //             //waitUntil: 'domcontentloaded'
            //             waitUntil: 'networkidle2'
            //         });

            //         await page.waitForSelector(`.tab-content > #accordion > div > #collapse-${arr[i]} > .col-md-12`);
            //         const results = await page.evaluate(() => {
            //             var a = document.querySelector(`.tab-content > #accordion > div > #collapse-${arr[i]} > .col-md-12`).innerHTML;
            //             return a;
            //         });
            //         await bro.close();
            //         var q = {
            //             m:results,
            //             n:arr[i]
            //         }
            //         arrTotal.push(q);
            //         console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
            //         name(xy);
            //         function name(xy) {
            //             if (arrTotal.length == xy) {
            //                 res.redirect('/'); //ngat cuoi cung
            //             } else {
            //                 xy++;
            //             }
            //             xy++;
            //         }
            //     })();
            // }

            // //test jt xin
            if (arr[i].slice(0, 1) == "8") {
                xy++;
                const start = Date.now();
                const str = `https://jtexpress.vn/tracking?type=track&billcode=${arr[i]}`;

                request({
                    method: 'GET',
                    url: str
                }, (err, res1, body) => {

                    if (err) return console.error(err);
                    $ = cheerio.load(body);
                    console.log($.text());
                    var element = $('.result-tracking > .tabs > .result_vandon > .border-l-2 > .tab-content');
                    // console.log(element.html()); 
                    var q = {
                        m: element.html(),
                        n: arr[i]
                    }
                    console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
                    arrTotal.push(q);
                    name(xy);

                    function name(xy) {
                        if (arrTotal.length == xy) {
                            res.redirect('/'); //ngat cuoi cung
                        } else {
                            xy++;
                        }
                        xy++;
                    }
                });
            }



            // if (arr[i].slice(0, 1) == "7") {
            //     (async () => {
            //         xy++;
            //         const bro = await puppeteer.launch({
            //              headless:false,
            //             //executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            //             minimal_args,
            //         });
            //             const page = await bro.newPage();
            //             await page.setViewport({
            //                 width: 1920,
            //                 height: 1080
            //             });
            //             // await page.setRequestInterception(true);
            //             // page.on('request', (req) => {
            //             //     if (req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() == 'stylesheet') {
            //             //         req.abort();
            //             //     } else {
            //             //         req.continue();
            //             //     }
            //             // });
            //             const start = Date.now();
            //             await page.goto(`https://i.ghtk.vn/${arr[i]}`, {
            //                 //waitUntil: 'domcontentloaded'
            //                 waitUntil: 'networkidle2'
            //             });
            //             await page.waitForSelector('.order-logs')
            //             const results = await page.evaluate(() => {
            //                 var a = document.querySelector(".order-logs").innerHTML;
            //                 return a;
            //             });
            //             await bro.close();
            //             var q = {
            //                 m:results,
            //                 n:arr[i]
            //             }
            //             arrTotal.push(q);
            //             console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
            //             name(xy);
            //             function name(xy) {
            //                 if (arrTotal.length == xy) {
            //                     res.redirect('/'); //ngat cuoi cung
            //                 } else {
            //                     xy++;
            //                 }
            //                 xy++;
            //             }
            //         })();

            // }

            // test cluster

            // const cluster = await Cluster.launch({
            //     concurrency: Cluster.CONCURRENCY_CONTEXT,
            //     maxConcurrency: 3,
            //     minimal_args,
            //     // monitor: true,

            //     // args: [
            //     //     '--window-size=1920,1080',
            //     // ],
            //     puppeteerOptions: {
            //         headless: false,
            //         // defaultViewport: {
            //         //     width: 1920,
            //         //     height: 1080
            //         // }
            //     }
            // });
            //     if (arr[i].slice(0, 2) == "GA") {
            //     //if (arr[i].slice(0, 2) == "12") {
            //         // function ghn1(){
            //         const ghn = (async ({
            //             page,
            //             data: url
            //         }) => {
            //             xy++;
            //             const start = Date.now();
            //             await page.goto(url, {
            //                 waitUntil: 'networkidle2'
            //             });
            //             // await page.setRequestInterception(true);
            //             // page.on('request', (req) => {
            //             //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            //             //         req.abort();
            //             //     } else {
            //             //         req.continue();
            //             //     }
            //             // });
            //             //await page.waitForSelector('.m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content')
            //             //await page.focus('.m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content');
            //             const results = await page.evaluate(() => {
            //                 var a = document.querySelector(".m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content").outerHTML;
            //                 return a;
            //             });

            //             //console.log(results);
            //             //await bro.close();
            //             var p = {
            //                 m: results,
            //                 n: arr[i]
            //             }
            //             arrTotal.push(p);
            //             console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
            //             name(xy);
            //             console.log("xySPX1: " + xy);
            //             function name(xy) {
            //                 if (arrTotal.length == xy) {
            //                     res.redirect('/'); //ngat cuoi cung
            //                 } else {
            //                     xy++;
            //                 }
            //                 xy++;
            //             }
            //             console.log("xySPX2: " + xy);
            //         });
            //         //cluster.queue('https://spx.vn/');
            //         cluster.queue(`https://donhang.ghn.vn/?order_code=${arr[i]}`, ghn);
            //     //}
            //     //ghn1();



            // }
            // // many more pages
            // await cluster.idle();
            // await cluster.close();
            else {
                
                alert("mã đơn hàng sai")
                res.redirect('/');
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something broke");
    }

});
app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
});