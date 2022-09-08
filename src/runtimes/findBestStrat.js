
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
// const indicators = require("../indicators");
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Lower, upper, increment
let variationScheme = {
    timeframe: "15m",
    options: {
        // Risk settings
        swingHighLowLookbackLength: [10, 10, 10],
        percentageRiskedPerTrade: [25, 25, 5], 
        profitFactor: [1.8, 2.6, 0.1],
    },
    indicators: [
        {
            name: "boomHunter",
            settings: {
                LPPeriod1: [13, 17, 1],    

                LPPeriod2: [18, 25, 1],    
                k12: [0.28, 0.31, 0.01], 
            }
        },
        {
            name: "mhull",
            settings: {
                length: [550, 700, 25],
            }
        },
        {
            name: "volatilityOscillator",
            settings: {
                volLength: [75, 200, 25]
            }
        },
    ],
}

async function writeToFile(newEntries, startingIndex) {
    let filename = "./src/backtest/processed/"+startingIndex+".json"

    fs.writeFileSync(filename, JSON.stringify(newEntries, null, 1), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Written");
        }
    });
}

// Runs a shallow scan over the lookback length passed in months
async function findBestStratOver1MAndWrite (stratcombos, shunt) {
    let results = [];
    let rolloverLimit = 1000;
    for (let i = 0; i < stratcombos.length; i++) {
        let newEntry = await backtrace(stratcombos[i], 1);
        results.push({...stratcombos[i], walletResult: newEntry});

        if ((i > 0) && (((i-1) % rolloverLimit) === 0)) {
            await writeToFile(results, (shunt + i));
            results = [];
        } else if (i === stratcombos.length - 1) {
            await writeToFile(results, (shunt + i + 1));
            results = [];
        }
    }
}

async function filterMonthListForBest(token, timeframe) {
    let path = './src/backtest/processed/' + token + "/" + timeframe + "/";
    let fileNames = fs.readdirSync(path);
    let wallets = [];

    for (let i = 0; i < fileNames.length; i++) {
        let res = fs.readFileSync(path + fileNames[i]);
        res = JSON.parse(res);
        wallets = wallets.concat(res);
    }

    let bestUSD = wallets.sort((a,b) => {
        if (a.walletResult.curUSD > b.walletResult.curUSD) {
            return -1;
        }
        if (b.walletResult.curUSD > a.walletResult.curUSD) {
            return 1;
        }
        return 0;
    });

    let tolerance = 0.25;
    bestUSD.filter(val => val.walletResult.drawdown <= tolerance);

    // POST
    bestUSD = bestUSD.slice(0, 100);
    findBestOver3And6(bestUSD);
}

function sortCURUSD(list) {
    list = list.sort((a,b) => {
        if (a.curUSD > b.curUSD) {return -1}
        if (b.curUSD > a.curUSD) {return 1}
        return 0;
    });
    return list
}
function sortDD(list) {
    list = list.sort((a,b) => {
        if (a.drawdown > b.drawdown) {return -1}
        if (b.drawdown > a.drawdown) {return 1}
        return 0;
    });
    return list
}

async function findBestOver3And6(strats) {
    let over3M = [];
    let over6M = [];
    for (let i = 0; i < strats.length; i++) {
        console.log(i);
        let temp = await backtrace(strats[i], 3);
        let temp2 = await backtrace(strats[i], 6);

        over3M.push(temp);
        over6M.push(temp2);
    }

    over3M = sortCURUSD(over3M);
    over6M = sortCURUSD(over6M);

    console.log("Best at 3M");
    console.log("USD: ", over3M[0].curUSD);
    console.log("DD: ",  over3M[0].drawdown);
    console.log(over3M[0].options);
    console.log(over3M[0].indicators);
    console.log("\n");

    console.log("Best at 6M");
    console.log("USD: ", over6M[0].curUSD);
    console.log("DD: ",  over6M[0].drawdown);
    console.log(over6M[0].options);
    console.log(over6M[0].indicators);
    console.log("\n");
    
    let lowestDrawdown3M = sortDD(over3M)[0].drawdown;
    console.log(sortDD(over3M)[over3M.length - 1].drawdown);
    console.log(lowestDrawdown3M);
    console.log(over3M.length);
    let bestAtLowDD3M = over3M.filter(val => val.drawdown === lowestDrawdown3M);
    bestAtLowDD3M = sortCURUSD(bestAtLowDD3M)[0];

    console.log("Best at lowest DD 3M");
    console.log("USD: ", bestAtLowDD3M.curUSD);
    console.log("DD: ",  bestAtLowDD3M.drawdown);
    console.log(bestAtLowDD3M.options);
    console.log(bestAtLowDD3M.indicators);
    console.log("\n");

    let lowestDrawdown6M = sortDD(over6M)[0].drawdown;
    let bestAtLowDD6M = over6M.filter(val => val.drawdown === lowestDrawdown6M);
    bestAtLowDD6M = sortCURUSD(bestAtLowDD6M)[0];

    console.log("Best at lowest DD 6M");
    console.log("USD: ", bestAtLowDD6M.curUSD);
    console.log("DD: ",  bestAtLowDD6M.drawdown);
    console.log(bestAtLowDD6M.options);
    console.log(bestAtLowDD6M.indicators);
    console.log("\n");    
}

//This is for after this function has run
// await filterMonthListForBest("ETHUSDT", "15m");

async function multiThreadStrats() {
    // let stratCombos = generateStratCombos(variationScheme, "AVAXUSDT");
    // console.log(stratCombos[0]);
    // console.log(stratCombos.length);
    // await findBestStratOver1MAndWrite(stratCombos, 0);

    await filterMonthListForBest("ETHUSDT", "15m");

    if (isMainThread) {
        let threadCount = 8;
        let stratCombos = generateStratCombos(variationScheme, "BTCUSDT");
        console.log("Running with ", threadCount, " threads")

        const threads = new Set();

        let bracketBreadth = Math.ceil(stratCombos.length/threadCount);

        for (let i = 0; i < threadCount; i++) {
            let lower = i*bracketBreadth;
            let upper = (i+1)*bracketBreadth;
            console.log("Thread: ", i, " Lower: ", lower, " Upper: ", upper);

            threads.add(new Worker(__filename, { workerData: 
                { 
                    id: i,
                    lower: lower,
                    upper: upper,
                    combos: stratCombos.slice(lower, upper),
                }
            }));
        }

        threads.forEach(thread => {
            thread.on('message', (msg) => {
                console.log(msg)
            });
        })
    } else {
            parentPort.postMessage("Thread: " + workerData.id + " from: " + workerData.lower);
            let start = new Date().getTime();
            await findBestStratOver1MAndWrite(workerData.combos, workerData.lower);
            parentPort.postMessage("Thread " + workerData.id + " Run time: " + (new Date().getTime() - start));
        // }
    }
}

if (!isMainThread) {
    multiThreadStrats();
}

module.exports = multiThreadStrats;