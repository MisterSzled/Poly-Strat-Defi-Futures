
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

        let newEntry = await backtrace(stratcombos[i], 12);
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

    console.log("Total run: ", wallets.length);

    // wallets = filterForTokenSuccessParity(wallets);
    // console.log("Total triples: ", wallets.length);

    // console.log(wallets.map(val => val.BTCUSDT.walletResult.curUSD))
    // console.log(wallets.map(val => val.ETHUSDT.walletResult.curUSD))
    // console.log(wallets.map(val => val.AVAXUSDT.walletResult.curUSD))
    // console.log(wallets.map(val => val.BTCUSDT.rulesets[0].indicators[0].curUSD));
    // console.log(wallets.map(val => val.ETHUSDT.rulesets[0].indicators[0].curUSD));
    // console.log(wallets.map(val => val.AVAXUSDT.rulesets[0].indicators[0].curUSD));

    // let checkDex = 0
    // console.log("BTC:");
    // console.log("BTC: ", wallets[checkDex].BTCUSDT.walletResult.curUSD);
    // console.log("BTC: ", wallets[checkDex].BTCUSDT.walletResult.winratio);
    // console.log("BTC: ", wallets[checkDex].BTCUSDT.walletResult.drawdown);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].options.swingHighLowLookbackLength);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].options.percentageRiskedPerTrade);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].options.profitFactor);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].indicators[0].settings);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].indicators[1].settings);
    // console.log(wallets[checkDex].BTCUSDT.rulesets[0].indicators[2].settings);

    // console.log("ETH:");
    // console.log("ETH: ", wallets[checkDex].ETHUSDT.walletResult.curUSD);
    // console.log("ETH: ", wallets[checkDex].ETHUSDT.walletResult.winratio);
    // console.log("ETH: ", wallets[checkDex].ETHUSDT.walletResult.drawdown);

    // console.log("AVX:");
    // console.log("AVX: ", wallets[checkDex].AVAXUSDT.walletResult.curUSD);
    // console.log("AVX: ", wallets[checkDex].AVAXUSDT.walletResult.winratio);
    // console.log("AVX: ", wallets[checkDex].AVAXUSDT.walletResult.drawdown);
    // console.log(wallets.map(val => val.AVAXUSDT.rulesets[0].options));
    // console.log(wallets.map(val => val.AVAXUSDT.rulesets[0].indicators[1].settings));
    // console.log(wallets.map(val => val.AVAXUSDT.rulesets[0].indicators[2].settings));
    // let temp = [];

    // for (let i = 0; i < wallets.length; i++) {
    //     temp.push({
    //         shorts: wallets[i].BTCUSDT.walletResult.shorts,
    //         longs: wallets[i].BTCUSDT.walletResult.longs,
    //         curUSD: wallets[i].BTCUSDT.walletResult.curUSD,
    //         wr: wallets[i].BTCUSDT.walletResult.winratio,
    //         dd: wallets[i].BTCUSDT.walletResult.drawdown,
    //     });
    //     temp.push({
    //         shorts: wallets[i].ETHUSDT.walletResult.shorts,
    //         longs: wallets[i].ETHUSDT.walletResult.longs,
    //         curUSD: wallets[i].ETHUSDT.walletResult.curUSD,
    //         wr: wallets[i].ETHUSDT.walletResult.winratio,
    //         dd: wallets[i].ETHUSDT.walletResult.drawdown,
    //     });
    //     temp.push({
    //         shorts: wallets[i].AVAXUSDT.walletResult.shorts,
    //         longs: wallets[i].AVAXUSDT.walletResult.longs,
    //         curUSD: wallets[i].AVAXUSDT.walletResult.curUSD,
    //         wr: wallets[i].AVAXUSDT.walletResult.winratio,
    //         dd: wallets[i].AVAXUSDT.walletResult.drawdown,
    //     });
    // }

    // await writeToFile("./src/backtest/processed/CSVTESTX.json", temp);

    let winUSDThreshold = 250;
    let winDDThreshold  = 0.6;
    wallets = wallets.filter(val => val.walletResult.curUSD > winUSDThreshold);
    wallets = wallets.filter(val => val.walletResult.drawdown < winDDThreshold);
    // wallets = wallets.filter(val => (val.walletResult.longs + val.walletResult.shorts) > 0);
    // wallets = wallets.filter(val => val.rulesets[0].options.profitFactor === 5);
    // wallets = wallets.filter(val => val.indicators[0].settings.IJKLMN_IJN_max !== 1000);
    // wallets = wallets.filter(val => !val.indicators[0].settings.useTimeFractals);

    console.log("Total wins: ", wallets.length)

    wallets = filterForConsistent(wallets);
    console.log("Total conssitent: ", wallets.length)

    let bestUSD = [...wallets].sort((a,b) => {
        if (a.walletResult.curUSD > b.walletResult.curUSD) return -1
        if (b.walletResult.curUSD > a.walletResult.curUSD) return 1
        return 0;
    });

    // console.log(bestUSD.map(val => val.walletResult.curUSD))

    let checkIndex = 0
    bestUSD[checkIndex].walletResult.positionOpens = [];
    bestUSD[checkIndex].walletResult.positionClosed = [];

    console.log("USD Winner usd:", bestUSD[checkIndex].walletResult.curUSD);
    console.log("USD Winner longs:", bestUSD[checkIndex].walletResult.longs);
    console.log("USD Winner shorts:", bestUSD[checkIndex].walletResult.shorts);
    console.log("USD Winner wr:", bestUSD[checkIndex].walletResult.winratio);
    console.log("USD Winner dd:", bestUSD[checkIndex].walletResult.drawdown);
    console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].options);
    // console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[0].settings);
    console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[1].settings);
    console.log("USD Winner:", bestUSD[checkIndex].rulesets[0].indicators[2].settings);
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
    let stratCombos = generateStratCombos(variationScheme, ["AVAXUSDT"]);
    console.log(stratCombos.length);
    // console.log(stratCombos[0]);
    // console.log(stratCombos[0].rulesets[0].indicators[0]);
    // console.log(stratCombos[1].rulesets[0].indicators[2]);
    // console.log(stratCombos[0].rulesets[0].indicators);
    // console.log(stratCombos[1].rulesets[0].indicators);

    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.filterBillWilliams);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.useTimeFractals);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot);

    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_IJK_min < val.rulesets[0].indicators[0].settings.IJKLMN_IJK_max);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_IJN_min < val.rulesets[0].indicators[0].settings.IJKLMN_IJN_max);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_JKL_min < val.rulesets[0].indicators[0].settings.IJKLMN_JKL_max);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_KLM_min < val.rulesets[0].indicators[0].settings.IJKLMN_KLM_max);
    stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_LMN_min < val.rulesets[0].indicators[0].settings.IJKLMN_LMN_max);
    console.log(stratCombos.length);

    // let start = new Date().getTime();
    // await findBestStratOver1MAndWrite(stratCombos, 0);
    // console.log(new Date().getTime() - start);
    // await filterMonthListForBest();

    let start = new Date().getTime();
    let tempRes = await backtrace({
        opName: "Multi TTT", 
        token: "BTCUSDT", 
        timeframe: "15m",

        rulesets: [
            {
                options: {
                    swingHighLowLookbackLength: 70,
                    percentageRiskedPerTrade: 25,
                    profitFactor: 5,
    
                    atrLength: 14,
                    useLimitOrders: false,
                    gmxLimitAdjustment: 1,
                },
                indicators: [
                    {
                        name: "fractal",
                        settings: {
                            use_IJKLMN: true,
    
                            filterBillWilliams: true,
                            useTimeFractals: true,
                            timeframe: 10,
                            IJKLMN_use_J_as_pivot: true,
            
                            IJKLMN_IJK_min: 1,
                            IJKLMN_IJK_max: 1000,
            
                            IJKLMN_IJN_min: 0,
                            IJKLMN_IJN_max: 1000,
            
                            IJKLMN_JKL_min: 0,
                            IJKLMN_JKL_max: 1,
            
                            IJKLMN_KLM_min: 0,
                            IJKLMN_KLM_max: 1,
            
                            IJKLMN_LMN_min: 0,
                            IJKLMN_LMN_max: 1,
                        }
                    },
                    {
                        name: "mhull",
                            settings: {
                                hullVariation: "HMA",  //Only uses HMA atm
                                length: 700,           //Max value is 2x < 1000 === 499
                                lengthMultiplier: 1,    //This can be used but is literally the same as simply increaseing length
                            }
                    },
                    {
                        name: "volatilityOscillator",
                        settings: {
                            volLength: 70
                        }
                    },
                ],
            },
            {
                options: {
                    swingHighLowLookbackLength: 60,
                    percentageRiskedPerTrade: 20,
                    profitFactor: 4,
    
                    atrLength: 14,
                    useLimitOrders: false,
                    gmxLimitAdjustment: 1,
                },
                indicators: [
                    {
                        name: "fractal",
                        settings: {
                            use_IJKLMN: true,
    
                            filterBillWilliams: true,
                            useTimeFractals: true,
                            timeframe: 10,
                            IJKLMN_use_J_as_pivot: true,
            
                            IJKLMN_IJK_min: 0,
                            IJKLMN_IJK_max: 1000,
            
                            IJKLMN_IJN_min: 1,
                            IJKLMN_IJN_max: 1000,
            
                            IJKLMN_JKL_min: 0,
                            IJKLMN_JKL_max: 1,
            
                            IJKLMN_KLM_min: 0,
                            IJKLMN_KLM_max: 1,
            
                            IJKLMN_LMN_min: 0,
                            IJKLMN_LMN_max: 1,
                        }
                    },
                    {
                        name: "mhull",
                            settings: {
                                hullVariation: "HMA",
                                length: 700,
                                lengthMultiplier: 1,
                            }
                    },
                    {
                        name: "volatilityOscillator",
                        settings: {
                            volLength: 50
                        }
                    },
                ],
            },
        ]
    }, 12);
    console.log(new Date().getTime() - start);
    
    // if (isMainThread) {
    //     let threadCount = 4;
    //     let stratCombos = generateStratCombos(variationScheme, ["ETHUSDT"]);
    //     console.log(stratCombos.length);

    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.filterBillWilliams);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.useTimeFractals);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_use_J_as_pivot);

    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_IJK_min < val.rulesets[0].indicators[0].settings.IJKLMN_IJK_max);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_IJN_min < val.rulesets[0].indicators[0].settings.IJKLMN_IJN_max);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_JKL_min < val.rulesets[0].indicators[0].settings.IJKLMN_JKL_max);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_KLM_min < val.rulesets[0].indicators[0].settings.IJKLMN_KLM_max);
    //     stratCombos = stratCombos.filter(val => val.rulesets[0].indicators[0].settings.IJKLMN_LMN_min < val.rulesets[0].indicators[0].settings.IJKLMN_LMN_max);
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