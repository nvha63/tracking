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
// const spx = require("./services/spx");
const {
    Cluster
} = require('puppeteer-cluster');
const app = express();
const port = 3000;
const minimal_args = require("./minimal");
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.use(express.static(__dirname + '/public'));

// var headers= {
//         'authority': 'www.trackingmore.com',
//         'accept': 'application/json, text/javascript, */*; q=0.01',
//         'accept-language': 'vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en;q=0.6,en-US;q=0.5',
//         'content-type': 'application/x-www-form-urlencoded',
//         'origin': 'https://www.trackingmore.com',
//         'referer': `https://www.trackingmore.com/track/en/${num}`,
//         'sec-ch-ua': '^\^',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '^\^Windows^\^',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'same-origin',
//         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
//     }
// var url = 'https://www.trackingmore.com/tmzohocrm/trackSingle/en'


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
            // spx
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
                    await page.waitForTimeout(2000);
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

            // j&t
            if (arr[i].slice(0, 3) == "812") {
                xy++;
                const start = Date.now();
                const str = `https://jtexpress.vn/tracking?type=track&billcode=${arr[i]}`;

                request({
                    method: 'GET',
                    url: str
                }, (err, res1, body) => {

                    if (err) return console.error(err);
                    $ = cheerio.load(body);
                    //console.log($.text());
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

            //test lan cuoi 2
            if (arr[i].slice(0, 1) == "") {
                xy++;
                var spx = require("./test2");
                const start = Date.now();
                var num = "GA3D3GCB";
                var courier = "ghn";
                spx(num, courier, function callback(c) {
                    console.log(c);
                    name(xy, c);
                    console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
                })
            }

            function name(xy, c) {
                var q = {
                    m: c,
                    n: arr[i]
                }
                arrTotal.push(q);

                if (arrTotal.length == xy) {
                    res.redirect('/'); //ngat cuoi cung
                } else {
                    xy++;
                }
                xy++;
            }
            // else{
            //     alert("mã đơn hàng sai")
            //     res.redirect('/');
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