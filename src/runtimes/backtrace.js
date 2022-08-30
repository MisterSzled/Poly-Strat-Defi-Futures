const fs = require('fs');
const cs = require("../general/chalkSpec");
const strats = require("../../config").strats
const processIndicators = require("../main").processIndicators

let timemap = {
    "1m": 1000 * 60,
    "5m": 5000 * 60,
    "15m": 15000 * 60,
    "30m": 30000 * 60,
    "1h": 60000 * 60,
    "2h": 120000 * 60,
    "4h": 240000 * 60,
    "1d": 144000 * 60,
}

let wallet = {
    usd: 250,
    longs: 0,
    shorts: 0,
}

function backtrace(token, timeframe) {
    let path = "./src/backtest/history/" + token + "/" + timeframe + "/";
    let files = fs.readdirSync(path);
    let historyArray = [];

    // Merge data into single array
    for (let i = 0; i < files.length; i++) {
        let file = fs.readFileSync(path + files[i], {encoding:'utf8', flag:'r'});
        historyArray = historyArray.concat(JSON.parse(file));
    }

    // Check it flows in time correctly without gaps
    for (let i = 0; i < historyArray.length - 2; i++) {
        if (parseInt(historyArray[i][0]) !== parseInt(historyArray[i+1][0]) - (timemap[timeframe])) {
            cs.fail("Data corrupt at: " + i);
            throw new Error("Data corrupt");
        }
    }
    cs.win("Data merged and checked");

    let count = 0;
    //Run through strat
    for (let i = 1000; i < historyArray.length; i++) {
        console.log(i)
        let mockSlice = historyArray.slice(i - 1000, i);
        let finalResult = processIndicators(strats[0], mockSlice);

        if (finalResult !== 0) {
            count++;
        }
    }
    console.log(count);
}

module.exports = backtrace