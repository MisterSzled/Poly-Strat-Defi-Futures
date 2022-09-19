
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
const writeToFile = require("../general/writeToFile");
const variationScheme = require("../../config").variationScheme;
// const indicators = require("../indicators");
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Runs a shallow scan over the lookback length passed in months
async function findBestStratOver1MAndWrite (stratcombos, shunt) {
    let results = [];
    let rolloverLimit = 1000;
    for (let i = 0; i < stratcombos.length; i++) {
        let newEntry = await backtrace(stratcombos[i], 6);
        results.push({...stratcombos[i], walletResult: newEntry});

        if ((i > 0) && (((i-1) % rolloverLimit) === 0)) {
            await writeToFile("./src/backtest/processed/"+(shunt + i)+".json", results);
            results = [];
        } else if (i === stratcombos.length - 1) {
            await writeToFile("./src/backtest/processed/"+(shunt + i + 1)+".json", results);
            results = [];
        }
    }
}

async function filterMonthListForBest(token, timeframe) {
    // let path = './src/backtest/processed/' + token + "/" + timeframe + "/";
    let path = './src/backtest/processed/';
    let fileNames = fs.readdirSync(path);
    let wallets = [];

    fileNames = fileNames.filter(val => val.includes(".json"));

    for (let i = 0; i < fileNames.length; i++) {
        let res = fs.readFileSync(path + fileNames[i]);
        res = JSON.parse(res);
        wallets = wallets.concat(res);
    }

    let winUSDThreshold = 250;
    let winDDThreshold  = 0.6;
    wallets = wallets.filter(val => val.walletResult.curUSD > winUSDThreshold);
    wallets = wallets.filter(val => val.walletResult.drawdown < winDDThreshold);

    // wallets = filterForConsistent(winners);

    let bestUSD = wallets.sort((a,b) => {
        if (a.walletResult.curUSD > b.walletResult.curUSD) return -1
        if (b.walletResult.curUSD > a.walletResult.curUSD) return 1
        return 0;
    });
    let bestDD = wallets.sort((a,b) => {
        if (a.walletResult.drawdown > b.walletResult.drawdown) return -1
        if (b.walletResult.drawdown > a.walletResult.drawdown) return 1
        return 0;
    });

    bestUSD[0].walletResult.positionOpens = [];
    bestUSD[0].walletResult.positionClosed = [];

    bestDD[0].walletResult.positionOpens = [];
    bestDD[0].walletResult.positionClosed = [];

    console.log("USD Winner:", bestUSD[0].walletResult);
    console.log("USD Winner:", bestUSD[0].indicators);
    // console.log("DD Winner:", bestDD[0].walletResult);
    // console.log("DD Winner:", bestDD[0].indicators);
}

function filterForConsistent(list) {
    let result = [];
    for (let i = 0; i < list.length; i++) {
        let curWallet = list[i];
        let monthMap = {}
        for (let i = 0; i < curWallet.walletResult.positionClosed.length; i++) {
            let curDate = new Date(curWallet.walletResult.positionClosed[i].date);
            let id = curDate.getFullYear() + ":" + curDate.getMonth();
            if (!!monthMap[id]) {
                monthMap[id].sum = monthMap[id].sum + curWallet.walletResult.positionClosed[i].delta
                if (curWallet.walletResult.positionClosed[i].delta >= 0) {
                    monthMap[id].win = monthMap[id].win + 1;
                } else {
                    monthMap[id].loss = monthMap[id].loss + 1;
                }
            } else {
                monthMap[id] = {win: 0, loss: 0, sum: 0}
                monthMap[id].sum = curWallet.walletResult.positionClosed[i].delta
                if (curWallet.walletResult.positionClosed[i].delta >= 0) {
                    monthMap[id].win = 1;
                } else {
                    monthMap[id].loss = 1;
                }
            }
        }

        let significantTrades = 100 / curWallet.options.percentageRiskedPerTrade;
        let monthMapKeys = Object.keys(monthMap);
        let curResult = true;
        for (let i = 0; i < monthMapKeys.length; i++) {
            let monthMapAtKey = monthMap[monthMapKeys[i]];
            if ((monthMapAtKey["win"] + monthMapAtKey["loss"]) >= significantTrades - 1) {
                if (monthMapAtKey["sum"] < 0) curResult = falses
            }
        }

        if (curResult) {
            result.push(curWallet);
        }
    }
    
    return result;
}

async function multiThreadStrats() {
    let stratCombos = generateStratCombos(variationScheme, "ETHUSDT");
    // console.log(stratCombos[0]);
    console.log(stratCombos.length);

    // await findBestStratOver1MAndWrite(stratCombos, 0);

    await filterMonthListForBest("ETHUSDT", "15m");

    // YOU NEED TO RUN IT OVER 3M NOW

    // console.log(await backtrace({
    //     "opName": "Generated_0_0",
    //     "token": "ETHUSDT",
    //     "timeframe": "15m",
    //     "options": {
    //      "swingHighLowLookbackLength": 10,
    //      "percentageRiskedPerTrade": 10,
    //      "profitFactor": 2,
    //      "atrLength": 14,
    //      "useLimitOrders": false,
    //      "gmxLimitAdjustment": 1
    //     },
    //     "indicators": [
    //      {
    //       "name": "fractal",
    //       "settings": {
    //        "filterBillWilliams": false,
    //        "useTimeFractals": true,
    //        "timeframe": 31,
    //        "use_ABCReversal": true,
    //        "ABCReversale_AB_min": 0.02,
    //        "ABCReversale_AB_max": 0.79,
    //        "ABCReversale_BC_min": 1.25
    //       }
    //      }
    // ]}, 3))

    // Something is wrong here with the backtracer - try running it with just 1 thread or no multi atall

    // if (isMainThread) {
    //     let threadCount = 3;
    //     // THIS IS THE DREAMA
    //     let stratCombos = generateStratCombos(variationScheme, "ETHUSDT");
    //     // THIS IS THE DREAMA
    //     console.log("Running with ", threadCount, " threads")

    //     const threads = new Set();

    //     let bracketBreadth = Math.ceil(stratCombos.length/threadCount);

    //     for (let i = 0; i < threadCount; i++) {
    //         let lower = i*bracketBreadth;
    //         let upper = (i+1)*bracketBreadth;
    //         console.log("Thread: ", i, " Lower: ", lower, " Upper: ", upper);

    //         threads.add(new Worker(__filename, { workerData: 
    //             { 
    //                 id: i,
    //                 lower: lower,
    //                 upper: upper,
    //                 combos: stratCombos.slice(lower, upper),
    //             }
    //         }));
    //     }

    //     threads.forEach(thread => {
    //         thread.on('message', (msg) => {
    //             console.log(msg)
    //         });
    //     })
    // } else {
    //         parentPort.postMessage("Thread: " + workerData.id + " from: " + workerData.lower);
    //         let start = new Date().getTime();
    //         await findBestStratOver1MAndWrite(workerData.combos, workerData.lower);
    //         parentPort.postMessage("Thread " + workerData.id + " Run time: " + (new Date().getTime() - start));
    // }
}

if (!isMainThread) {
    multiThreadStrats();
}

module.exports = multiThreadStrats;