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
const spx = require("./services/spx");
const app = express();
const port = 3000;
const minimal_args = require("./minimal");
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));

var x = {};
var arrTotal=[];
var xy = 0;
app.get("/", async (req, res, next) => {
    res.render('form', {
        arrTotal
    });
});

app.post("/", async (req, res, next) => {
    //res.send(`my ${req.body.name}`);
    console.log(req.body.name);
    
    try {
        var arr = req.body.name.split(",");
        //var arr = ["SPXVN021459790824", "GAPAV36C",];SPXVN021459790824,GAPAV36C
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slice(0, 3) == "SPX") {
                spx(arr[i], res.redirect('/'));
                // (async () => {
                //     xy++;
                //     const bro = await puppeteer.launch({
                //         // headless:false,
                //         executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                //         userDataDir:'C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
                //         args: [
                //             // '--user-data-dir=C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
                //             '--profile-directory=Profile 5'
                //         ]
                //         //args: minimal_args,
                //         // userDataDir: "C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data",
                //         // args: [
                //         //     '--profile-directory=Profile 5'
                //         // ]
                        
                //     });
                //     const page = await bro.newPage();
                //     await page.setRequestInterception(true);
                //     page.on('request', (req) => {
                //         if (req.resourceType() == 'font' || req.resourceType() == 'image') {
                //             req.abort();
                //         } else {
                //             req.continue();
                //         }
                //     });
                //     const start = Date.now();
                //     await page.goto("https://spx.vn/", {
                //         //waitUntil: 'domcontentloaded'
                //         waitUntil: 'networkidle2'
                //     });
                //     var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
                //     await a.click()
                //     await a.type(arr[i]);
                //     var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
                //     await Promise.all([
                //         b.click(),
                //         page.waitForSelector('div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0')
                //     ]);
                //     const results = await page.evaluate(() => {
                //         var a = document.querySelector("div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0").innerHTML;
                //         return a;
                //     });
                //     //console.log(results)
                    
                //     //await bro.close();
                    
                //     var q = {
                //         m:results,
                //         n:arr[i]
                //     }
                //     arrTotal.push(q);
                //     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
                //     console.log(arrTotal.length);
                //     console.log("xySPX1: " + xy);
                //     name(xy);
                //     function name(xy) {
                //         if (arrTotal.length == xy) {
                //             res.redirect('/'); //ngat cuoi cung
                //         } else {
                //             xy++;
                //         }
                //         xy++;
                //     }
                //     console.log("xySPX2: " + xy);
                //     //res.redirect(req.get('referer'));
                // })();
            }
            //ghn
            
            if (arr[i].slice(0,2) == "GA") {
                (async () => {
                    xy++;
                    
                    const bro = await puppeteer.launch({
                        // minimal_args,
                        //headless: false,
                       
                        //executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                        // userDataDir: 'C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
                        //     args: [
                        //         // '--user-data-dir=C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
                        //         '--profile-directory=Profile 5'
                        //     ]
                        
                    });
                    // Create a new incognito browser context
                    //const context = await bro.createIncognitoBrowserContext();
                    // Create a new page inside context.
                    //const page = await context.newPage();
                    const page = await bro.newPage();

                    // const client = await page.target().createCDPSession();
                    // await client.send('Network.enable');
                    // //Simulated network throttling (Slow 3G)
                    // await page.emulateNetworkConditions(puppeteer.networkConditions['Slow 3G']);
                    // await page.emulateCPUThrottling(4);
                    const start = Date.now();
                    await page.setViewport({
                        width: 1920,
                        height: 1080
                    });
                    await page.setRequestInterception(true);
                    page.on('request', (req) => {
                        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' ) {
                            req.abort();
                        } else {
                            req.continue();
                        }
                    });
                    await page.goto(`https://donhang.ghn.vn/?order_code=${arr[i]}`, {
                         //waitUntil: 'networkidle2'
                        waitUntil: 'domcontentloaded'
                    });

                    // var input = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div/input`);
                    // await input.click()
                    // await input.type(arr[i]);
                    // var submit = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/button`);
                    // await Promise.all([
                    //     submit.click(),
                    // ]);
                    await page.waitForSelector('.m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content')
                    const results = await page.evaluate(() => {
                        var a = document.querySelector(".m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content").outerHTML;
                        return a;
                    });

                    //console.log(results);
                    await bro.close();
                    //await context.close()
                    var p = {
                        m: results,
                        n: arr[i]
                    }
                    arrTotal.push(p);
                    console.log(arr[i]+' Time:', Date.now() - start, 'ms');
                    //console.log(arrTotal);
                    console.log(arrTotal.length);
                    console.log("xy1: "+xy);
                    name(xy);
                    function name(xy){
                        if (arrTotal.length==xy) {
                            res.redirect('/'); //ngat cuoi cung
                        }else{
                            xy++;
                        }
                        xy++;
                    }
                    console.log("xy2: " + xy);
                })();

            }
            //j&t
            // if (arr[i].slice(0,1) == "8") {
            //     (async () => {
            //         xy++;
            //         const bro = await puppeteer.launch({
            //             headless:false,
            //             executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            //             // userDataDir:'C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
            //             // args: [
            //             //     // '--user-data-dir=C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
            //             //     '--profile-directory=Profile 5'
            //             // ],
            //             minimal_args,

                        
            //         });
            //         const page = await bro.newPage();
            //         const client = await page.target().createCDPSession();
            //         await client.send('Network.enable');
            //         // Simulated network throttling (Slow 3G)
            //         await page.emulateNetworkConditions(puppeteer.networkConditions['Slow 3G']);
            //         await page.emulateCPUThrottling(4);
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
            //         // var input = await (await page.waitForSelector('#billcodes')).click();
                    
            //         // await input.type(arr[i]);
            //         // await Promise.all([
            //         //     page.click('#track1 > #formTrack > .row > .col-md-12 > .btn'),
            //         //     page.waitForSelector('.tab-content > #accordion > div > #collapse-842151473666 > .col-md-12')
            //         // ]);
            //         await page.waitForSelector('.tab-content > #accordion > div > #collapse-842151473666 > .col-md-12');
            //         const results = await page.evaluate(() => {
            //             var a = document.querySelector(".tab-content > #accordion > div > #collapse-842151473666 > .col-md-12").innerHTML;
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
                request({
                    method: 'GET',
                    url: 'https://jtexpress.vn/track?billcodes=842151473666&btn_track=/'
                }, (err, res1, body) => {
                    if (err) return console.error(err);
                    $ = cheerio.load(body);
                    console.log($.text());
                    var element = $('.tab-content > #accordion > div > #collapse-842151473666 > .col-md-12');
                    // console.log(element.html()); 
                    var q = {
                         m: element.html(),
                         n: "842151473666"
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
            //test ghn
            // if (arr[i].slice(0, 1) == "1") {
            //     fetch("")
                
            // }
        //     if (arr[i].slice(0, 1) == "") {
        //         (async () => {
        //                 xy++;
        //                 const bro = await puppeteer.launch({
        //                     headless:false,
        //                     executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        //                     // userDataDir:'C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
        //                     // args: [
        //                     //     // '--user-data-dir=C:/Users/Trung Nghia/AppData/Local/Google/Chrome/User Data/',
        //                     //     '--profile-directory=Profile 5'
        //                     // ],
        //                     minimal_args,

                            
        //                 });
        //                 const page = await bro.newPage();
        //                 const client = await page.target().createCDPSession();
        //                 await client.send('Network.enable');
        //                 // Simulated network throttling (Slow 3G)
        //                 await page.emulateNetworkConditions(puppeteer.networkConditions['Slow 3G']);
        //                 await page.emulateCPUThrottling(4);
        //                 await page.setViewport({
        //                     width: 1920,
        //                     height: 1080
        //                 });
        //                 await page.setRequestInterception(true);
        //                 page.on('request', (req) => {
        //                     if (req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() == 'stylesheet') {
        //                         req.abort();
        //                     } else {
        //                         req.continue();
        //                     }
        //                 });
        //                 const start = Date.now();
        //                 await page.goto("https://i.ghtk.vn/S14268.MB19.C11.540364691", {
        //                     //waitUntil: 'domcontentloaded'
        //                     waitUntil: 'networkidle2'
        //                 });
        //                 await page.waitForSelector('.search-order__bottom > div > .pb-3 > #order540364691 > .order-logs')
        //                 const results = await page.evaluate(() => {
        //                     var a = document.querySelector(".search-order__bottom > div > .pb-3 > #order540364691 > .order-logs").innerHTML;
        //                     return a;
        //                 });
        //                 await bro.close();
        //                 var q = {
        //                     m:results,
        //                     n:arr[i]
        //                 }
        //                 arrTotal.push(q);
        //                 console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
        //                 name(xy);
        //                 function name(xy) {
        //                     if (arrTotal.length == xy) {
        //                         res.redirect('/'); //ngat cuoi cung
        //                     } else {
        //                         xy++;
        //                     }
        //                     xy++;
        //                 }
        //             })();
              
        // }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).send("Something broke");
    }

});
app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
});

//jt test
// (async () => {
// //    const response = await fetch('https://jtexpress.vn/track?billcodes=842151473666&btn_track=/');
// //    const body = await response.text();
// //  var a = body.querySelector(".tab-content > #accordion > div > #collapse-842151473666 > .col-md-12").innerHTML;
// //    console.log(a);

//     await fetch('https://jtexpress.vn/track?billcodes=842151473666&btn_track=/')
//        .then(response => response.text())
//        .then(html => {
//             console.log(html);
//            var a = document.querySelector(".tab-content > #accordion > div > #collapse-842151473666 > .col-md-12");
//             a.innerHTML = html;
//             console.log(html);
//        })
//        .catch((err) => console.log("Can’t access " + " response. Blocked by browser?" + err));
// })();