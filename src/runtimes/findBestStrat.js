
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
const writeToFile = require("../general/writeToFile");
const variationScheme = require("../../config").variationScheme;
// const indicators = require("../indicators");
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Runs a shallow scan over the lookback length passed in months
async function findBestStratOver1MAndWrite (stratcombos, shunt, messenger) {
    let results = [];
    let rolloverLimit = 10;
    for (let i = 0; i < stratcombos.length; i++) {

        if (!!messenger) {
            messenger(i)
        }

        let newEntry = await backtrace(stratcombos[i], 12);
        results.push({...stratcombos[i], walletResult: newEntry});

        

        if ((i > 0) && (((i-1) % rolloverLimit) === 0)) {
            await writeToFile("./src/backtest/processed/"+(shunt + i)+".json", results);
            // await writeToFile("./src/backtest/processed/"+(shunt + i)+".json", results);
            results = [];
        } else if (i === stratcombos.length - 1) {
            await writeToFile("./src/backtest/processed/"+(shunt + i + 1)+".json", results);
            // await writeToFile("./src/backtest/processed/"+(shunt + i + 1)+".json", results);
            results = [];
        }
    }
}

async function filterMonthListForBest() {
    let path = './src/backtest/processed/';
    let fileNames = fs.readdirSync(path);
    let wallets = [];

    fileNames = fileNames.filter(val => val.includes(".json"));

    for (let i = 0; i < fileNames.length; i++) {
        let res = fs.readFileSync(path + fileNames[i]);
        res = JSON.parse(res);
        wallets = wallets.concat(res);
    }

    wallets = wallets.filter(val => val.token === "BTCUSDT");
    console.log("Total run: ", wallets.length)

    let winUSDThreshold = 250;
    let winDDThreshold  = 0.6;
    wallets = wallets.filter(val => val.walletResult.curUSD > winUSDThreshold);
    wallets = wallets.filter(val => val.walletResult.drawdown < winDDThreshold);
    // wallets = wallets.filter(val => (val.walletResult.longs + val.walletResult.shorts) > 14);
    // wallets = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJN_max !== 1000);
    wallets = wallets.filter(val => !val.indicators[0].settings.useTimeFractals);

    console.log("Total wins: ", wallets.length)

    // wallets = filterForConsistent(wallets);

    let bestUSD = [...wallets].sort((a,b) => {
        if (a.walletResult.curUSD > b.walletResult.curUSD) return -1
        if (b.walletResult.curUSD > a.walletResult.curUSD) return 1
        return 0;
    });

    // console.log(bestUSD.map(val => val.walletResult.curUSD))

    let checkIndex = 2
    bestUSD[checkIndex].walletResult.positionOpens = [];
    bestUSD[checkIndex].walletResult.positionClosed = [];

    console.log("USD Winner usd:", bestUSD[checkIndex].walletResult.curUSD);
    console.log("USD Winner longs:", bestUSD[checkIndex].walletResult.longs);
    // console.log("USD Winner long wins:", bestUSD[checkIndex].walletResult.longWins);
    // console.log("USD Winner short wins:", bestUSD[checkIndex].walletResult.shortWins);
    console.log("USD Winner shorts:", bestUSD[checkIndex].walletResult.shorts);
    console.log("USD Winner wr:", bestUSD[checkIndex].walletResult.winratio);
    console.log("USD Winner dd:", bestUSD[checkIndex].walletResult.drawdown);
    console.log("USD Winner:", bestUSD[checkIndex].indicators[0].settings);
    console.log("USD Winner:", bestUSD[checkIndex].indicators[1].settings);
    console.log("USD Winner:", bestUSD[checkIndex].indicators[2].settings);

    // console.log(bestUSD.slice(0, checkIndex+1).map(val => val.indicators[0].settings.IJKLMN_LMN_min + " : " + val.indicators[0].settings.IJKLMN_LMN_max))

    // wallets = wallets.filter(val => !val.indicators[0].settings.filterBillWilliams);
    // wallets = wallets.filter(val => !val.indicators[0].settings.useTimeFractals);
    // wallets = wallets.filter(val => !val.indicators[0].settings.IJKLMN_use_J_as_pivot);
    // console.log("Init len: ", wallets.length)

    // // console.log(wallets[0].walletResult.longs)
    // const longs  = wallets.reduce((partialSum, a) => partialSum + a.walletResult.longs, 0);
    // const shorts = wallets.reduce((partialSum, a) => partialSum + a.walletResult.shorts, 0);
    // console.log("Av SHORTS:", shorts / wallets.length)
    // console.log("Av LONGS:", longs / wallets.length)

    // let IJKLMN_IJK_min = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJK_min === 0.02).length / wallets.length;
    // let IJKLMN_IJK_max = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJK_max === 1).length / wallets.length;
    // console.log("IJKLMN_IJK_min: ", IJKLMN_IJK_min)
    // console.log("IJKLMN_IJK_max: ", IJKLMN_IJK_max)

    // let IJKLMN_IJN_min = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJN_min === 0.02).length / wallets.length;
    // let IJKLMN_IJN_max = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJN_max === 1).length / wallets.length;
    // console.log("IJKLMN_IJN_min: ", IJKLMN_IJN_min)
    // console.log("IJKLMN_IJN_max: ", IJKLMN_IJN_max)

    // let IJKLMN_JKL_min = wallets.filter(val => val.indicators[0].settings.IJKLMN_JKL_min === 0.02).length / wallets.length;
    // let IJKLMN_JKL_max = wallets.filter(val => val.indicators[0].settings.IJKLMN_JKL_max === 1).length / wallets.length;
    // console.log("IJKLMN_JKL_min: ", IJKLMN_JKL_min)
    // console.log("IJKLMN_JKL_max: ", IJKLMN_JKL_max)

    // let IJKLMN_KLM_min = wallets.filter(val => val.indicators[0].settings.IJKLMN_KLM_min === 0.02).length / wallets.length;
    // let IJKLMN_KLM_max = wallets.filter(val => val.indicators[0].settings.IJKLMN_KLM_max === 1).length / wallets.length;
    // console.log("IJKLMN_KLM_min: ", IJKLMN_KLM_min)
    // console.log("IJKLMN_KLM_max: ", IJKLMN_KLM_max)

    // let IJKLMN_LMN_min = wallets.filter(val => val.indicators[0].settings.IJKLMN_LMN_min === 0.02).length / wallets.length;
    // let IJKLMN_LMN_max = wallets.filter(val => val.indicators[0].settings.IJKLMN_LMN_max === 1).length / wallets.length;
    // console.log("IJKLMN_LMN_min: ", IJKLMN_LMN_min)
    // console.log("IJKLMN_LMN_max: ", IJKLMN_LMN_max)
    
    // let timeWallets = wallets.filter(val => val.indicators[0].settings.useTimeFractals);
    // console.log(timeWallets[0])
    // console.log("DD Winner:", bestDD[0].walletResult);
    // console.log("DD Winner:", bestDD[0].indicators);

    // console.log("Total amt: ", wallets.length)
    // wallets.filter(val => val.walletResult = {});
    // await findBestStratOver1MAndWrite(wallets, 0);
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
                if (monthMapAtKey["sum"] < 0) curResult = false
            }
        }

        if (curResult) {
            result.push(curWallet);
        }
    }
    
    return result;
}

async function multiThreadStrats() {
    // let stratCombos = generateStratCombos(variationScheme, ["BTCUSDT"]);
    // console.log(stratCombos.length);

    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.filterBillWilliams);
    // stratCombos = stratCombos.filter(val => !val.indicators[0].settings.useTimeFractals);
    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_use_J_as_pivot);

    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_IJK_min < val.indicators[0].settings.IJKLMN_IJK_max);
    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_IJN_min < val.indicators[0].settings.IJKLMN_IJN_max);
    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_JKL_min < val.indicators[0].settings.IJKLMN_JKL_max);
    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_KLM_min < val.indicators[0].settings.IJKLMN_KLM_max);
    // stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_LMN_min < val.indicators[0].settings.IJKLMN_LMN_max);
    // console.log(stratCombos.length);

    // let start = new Date().getTime();
    // await findBestStratOver1MAndWrite(stratCombos, 0);
    // console.log(new Date().getTime() - start);
    await filterMonthListForBest();

    // let start = new Date().getTime();
    // let tempRes = await backtrace({
    //     "opName": "Generated_0_0",
    //     "token": "AVAXUSDT",
    //     "timeframe": "15m",
    //     "options": {
    //      "swingHighLowLookbackLength": 60,
    //      "percentageRiskedPerTrade": 25,
    //      "profitFactor": 2,
    //      "atrLength": 14,
    //      "useLimitOrders": false,
    //      "gmxLimitAdjustment": 1
    //     },
    //     "indicators": [
    //      {
    //       "name": "fractal",
    //       "settings": {
    //             "filterBillWilliams": true,
    //             "useTimeFractals":    false,
                
    //             "timeframe": 10,
    //             use_IJKLMN: true,
    //             IJKLMN_use_J_as_pivot: false,

    //             IJKLMN_IJK_min: 0,
    //             IJKLMN_IJK_max: 1,

    //             IJKLMN_IJN_min: 1,
    //             IJKLMN_IJN_max: 1000,

    //             IJKLMN_JKL_min: 0,
    //             IJKLMN_JKL_max: 1000,

    //             IJKLMN_KLM_min: 0,
    //             IJKLMN_KLM_max: 1,

    //             IJKLMN_LMN_min: 0,
    //             IJKLMN_LMN_max: 1000,
    //         }
    //      },
    //      {
    //         name: "mhull",
    //         settings: {
    //             source: "close",       
    //             hullVariation: "HMA",  
    //             lengthMultiplier: 1, 
    //             useHtf: false,         
    //             higherTimeframe: "4h", 

    //             length: 500, 
    //         }
    //     },
    //     {
    //         name: "volatilityOscillator",
    //         settings: {
    //             volLength: 20
    //         }
    //     }
    // ]}, 12);
    // console.log(new Date().getTime() - start);
    
    // console.log("usd: ", tempRes.curUSD)
    // console.log("win: ",tempRes.winratio)
    // console.log("dd: ",tempRes.drawdown)

    // Something is wrong here with the backtracer - try running it with just 1 thread or no multi atall

    // if (isMainThread) {
    //     let threadCount = 8;
    //     let stratCombos = generateStratCombos(variationScheme, ["BTCUSDT"]);
    //     console.log(stratCombos.length);

    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.filterBillWilliams);
    //     stratCombos = stratCombos.filter(val => !val.indicators[0].settings.useTimeFractals);
    //     stratCombos = stratCombos.filter(val => !val.indicators[0].settings.IJKLMN_use_J_as_pivot);

    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_IJK_min < val.indicators[0].settings.IJKLMN_IJK_max);
    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_IJN_min < val.indicators[0].settings.IJKLMN_IJN_max);
    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_JKL_min < val.indicators[0].settings.IJKLMN_JKL_max);
    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_KLM_min < val.indicators[0].settings.IJKLMN_KLM_max);
    //     stratCombos = stratCombos.filter(val => val.indicators[0].settings.IJKLMN_LMN_min < val.indicators[0].settings.IJKLMN_LMN_max);
    //     console.log(stratCombos.length);

    //     console.log("Running with ", threadCount, " threads")

    //     const threads = new Set();

    //     let bracketBreadth = Math.ceil(stratCombos.length/threadCount);

    //     console.log("Bracket breadth: ", bracketBreadth)
    //     console.log("stratCombos.length: ", stratCombos.length)

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
    //         await findBestStratOver1MAndWrite(workerData.combos, workerData.lower, (text) => parentPort.postMessage("Thread " + workerData.id + " working on " + text));
    //         parentPort.postMessage("Thread " + workerData.id + " Run time: " + (new Date().getTime() - start));
    // }
}

if (!isMainThread) {
    multiThreadStrats();
}

module.exports = multiThreadStrats;