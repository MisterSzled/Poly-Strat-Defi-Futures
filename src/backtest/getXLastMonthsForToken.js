let AdmZip = require('adm-zip');
var request = require('request');

const fs = require('fs');

async function downloadFromBinance (url, token, timeframe, day, month, year) {
    request.get({url: url + ".zip", encoding: null}, (err, res, body) => {
        if (res.statusCode === 200) {
            var zip = new AdmZip(body);
            var zipEntries = zip.getEntries();
          
            zipEntries.forEach((entry) => {
                let result = [];
                let textSplit = zip.readAsText(entry).split(",");
    
                for (let i = 0; i < textSplit.length - 1; i += 11) {
                    let temp = textSplit.slice(i, i + 11);
                    temp[0] = temp[0].replaceAll("0\n", "");
    
                    result.push(temp)
                }
    
                let path = __dirname + "\\" + "history" + "\\" + token + "\\" + timeframe + "\\" + year + "-" + month + "-" + day + ".json";
                let data = JSON.stringify(result);
                fs.writeFileSync(path, data);
            });
        } else {
            console.log("There is no " + day + " of month", month);
        }

        
    });
};

const root = "https://data.binance.vision/data/spot/daily/klines/";
async function getXLastMonthsForToken (token, dataTimeFrame, monthsback) {
    let year = new Date().getFullYear() + "";

    for (let i = 0; i < monthsback; i++) {
        let month = new Date().getMonth() + 1 - i + "";
        if (month.length < 2) month = "0" + month;

        for (let j = 31; j >= 1; j--) {
            let tempDay = j + "";
            if (tempDay.length === 1) {
                tempDay = "0" + j
            };

            await downloadFromBinance(
                root + token + "/" + dataTimeFrame + "/" + token + "-" + dataTimeFrame + "-" + year + "-" + month + "-" + tempDay,
                token,
                dataTimeFrame,
                tempDay,
                month,
                year,
                (s) => console.log(s)
            );
        }
    }
};

module.exports = getXLastMonthsForToken