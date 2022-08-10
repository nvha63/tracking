const puppeteer = require('puppeteer');
const request = require('request-promise'); // khai báo module request-promise
const express = require("express");
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));
var x;
app.get("/", async (req, res, next) => {
    res.render('form',{x});
});
app.post("/", async (req, res, next) => {
    //console.log(req.body.name);
    //1) spx
    try {
        (async () => {
            const bro = await puppeteer.launch({
                headless: false
            });
            const page = await bro.newPage();
            await page.goto("https://spx1.vn/", {
                waitUntil: 'load'
            });
            var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);           
            await a.click()
            await a.type(`${req.body.name}`);
            var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
            await Promise.all([
                b.click(),
                page.waitForTimeout(4000)
            ]);
            const results = await page.evaluate(() => {             
                var a = document.querySelector("div > div > .ant-dropdown > div > .trackingDetail__Container-u3b47n-0").outerHTML;
                return a;
            });
            // console.log(results)
            await bro.close();
            x=results;
            // console.log(x.type);
        })();
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Something broke");
    }

});
app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
});










// const puppeteer = require('puppeteer');
// (async () => {
//     const bro = await puppeteer.launch({headless: false});
//     const page = await bro.newPage();
//     await page.goto("https://spx.vn/", {
//         waitUntil: 'load'
//     });
//     //await page.type('#tracknumber', 'SPXVN026148996734');
//     var a = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/input`);
//     //   await page.waitForTimeout(10000);
//     await a.click()
//     await a.type("SPXVN023740100224");
//     var b = await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/span/span/span/button`);
//        await Promise.all([
//            b.click(),
//         page.waitForTimeout(2100)
//        ]);
//     // await page.screenshot({
//     //     path: "oi1.png",
//     //     fullPage: true
//     // })      
   
    
//     const results = await page.evaluate(() => {
//         // let elements = Array.from(document.querySelector("body > div:nth-child(22) > div > div > div > div""body > div:nth-child(22) > div > div > div > div"));
//         // let links = elements.map(element => {
//         //     return element.outerHTML
//         // })
//         // return links;
//         return 
         
//     });
//       // let results = await page.$("body > div:nth-child(22) > div > div > div > div");
//     console.log(results)
//     await bro.close();
// })();