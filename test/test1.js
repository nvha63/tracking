const cheerio = require('cheerio'); // khai báo module cheerio
const puppeteer = require('puppeteer');
const request = require('request-promise'); // khai báo module request-promise
const express = require("express");
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
// app.get("/tracking", async (req, res, next) => {
//     res.sendFile(path.join(__dirname + "/index.html"));
// });
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(express.static('css'));
// app.post('/example', (req, res) => {
//     res.send(`Full name is:${req.body.fname} ${req.body.lname}.`);
// });
var x = {};
var y;
app.get("/", async (req, res, next) => {
    res.render('form', {
        x
    });
});

app.post("/", async (req, res, next) => {
    //res.send(`my ${req.body.name}`);
    console.log(req.body.name);

    //1) spx

    // try {
    //     (async () => {
    //         const bro = await puppeteer.launch({
    //             headless: false
    //         });
    //         const page = await bro.newPage();
    //         await page.goto("https://spx.vn/", {
    //             waitUntil: 'load'
    //         });
    //         //await page.type('#tracknumber', 'SPXVN026148996734');
    //         var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
    //         //   await page.waitForTimeout(10000);
    //         await a.click()
    //         await a.type(`${req.body.name}`);
    //         var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
    //         await Promise.all([
    //             b.click(),
    //             page.waitForTimeout(4000)
    //         ]);
    //         // await page.screenshot({
    //         //     path: "oi1.png",
    //         //     fullPage: true
    //         // })         
    //         const results = await page.evaluate(() => {
    //             //var m = document.querySelectorAll("li");
    //             // //    m[0].innerText;
    //             //    return m;
    //             // Array.from(
    //             //     document.querySelectorAll('li'),
    //             //     (element) => element.innerText
    //             // )
    //             var a = document.querySelector("div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0").innerHTML;
    //             return a;
    //         });

    //         console.log(results)
    //         await bro.close();
    //         x = {
    //             m: results,
    //             n: req.body.name
    //         }
    //         res.redirect(req.get('referer'));
    //     })();
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send("Something broke");
    // }

    // // 2) ghn
    try {
        (async () => {
            const bro = await puppeteer.launch({
                // product:'chrome',
                executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                headless: false
            });
            const page = await bro.newPage();
            await page.setViewport({
                width: 1920,
                height: 1080
            });
            await page.goto("https://donhang.ghn.vn/?order_code=", {
                waitUntil: 'networkidle2'
            });

            var input = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div/input`);
            await input.click()
            await input.type(`${req.body.name}`);
            var submit = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/button`);
            await Promise.all([
                submit.click(),
                //await page.waitForSelector('.card-order-content'),
                await page.waitForTimeout(4000)
            ]);
            // await page.waitForNavigation({
            //     waitUntil: 'load',
            // });
            const results = await page.evaluate(() => {
                //var m = document.getElementsByClassName("table-row first");
                var a = document.querySelector(".m-t-16 > .container > .order-history-container > .card-order-container > .card-order-content").outerHTML;
                return a;
            })
            console.log(results)
            await bro.close();
            x = {
                m: results,
                n: req.body.name
            }
            res.redirect(req.get('referer'));
        })();
    } catch (error) {
        console.log(error);
        res.status(500).send("Something broke");
    }

});
app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
});

//gom
// var arr = ["SPXVN021459790824", "GAPAV36C",];
// for(let i=0;i<arr.length;i++){   
//     if (arr[i].slice(0,3)=="SPX") {
//         (async () => {
//     const bro = await puppeteer.launch({headless: false});
//     const page = await bro.newPage();
//     await page.goto("https://spx.vn/", {
//         waitUntil: 'load'
//     });
//     var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
//     //   await page.waitForTimeout(10000);
//     await a.click()
//     await a.type(arr[i]);
//     var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
//        await Promise.all([
//            b.click(),
//         page.waitForTimeout(4000)
//        ]);         
//     const results = await page.evaluate(() => {

//         let elements = Array.from(document.querySelectorAll("li"));
//         let links = elements.map(element => {
//             return element.innerText
//         })
//         return links;
//     });
//     console.log(results)
//     await bro.close();
// })();
//     }
//     if (arr[i].slice(0, 3) == "GAP") {
//         (async () => {
//             const bro = await puppeteer.launch({
//                 headless: false
//             });
//             const page = await bro.newPage();
//             await page.setViewport({
//                 width: 0,
//                 height: 0
//             });
//             await page.goto("https://donhang.ghn.vn/?order_code=", {
//                 waitUntil: 'networkidle2'
//             });

//             var input = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div/input`);
//             await input.click()
//             await input.type(arr[i]);
//             var submit = await page.waitForXPath(`//*[@id="root"]/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/button`);
//             await Promise.all([
//                 submit.click(),
//                 await page.waitForSelector('.card-order-content'),
//                 // await page.waitForTimeout(4000)
//             ]);
//             // await page.waitForNavigation({
//             //     waitUntil: 'load',
//             // });
//             const results = await page.evaluate(() => {
//                 //var m = document.getElementsByClassName("table-row first");
//                 let elements = Array.from(document.getElementsByClassName("table-row first"));
//                 let links = elements.map(element => {
//                     return element.innerText
//                 })
//                 return links;
//             });
//             const results1 = await page.evaluate(() => {
//                 //var elements = Array.from(document.querySelectorAll(".collapse"));
//                 let elements = Array.from(document.getElementsByClassName("collapse"));
//                 // let links = elements.map(element => {
//                 //     return element.outerText
//                 // })
//                 // return links;
//                 let arr = [];
//                 for (let i = 0; i < elements.length; i++) {
//                     let arr1 = [];
//                     arr1.push(elements[i].innerText);
//                     arr.push(arr1);
//                 }
//                 return arr;

//             });
//             console.log(results)
//             console.log(results1)

//             await bro.close();
//         })();
//     }
// }



//het====//
//*[@id="root"]/div/div[3]/div/div/span/span/input
//#root > div > div: nth - child(3) > div > div > span > span > input
// (async () => {
//     const bro = await puppeteer.launch({headless: false});
//     const page = await bro.newPage();
//     await page.goto("https://shopee.vn/finish.officialstore");

//     await page.screenshot({
//         path: "ejejk.png",
//         fullPage: true
//     })
//     // const results = await page.evaluate(() => {
//     //     // let items = document.querySelector("._3j20V6").innerHTML;
//     //     // let links = []
//     //     // for(let i=0;i<5;i++){
//     //     //     links.push(items[i].innerText);
//     //     // }
//     //     return items;
//     // });

//     console.log(results)
//     await bro.close();
// })();
// var kq = await page.evaluate(()=>{
//     var x = document.getElementsByClassName("_3BX_vD _218Zfa")[0].innerText;
//     var y = [...x];
//    return x;
//     // return y.map(h=>h.outerHTML);
// })
// console.log(kq);
// var postData = null;
// var url = 'http://api.tracktry.com/v1/carriers/';
// sentRes(url, postData, "GET", function (data) {
//     console.log(data);
// });


// function sentRes(url, data, method, fn) {
//     data = data || null;
//     if (data == null) {
//         var content = require('querystring').stringify(data);
//     } else {
//         var content = JSON.stringify(data); //json format
//     }

//     var parse_u = require('url').parse(url, true);
//     var isHttp = parse_u.protocol == 'http:';
//     var options = {
//         host: parse_u.hostname,
//         port: parse_u.port || (isHttp ? 80 : 443),
//         path: parse_u.path,
//         method: method,
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(content, "utf8"),
//             'Tracktry-Api-Key': 'd5cc781e-90a8-4169-9da9-54dca8b3e5c2'
//         }
//     };
//     var req = require(isHttp ? 'http' : 'https').request(options, function (res) {
//         var _data = '';
//         res.on('data', function (chunk) {
//             _data += chunk;
//         });
//         res.on('end', function () {
//             fn != undefined && fn(_data);
//         });
//     });

//     req.write(content);
//     req.end();
// }
// // //-------------//
// // // var postData = null;
// // // var url = 'http://api.trackingmore.com/v2/carriers/';
// // // sentRes(url,postData,"GET",function(data){
// // //     console.log(data);
// // // });
// // //-----//
// var postData = null;
// var url = 'http://api.tracktry.com/v1/carriers/';
// sentRes(url, postData, "GET", function (data) {
//     console.log(data);
// });
// //--//
// var postData = {
//     "tracking_number": "RA018458445JP"
// };
// var url = 'http://api.tracktry.com/v1/carriers/detect';
// sentRes(url, postData, "POST", function (data) {
//     console.log(data);
// });
//trackingmore 
//JT Express VN
//Giao Hàng Nhanh
//SPX VN
//Viettel Post
//Vietnam Post
//Ninja Van Vietnam

// (async () => {
//     const urls = ['https://spx.vn/', 'https://donhang.ghn.vn/?order_code=']
//     for (let i = 0; i < urls.length; i++) {

//         const url = urls[i];
//         const browser = await puppeteer.launch({
//             headless: false
//         });
//         const page = await browser.newPage();
//         await page.goto(`${url}`, {
//             waitUntil: 'networkidle2'
//         });
//         await browser.close();

//     }
// })();
//===//
// var arr = [];
// for(let i=0;i<elements.length;i++){
//     var x =document.getElementById(`collapse-text${i}`).innerText
//     arr.push(x);
// }
// let links = elements.map(element => {
//     return element.innerText
// })
// let b =[];
// for(let i=0;i<elements.length;i++){
//     a.push(elements[i].innerText);

// }
//console.log(elements.length);
//var x = document.getElementById(`collapse-text2`).innerText
//return arr;
// const results = await page.evaluate(() => {
//     //var m = document.getElementsByClassName("table-row first");
//     let elements = Array.from(document.getElementsByClassName("table-row first"));
//     let links = elements.map(element => {
//         return element.innerText
//     })
//     return links;
// });
// const results1 = await page.evaluate(() => {
//             //var elements = Array.from(document.querySelectorAll(".collapse"));
//             let elements = Array.from(document.getElementsByClassName("collapse"));
//             // let links = elements.map(element => {
//             //     return element.outerText
//             // })
//             // return links;
//             let arr = [];
//             for (let i = 0; i < elements.length; i++) {
//                 let arr1 = [];
//                 arr1.push(elements[i].innerText);
//                 arr.push(arr1);
//             }
//             return arr;