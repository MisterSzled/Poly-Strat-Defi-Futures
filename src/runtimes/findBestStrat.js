
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
// const indicators = require("../indicators");
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Lower, upper, increment
let variationScheme = {

    token: "ETHUSDT", 
    timeframe: "15m",

    options: {
        // Risk settings
        swingHighLowLookbackLength: [10, 30, 10],
        percentageRiskedPerTrade: [25, 25, 5], 
        profitFactor: [2, 2, 1],
    },

    indicators: [
        {
            name: "boomHunter",
            settings: {
                LPPeriod1: [8, 20, 1],    

                LPPeriod2: [15, 25, 1],    
                k12: [0.28, 0.39, 0.01], 
            }
        },
        {
            name: "mhull",
            settings: {
                length: [300, 700, 100],
            }
        },
        {
            name: "volatilityOscillator",
            settings: {
                volLength: [50, 150, 50]
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
async function findBestStrat (stratcombos, shunt) {
    let results = [];
    let rolloverLimit = 1000;
    for (let i = 0; i < stratcombos.length - 1; i++) {
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
        // console.log(res[0].walletResult.curUSD)
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

    // POST
    bestUSD = bestUSD.slice(0, 100);
    findBestOver3And6(bestUSD);
}

async function findBestOver3And6 (strats) {
    let over3M = [];
    let over6M = [];
    for (let i = 0; i < bestUSD.length; i++) {
        console.log(i);
        let temp = await backtrace(bestUSD[i], 3);
        let temp2 = await backtrace(bestUSD[i], 6);

        over3M.push(temp);
        over6M.push(temp2);
    }

    over3M = over3M.sort((a,b) => {
        if (a.curUSD > b.curUSD) {
            return -1;
        }
        if (b.curUSD > a.curUSD) {
            return 1;
        }
        return 0;
    });
    over6M = over6M.sort((a,b) => {
        if (a.curUSD > b.curUSD) {
            return -1;
        }
        if (b.curUSD > a.curUSD) {
            return 1;
        }
        return 0;
    });

    console.log(over3M[0]);
    console.log(over3M[0].options);
    console.log(over3M[0].indicators);
    console.log("\n");

    console.log(over6M[0]);
    console.log(over6M[0].options);
    console.log(over6M[0].indicators);
    console.log("\n");

    console.log(over3M[0].curUSD);
    console.log(over3M[over3M.length - 1].curUSD);
    console.log(over6M[0].curUSD);
    console.log(over6M[over6M.length - 1].curUSD);
}

async function multiThreadStrats() {
    // let stratCombos = generateStratCombos(variationScheme);
    // findBestStrat(stratCombos);

    await filterMonthListForBest("ETHUSDT", "15m");

    // if (isMainThread) {
    //     let threadCount = 8;
    //     let stratCombos = generateStratCombos(variationScheme);
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
    //         await findBestStrat(workerData.combos, workerData.lower);
    //         parentPort.postMessage("Thread " + workerData.id + " Run time: " + (new Date().getTime() - start));
    //     // }
    // }

}

if (!isMainThread) {
    multiThreadStrats()
}

module.exports = multiThreadStrats;