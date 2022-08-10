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
                        //minimal_args

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
                    console.log(results)
                    //await bro.close();

                    var q = {
                        m: results,
                        n: `${arr[i]}` + " - Shopee Express"
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
                (async () => {
                    xy++;
                    const bro = await puppeteer.launch({});
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
                        n: `${arr[i]}` + " - Giao Hàng Nhanh"
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
                    //console.log($.text());
                    var element = $('.result-tracking > .tabs > .result_vandon > .border-l-2 > .tab-content');
                    // console.log(element.html()); 
                    var q = {
                        m: element.html(),
                        n: `${arr[i]}` + " - JT Express"
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

// const express = require("express");
// const path = require('path');
// const cheerio = require('cheerio');
// const router = express.Router();
// const bodyParser = require('body-parser');
// const req = require('express/lib/request');
// const request = require('request');
// let alert = require('alert');
// const popup = require('node-popup/dist/cjs.js').confirm;
// // const popupS = require("popups/dist/popupS");
// const app = express();
// const port = 3000;
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// //app.use(express.static(__dirname + '/public'));

// var listOrder = [];
// var xy = 0;
// app.get("/", async (req, res, next) => {
//     res.render('form', {
//         listOrder
//     });
// });

// app.post("/", async (req, res, next) => {
//     console.log(req.body.name);

//     try {
//         var arr = req.body.name.split(",");
        
//         //var arr = ["SPXVN021459790824", "GAPAV36C",];SPXVN021459790824,GAPAV36C
//         for (let i = 0; i < arr.length; i++) {
            
//             if (arr[i].slice(0,1) == "") {
//                 alert("vui lòng nhập mã đơn hàng");
//                 res.redirect('/');
//             }

//             // 1.ghn
//             if (arr[i].slice(0, 2) == "GA") {
//                 xy++;
//                 var ghn = require("./services/ghn");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "ghn";
//                 var courier = "Giao Hàng Nhanh";
//                 ghn(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "Giao Hàng Nhanh");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }

//             // 2.spx
//             if (arr[i].slice(0, 3) == "SPX") {
//                 xy++;
//                 var spx = require("./services/spx");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "spx-vn";
//                 var courier = "Shopee Express";

//                 spx(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "Shopee Express");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 3.ninjavan
//             // num: SPEVN226825907061X
//             // courier: ninjavan-vn
//             if (arr[i].slice(0, 3) == "SPE") {
//                 xy++;
//                 var ninjavan = require("./services/ninjavan");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "ninjavan-vn";
//                 var courier = "NinjaVan";

//                 ninjavan(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "NinjaVan");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 4.nhattin
//             // num: 1241406113
//             // courier: ntlogistics-vn
//             if (arr[i].slice(0, 3) == "124") {
//                 xy++;
//                 var nhattin = require("./services/nhattin");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "ntlogistics-vn";
//                 var courier = "Nhất Tín Logistics";

//                 nhattin(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "Nhất Tín Logistics");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 5.fedex
//             // num: 273399278214
//             // courier: fedex
//             if (arr[i].slice(0, 3) == "273") {
//                 xy++;
//                 var fedex = require("./services/fedex");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "fedex";
//                 var courier = "FedEX";

//                 fedex(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "FedEX");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 6.dhl
//             // num: 5753619701
//             // courier: dhl
//             if (arr[i].slice(0, 2) == "57") {
//                 xy++;
//                 var dhl = require("./services/dhl");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "dhl";
//                 var courier = "DHL";

//                 dhl(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "DHL");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 7.yto
//             // num: YT6515402814067
//             // courier: yto
//             if (arr[i].slice(0, 2) == "YT") {
//                 xy++;
//                 var yto = require("./services/yto");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "yto";
//                 var courier = "YTO";

//                 yto(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "YTO");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 8.ups
//             // num: 1Z440R72DA42018137
//             // courier: ups
//             if (arr[i].slice(0, 2) == "1Z") {
//                 xy++;
//                 var ups = require("./services/ups");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "ups";
//                 var courier = "UPS";

//                 ups(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "UPS");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 9.jt
//             // num: JNTMP0007779249VNA
//             //courier: jt-express
//             if (arr[i].slice(0, 3) == "JNT") {
//                 xy++;
//                 var jt = require("./services/jt");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "jt-express";
//                 var courier = "JT Express";

//                 jt(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "JT Express");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 10.usps
//             // num: 9214490281670805193113
//             // courier: usps
//             if (arr[i].slice(0, 3) == "921") {
//                 xy++;
//                 var usps = require("./services/usps");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "usps";
//                 var courier =  "USPS";

//                 usps(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "USPS");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // 11.sf
//             // num: SF6043371706620
//             // courier: sfb2c
//             if (arr[i].slice(0, 2) == "SF") {
//                 xy++;
//                 var sf = require("./services/sf");
//                 const start = Date.now();
//                 var num = arr[i];
//                 var courierCode = "sfb2c";
//                 var courier = "SF Express";

//                 sf(num, courierCode, function callback(data) {
//                     console.log(data);
//                     process(xy, data, "SF Express");
//                     console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
//                 })
//             }
//             // var arrCode = [" ","GA", "SPX", "SPE", "124", "273", "57", "YT", "1Z", "JNT", "921", "SF"]
//             // if (arrCode.includes(arr[i].slice(0, 2), 0) == false || arrCode.includes(arr[i].slice(0, 3), 0) == false) {
//             //     alert("có mã đơn hàng không hợp lệ vui lòng nhập lại")
//             //      res.redirect('/');
//             // }
        
//             //SPXVN021459790824,GAPAV36C,SPEVN226825907061X,1241406113,273399278214,5753619701,YT6515402814067,1Z440R72DA42018137,JNTMP0007779249VNA,9214490281670805193113,SF6043371706620
//             //SPXVN021459790824,GAPAV36C,1241406113,273399278214,5753619701,YT6515402814067,1Z440R72DA42018137,JNTMP0007779249VNA,9214490281670805193113,SF6043371706620
//             ////SPXVN021459790824,GAPAV36C,1241406113,273399278214,5753619701,YT6515402814067,1Z440R72DA42018137,JNTMP0007779249VNA,9214490281670805193113,SF6043371706620
//             function process(xy, data, courier) {
//                 let orderDetails = {
//                     m: data,
//                     n: arr[i],
//                     z: courier
//                 }
//                 listOrder.push(orderDetails);
                
//                 if (listOrder.length == xy) {
//                     res.redirect('/'); //ngat cuoi cung
//                 } else {
//                     xy++;
//                 }
//                 xy++;
                
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Something broke");
//     }

// });
// app.listen(port, () => {
//     console.log(`app is running on port: ${port}`);
// });

