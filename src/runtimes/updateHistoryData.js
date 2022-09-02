let AdmZip = require('adm-zip');
var request = require('request');

const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

function downloadFromBinanceAndWrite (url, token, timeframe, day, month, year) {
    if (fs.existsSync(appDir + "\\src\\backtest\\history\\" + token + "\\" + timeframe + "\\" + year + "-" + month + "-" + day + ".json")) {
        return new Promise ((resolve, reject) => {
            resolve()
        }); 
    }
    return new Promise ((resolve, reject) => {
        let req = request.get({url: url + ".zip", encoding: null}, (err, res, body) => {
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
        
                    let path = appDir + "\\src\\backtest\\history\\" + token + "\\" + timeframe + "\\" + year + "-" + month + "-" + day + ".json";
                    let data = JSON.stringify(result);
                    fs.writeFileSync(path, data);
                });
            } else {
                console.log("Status: " + res.statusCode + " There is no " + day + " of month", month);
            }
        });        
    
        req.on('response', res => resolve(res));
        req.on('error', err => reject(err));
    }); 
}

async function deleteAll(token, timeframe) {
    let path = appDir + "\\src\\backtest\\history\\" + token + "\\" + timeframe + "\\";
    fs.readdirSync(path).forEach(f => fs.rmSync(`${path}/${f}`));
}
 
async function updateHistoryData (token, dataTimeFrame, monthsback) {
    const root = "https://data.binance.vision/data/spot/daily/klines/"; 

    // await deleteAll(token, dataTimeFrame);

    let promiseArray = [];

    for (let i = 0; i < monthsback; i++) {
        let dateAtMonthsBack = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - i, 
            new Date().getDate()
        );

        let year  = dateAtMonthsBack.getFullYear() + "";
        let month = dateAtMonthsBack.getMonth() + 1 + "";
        if (month.length < 2) month = "0" + month;

        for (let j = 31; j >= 1; j--) {
            let tempDay = j + "";
            if (tempDay.length === 1) {
                tempDay = "0" + j
            };

            promiseArray.push(downloadFromBinanceAndWrite(
                    root + token + "/" + dataTimeFrame + "/" + token + "-" + dataTimeFrame + "-" + year + "-" + month + "-" + tempDay,
                    token,
                    dataTimeFrame,
                    tempDay,
                    month,
                    year,
                    (s) => console.log(s)
                ));
            }
    }

    await Promise.all(promiseArray);
};
 
module.exports = updateHistoryData;