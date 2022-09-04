
const backtrace = require("./backtrace");
const generateStratCombos = require("../general/generateStratCombos");
const indicators = require("../indicators");

let token     = "";
let timeframe = "";

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
//64350

// async function writeToFile(newEntries, shunt) {
//     let filename = "./src/savedData/stratResults_"+shunt+".txt"

//     let stratResults;
//     if (fs.existsSync(filename)) {
//         stratResults = await JSON.parse(fs.readFileSync(filename, 'utf8'));
//     } else {
//         stratResults = [];
//     }
//     stratResults = stratResults.concat(newEntries);

//     fs.writeFileSync(filename, JSON.stringify(stratResults, null, 1), function(err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Written");
//         }
//     });
// }

// Runs a shallow scan over the lookback length passed in months
async function findBestStrat (strat, lookback) {
    token = strat.token;
    timeframe = strat.timeframe;
    let stratcombos = generateStratCombos(variationScheme);    

    for (let i = 0; i < stratcombos.length; i++) {
        console.log("Starting:", stratcombos[i].opName)
        await backtrace(stratcombos[i], 1)
    }

    // console.log(stratcombos[stratcombos.length - 1].indicators);

    // await backtrace(strat, 1);
    // await backtrace(strat, 1);
}

module.exports = findBestStrat;