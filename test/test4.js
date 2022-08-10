//test lan cuoi

if (arr[i].slice(0, 1) == "1") {
    xy++;
    const start = Date.now();
    var request = require('request');
    var num = "SPXVN028303631706";
    var courier = "spx-vn";
    var dataTemp = {};
    request.post({
            headers: {
                'authority': 'www.trackingmore.com',
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en;q=0.6,en-US;q=0.5',
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://www.trackingmore.com',
                'referer': `https://www.trackingmore.com/track/en/${num}`,
                'sec-ch-ua': '^\^',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '^\^Windows^\^',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
            },
            url: 'https://www.trackingmore.com/tmzohocrm/trackSingle/en',
            form: {
                "num": `${num}`,
                "courier": `${courier}`
            }
        },
        function (error, response, body) {
            var data = JSON.parse(body).data;
            var data1 = data[0];
            dataTemp = data1.origin_data;
            //console.log(dataTemp);
            // console.log(body.data);
            // console.log(typeof(body));

            // var q = {
            //     m: JSON.stringify(dataTemp),
            //     n: arr[i]
            // }
            // arrTotal.push(q);
            name(xy, dataTemp);
            console.log(arr[i] + ' Time:', Date.now() - start, 'ms');
        });
}