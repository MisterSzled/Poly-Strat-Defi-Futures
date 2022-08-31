const getPairData = require("./biananceAPIs/getPairData");

const indicators = require("./indicators/index");

const getWalletTokens = require("./defi/getWalletTokens");
const openPosition = require("./defi/gmx/openPosition.js");

const cs = require("./general/chalkSpec");

const getNewPositionProfile = require("./indicators/risk/getNewPositionProfile");

const universal = require("../config").universal;

function processIndicators (strat, pairData) {
    let resultSum = 0;
    let configIndicators = strat.indicators
    for (let i = 0; i < configIndicators.length; i++) {
        let name = configIndicators[i].name;
        let temp = indicators[name](configIndicators[i], [...pairData]);

        cs[temp === 1 ? "long" : temp === -1 ? "short" : "process"](name +": "+ temp + "\n");

        resultSum += temp;
    }

    let finalResult = 0;
    if (resultSum === configIndicators.length)        finalResult = 1;
    if (resultSum === (-1 * configIndicators.length)) finalResult = -1;

    return finalResult;
}

async function main(strat) {
    global.chain = strat.wallet.chain;
    let pairData = await getPairData(strat.token, strat.timeframe, universal.maxLookBack);

    finalResult = processIndicators(strat, pairData);

    //THIS IS FOR THE NEW TA BRACKET
    // Data 0 -> length === oldest -> newest COMPLETE candle
    // closeData[closeData.length - 1] is the latest complete candle THIS IS THE STANDARD
    // let closeData = pairData.slice(0, pairData.length - 1);

    // taFuncs.bolingerbands(closeData.map(val => val[4]), 15, 2)
    //THIS IS FOR THE NEW TA BRACKET

    // TEST
    // finalResult = 1;
    // TEST

    if (Math.abs(finalResult) === 1) {
        let wallet = await getWalletTokens(strat.wallet.public);
        let usdEquity = wallet.usdc;
        // let usdEquity = 1000;

        if (finalResult === 1) {
            cs.longH("LONG! LONG! LONG!");
            profile = getNewPositionProfile(strat, usdEquity, pairData, true, pairData[pairData.length - 2][4]);

            await openPosition(
                "long", 
                strat,
                profile.longQty, 
                profile.longSL, 
                profile.longTp,
                profile.curClose,
                profile.lev
                );
        }
        if (finalResult === -1) {
            cs.shortH("SHORT! SHORT! SHORT!");
            profile = getNewPositionProfile(strat, usdEquity, pairData, false, pairData[pairData.length - 2][4]);

            await openPosition(
                "short", 
                strat, 
                profile.shortQty, 
                profile.shortSL, 
                profile.shortTp,
                profile.curClose,
                profile.lev
                );
        }
    }

    console.log("\n");
}

function getLiqRatio(L, entry, lev) {
    let a = (L * 0.98) / entry;
    let b = a - 0.98
    return (b * lev);
}

module.exports = {main, processIndicators};