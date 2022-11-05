
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
const writeToFile = require("../general/writeToFile");
const variationScheme = require("../../config").variationScheme;
// const indicators = require("../indicators");
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

async function findBestStratOver1MAndWrite (stratcombos, shunt, messenger) {
    let results = [];
    let rolloverLimit = 10;
    for (let i = 0; i < stratcombos.length; i++) {

        if (!!messenger) {
            messenger(i)
        }

        let newEntry = await backtrace(stratcombos[i], 2);
        results.push({...stratcombos[i], walletResult: newEntry});

        

        if ((i > 0) && (((i-1) % rolloverLimit) === 0)) {
            await writeToFile("./src/backtest/processed/ethSAR_"+(shunt + i)+".json", results);
            results = [];
        } else if (i === stratcombos.length - 1) {
            await writeToFile("./src/backtest/processed/ethSAR_"+(shunt + i + 1)+".json", results);
            results = [];
        }
    }
}

function filterForTokenSuccessParity(wallets) {
    let ETHUSDT = [];
    let BTCUSDT = [];
    let AVAXUSDT = [];

    // BTCUSDT", "ETHUSDT", "AVAXUSDT

    for(let i = 0; i < wallets.length; i++) {
        if (wallets[i].token === "AVAXUSDT") AVAXUSDT.push(wallets[i]);
        if (wallets[i].token === "ETHUSDT")  ETHUSDT.push(wallets[i]);
        if (wallets[i].token === "BTCUSDT")  BTCUSDT.push(wallets[i]);
    }

    let triples = [];

    for (let i = 0; i < ETHUSDT.length; i++) {
        let sameBTC = BTCUSDT.find(btcTemp => {
            return (btcTemp.rulesets[0].indicators[0].settings.filterBillWilliams === ETHUSDT[i].rulesets[0].indicators[0].settings.filterBillWilliams) &&
            (btcTemp.rulesets[0].indicators[0].settings.useTimeFractals === ETHUSDT[i].rulesets[0].indicators[0].settings.useTimeFractals) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_IJK_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJK_min) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_IJK_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJK_max) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_IJN_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJN_min) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_IJN_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJN_max) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_JKL_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_JKL_min) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_JKL_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_JKL_max) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_KLM_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_KLM_min) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_KLM_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_KLM_max) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_LMN_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_LMN_min) &&
            (btcTemp.rulesets[0].indicators[0].settings.IJKLMN_LMN_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_LMN_max) &&
            (btcTemp.rulesets[0].indicators[1].settings.length === ETHUSDT[i].rulesets[0].indicators[1].settings.length) &&
            (btcTemp.rulesets[0].indicators[2].settings.volLength === ETHUSDT[i].rulesets[0].indicators[2].settings.volLength) 
        });
        let sameAVX = AVAXUSDT.find(avxTemp => {
            return (avxTemp.rulesets[0].indicators[0].settings.filterBillWilliams === ETHUSDT[i].rulesets[0].indicators[0].settings.filterBillWilliams) &&
            (avxTemp.rulesets[0].indicators[0].settings.useTimeFractals === ETHUSDT[i].rulesets[0].indicators[0].settings.useTimeFractals) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_IJK_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJK_min) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_IJK_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJK_max) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_IJN_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJN_min) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_IJN_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_IJN_max) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_JKL_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_JKL_min) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_JKL_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_JKL_max) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_KLM_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_KLM_min) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_KLM_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_KLM_max) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_LMN_min === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_LMN_min) &&
            (avxTemp.rulesets[0].indicators[0].settings.IJKLMN_LMN_max === ETHUSDT[i].rulesets[0].indicators[0].settings.IJKLMN_LMN_max) &&
            (avxTemp.rulesets[0].indicators[1].settings.length === ETHUSDT[i].rulesets[0].indicators[1].settings.length) &&
            (avxTemp.rulesets[0].indicators[2].settings.volLength === ETHUSDT[i].rulesets[0].indicators[2].settings.volLength) 
        });

        let dollarThreshold = 500
        if (
            (ETHUSDT[i].walletResult.curUSD > dollarThreshold) && 
            (sameBTC.walletResult.curUSD > dollarThreshold) && 
            (sameAVX.walletResult.curUSD > dollarThreshold)
        ) {
            triples.push({
                ETHUSDT: ETHUSDT[i],
                BTCUSDT: sameBTC,
                AVAXUSDT: sameAVX,
            });
        }
    }

    return triples;
}

function getLargestDeviationFromRatio(wallet, getMinMax) {
    let target = wallet;

    let fullLen = target.walletResult.positionClosed.length;
    let slice_1_4 = [...target.walletResult.positionClosed].slice(0,           fullLen/4);
    let slice_2_4 = [...target.walletResult.positionClosed].slice(fullLen/4,   fullLen/2);
    let slice_3_4 = [...target.walletResult.positionClosed].slice(fullLen/2, fullLen*3/4);
    let slice_4_4 = [...target.walletResult.positionClosed].slice(fullLen*3/4,   fullLen);
    let slice_1_2 = [...target.walletResult.positionClosed].slice(0,           fullLen/2);
    let slice_2_2 = [...target.walletResult.positionClosed].slice(fullLen/2,     fullLen);

    let s14 = slice_1_4.filter(val => val.delta > 0).length / slice_1_4.length;
    let s24 = slice_2_4.filter(val => val.delta > 0).length / slice_2_4.length;
    let s34 = slice_3_4.filter(val => val.delta > 0).length / slice_3_4.length;
    let s44 = slice_4_4.filter(val => val.delta > 0).length / slice_4_4.length;

    let s12 = slice_1_2.filter(val => val.delta > 0).length / slice_1_2.length;
    let s22 = slice_2_2.filter(val => val.delta > 0).length / slice_2_2.length;

    let all = [s14, s24, s34, s44, s12, s22];
    let min = Math.min(...all);
    let max = Math.max(...all);

    if (getMinMax) {
        return {min:min, max:max};
    }

    let totRatio = target.walletResult.winratio;
    let result = Math.max(totRatio - min, max - totRatio);

    return result
}

async function filterMonthListForBest() {
    let path = './src/backtest/processed/';
    let fileNames = fs.readdirSync(path);
    let wallets = [];

    fileNames = fileNames.filter(val => val.includes(".json"));

    let btcWins = [];
    let ethWins = [];
    let avaxWins = [];

    for (let i = 0; i < fileNames.length; i++) {
        let res = fs.readFileSync(path + fileNames[i]);
        res = JSON.parse(res);

        // if (fileNames[i].includes("btc")) {
        //     btcWins = btcWins.concat(res)
        // }
        // if (fileNames[i].includes("avax")) {
        //     avaxWins = avaxWins.concat(res)
        // }
        // if (fileNames[i].includes("eth")) {
        //     ethWins = ethWins.concat(res)
        // }

        wallets = wallets.concat(res);
    }

    // console.log("Total run: ", wallets.length);
    // getLargestDeviationFromRatio(wallets[0])

    let deviants = [];
    for (let i = 0; i < wallets.length; i++) {
        let temp = {...wallets[i]};
        temp.deviation = getLargestDeviationFromRatio(wallets[i]);
        deviants.push(temp)
    }

    let deviantsSorted = [...deviants].sort((a,b) => {
        if (a.deviation > b.deviation) return 1
        if (b.deviation > a.deviation) return -1
        return 0;
    });

    console.log("Wallet: ", deviantsSorted[0].walletResult.curUSD, 
                " winratio: ", 
                deviantsSorted[0].walletResult.winratio, 
                "::", 
                getLargestDeviationFromRatio(deviantsSorted[0], true).max,
                getLargestDeviationFromRatio(deviantsSorted[0], true).min);

    // console.log("Wallet: ", deviantsSorted[1].walletResult.curUSD, 
    //             " winratio: ", 
    //             deviantsSorted[1].walletResult.winratio, 
    //             "::", 
    //             getLargestDeviationFromRatio(deviantsSorted[1], true).max,
    //             getLargestDeviationFromRatio(deviantsSorted[1], true).min);

    // console.log("Wallet: ", deviantsSorted[2].walletResult.curUSD, 
    //             " winratio: ", 
    //             deviantsSorted[2].walletResult.winratio, 
    //             "::", 
    //             getLargestDeviationFromRatio(deviantsSorted[2], true).max,
    //             getLargestDeviationFromRatio(deviantsSorted[2], true).min);

    // console.log(deviantsSorted[1].rulesets[0].options)
    // console.log(deviantsSorted[1].rulesets[0].indicators[0])
    // console.log(deviantsSorted[1].rulesets[0].indicators[1])
    // console.log(deviantsSorted[1].rulesets[0].indicators[2])
    
    // let deviantIndex = 0;
    // let winDeviants = deviantsSorted.filter(val => val.walletResult.curUSD > 250);
    // console.log("Wallet: ", winDeviants[deviantIndex].walletResult.curUSD, 
    //             " winratio: ", 
    //             winDeviants[deviantIndex].walletResult.winratio, 
    //             " ::", 
    //             getLargestDeviationFromRatio(winDeviants[deviantIndex], true).max,
    //             getLargestDeviationFromRatio(winDeviants[deviantIndex], true).min);

    // console.log(winDeviants[deviantIndex].rulesets[0].options)
    // console.log(winDeviants[deviantIndex].rulesets[0].indicators[0])
    // console.log(winDeviants[deviantIndex].rulesets[0].indicators[1])
    // console.log(winDeviants[deviantIndex].rulesets[0].indicators[2])

    // let winUSDThreshold = 300;
    // let winDDThreshold  = 0.6;
    // wallets = wallets.filter(val => val.walletResult.curUSD > winUSDThreshold);
    // wallets = wallets.filter(val => val.walletResult.drawdown < winDDThreshold);

    // console.log("Total wins: ", wallets.length)

    // let bestUSD = [...wallets].sort((a,b) => {
    //     if (a.walletResult.curUSD > b.walletResult.curUSD) return -1
    //     if (b.walletResult.curUSD > a.walletResult.curUSD) return 1
    //     return 0;
    // });

    // console.log(bestUSD.map(val => val.walletResult.curUSD))

    // let checkIndex = 0
    // bestUSD[checkIndex].walletResult.positionOpens = [];
    // bestUSD[checkIndex].walletResult.positionClosed = [];

    // console.log("USD Winner usd:", bestUSD[checkIndex].walletResult.curUSD);
    // console.log("USD Winner longs:", bestUSD[checkIndex].walletResult.longs);
    // console.log("USD Winner shorts:", bestUSD[checkIndex].walletResult.shorts);
    // console.log("USD Winner wr:", bestUSD[checkIndex].walletResult.winratio);
    // console.log("USD Winner dd:", bestUSD[checkIndex].walletResult.drawdown);
    // console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].options);
    // console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[0].settings);
    // console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[1].settings);
    // console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[2].settings);

    // let resToWrite = bestUSD.map(val => {return {...val, walletResult: {}}});
    // console.log(resToWrite[0]);
    // console.log("Res length: ", resToWrite.length);

    // bestUSD = bestUSD.map(wallet => {return {...wallet, walletResult: {...wallet.walletResult, positionOpens: [], positionClosed: []}}})

    let letUpperWR = 0.6;
    let letLowerWR = 0.4;
    let uppers = wallets.filter(val => val.walletResult.winratio >= letUpperWR);
    let lowers = wallets.filter(val => val.walletResult.winratio <= letLowerWR);

    console.log(uppers.length)
    console.log(lowers.length)

    // let res = uppers.concat(lowers);
    // console.log(res.length)

    // await writeToFile("./src/backtest/processed/avax18MExtreams.json", res);
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

        let significantTrades = 100 / curWallet.rulesets[0].options.percentageRiskedPerTrade;
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
    let stratCombos = generateStratCombos(variationScheme, ["ETHUSDT"]);
    // console.log(stratCombos.length);

    // let path = './src/backtest/processed/';
    // let fileNames = fs.readdirSync(path);

    // fileNames = fileNames.filter(val => val.includes("eth12MExtreams.json"));

    // let stratCombos = []

    // for (let i = 0; i < fileNames.length; i++) {
    //     let res = fs.readFileSync(path + fileNames[i]);
    //     res = JSON.parse(res);

    //     stratCombos = stratCombos.concat(res);
    // }

    // stratCombos = stratCombos.map(val => ({...val, token: "AVAXUSDT", walletResult: {}}));
    // console.log("Total run: ", stratCombos.length);

    // let mappedWallets = [];
    // for (let i = 0; i < wallets.length; i++) {
        // mappedWallets.push({...wallets[i], token: "BTCUSDT"});
        // mappedWallets.push({...wallets[i], token: "ETHUSDT"});
        // mappedWallets.push({...wallets[i], token: "AVAXUSDT"});
    // }
    // console.log(mappedWallets.length)

    // console.log(mappedWallets[0].token);
    // console.log(mappedWallets[1].token);
    // console.log(mappedWallets[2].token);
    // console.log(mappedWallets[0].rulesets[0].indicators[0]);
    // console.log(mappedWallets[1].rulesets[0].indicators[0]);
    // console.log(mappedWallets[2].rulesets[0].indicators[0]);
    // console.log(mappedWallets[150].rulesets[0].indicators[0]);

    let start = new Date().getTime();
    await findBestStratOver1MAndWrite(stratCombos, 0);
    console.log(new Date().getTime() - start);
    // await filterMonthListForBest();

    // let start = new Date().getTime();
    // let tempRes = await backtrace({
    //     token: "ETHUSDT", 
    //     timeframe: "15m",

    //     rulesets: [
    //         {
    //             opName:  "rev1",
    //             options: {
    //                 percentageRiskedPerTrade: 5, // min 1 max 98
    //                 profitFactor: 2, // This predominantly effects how long term your positions are
    //                 riskFactor:   1,

    //                 pricer: "swingAndATR",
    //                 swingHighLowLookbackLength: 88,
    //                 atrLength: 14,
    //             },

    //             indicators: [
    //                 {
    //                     name: "parabolicSAR",
    //                     settings: {
    //                         trendCode: 3, // 5m:1, 15m:3, 60m:7 180m:9 
    //                     }
    //                 },
    //                 {
    //                     name: "squeezeMomentum",
    //                     settings: {
    //                         bbLength:     20,  
    //                         bbMultiplier: 2,
    //                         kcLength:     20,
    //                         kcMultiplier: 1.5,

    //                         reportChangeInMomentum: false
    //                     }
    //                 },
    //                 {
    //                     name: "duoMA",
    //                     settings: {
    //                         ma1_type: "EMA",
    //                         ma1_length: 200,
    //                         ma2_type: "SMA",
    //                         ma2_length: 50,
    //                     }
    //                 },
    //                 {
    //                     name: "hawkeyeVolumne",
    //                     settings: {
    //                         length: 200,
    //                         divisor: 1,
    //                     }
    //                 }
    //                 // {
    //                 //     name: "boomHunter",
    //                 //     settings: {
    //                 //         triggerLength: 1, 
            
    //                 //         LPPeriod1: 25,    
    //                 //         k1: 0,
            
    //                 //         LPPeriod2: 34,    
    //                 //         k12: 0.3, 
    //                 //     }
    //                 // },
    //                 // {
    //                 //     name: "mhull",
    //                 //         settings: {
    //                 //             source: "close",       //Only uses close atm
    //                 //             hullVariation: "HMA",  //Only uses HMA atm
    //                 //             length: 3,           //Max value is 2x < 1000 === 499
    //                 //             lengthMultiplier: 1,    //This can be used but is literally the same as simply increaseing length
    //                 //             useHtf: false,         //NOT IMPLEMENTS
    //                 //             higherTimeframe: "4h", //PART OF useHtf NOT IMPLEMENTD
    //                 //         }
    //                 // },
    //                 // {
    //                 //     name: "volatilityOscillator",
    //                 //     settings: {
    //                 //         volLength: 1
    //                 //     }
    //                 // },
    //             ],
    //         },
    //     ]
    // }, 1);
    // console.log(new Date().getTime() - start);
    
    // if (isMainThread) {
    //     let threadCount = 6;
    //     let stratCombos = generateStratCombos(variationScheme, ["ETHUSDT"]);
    //     console.log(stratCombos.length);

    //     // let path = './src/backtest/processed/';
    //     // let fileNames = fs.readdirSync(path);
    //     // fileNames = fileNames.filter(val => val.includes("btc10MExtreams.json"));
    //     // let stratCombos = []
    //     // for (let i = 0; i < fileNames.length; i++) {
    //     //     let res = fs.readFileSync(path + fileNames[i]);
    //     //     res = JSON.parse(res);

    //     //     stratCombos = stratCombos.concat(res);
    //     // }
    //     // stratCombos = stratCombos.map(val => ({...val, walletResult: {}}));


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