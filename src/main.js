const getPairData = require("./biananceAPIs/getPairData");

const indicators = require("./indicators/index");

const getWalletTokens = require("./defi/getWalletTokens");
const openPosition = require("./defi/gmx/openPosition.js");

const cs = require("./general/chalkSpec");

const getNewPositionProfile = require("./indicators/risk/getNewPositionProfile");

const universal = require("../config").universal;

function processIndicators (strat, pairData) {
    let results = [];
    
    for (let j = 0; j < strat.rulesets.length; j++) {
        let resultSum = 0;
        let configIndicators = strat.rulesets[j].indicators

        cs.process("Set " + j);
        for (let i = 0; i < configIndicators.length; i++) {
            // let start = new Date().getTime();
            let name = configIndicators[i].name;
            let temp = indicators[name](configIndicators[i], [...pairData]);
            cs[temp === 1 ? "long" : temp === -1 ? "short" : "process"](name +": "+ temp + "\n");

            resultSum += temp;
        }


        let setResult = 0;
        if (resultSum === configIndicators.length)        setResult = 1;
        if (resultSum === (-1 * configIndicators.length)) setResult = -1;
        results.push({index: j, result: setResult});
    }
    
    cs.process("Set res: " + results.map(val => val.result))

    return results;
}

async function main(strat) {
    global.chain = strat.wallet.chain;
    let pairData = await getPairData(strat.token, strat.timeframe, universal.maxLookBack);
    let resArray = processIndicators(strat, pairData);

    let finalResult = 0;
    let finalIndex = 0;
    for (let i = 0; i < resArray.length; i++) {
        if (resArray[i].result !== 0) {
            finalIndex = resArray[i].index;
            finalResult = resArray[i].result;
        }
    }

    //THIS IS FOR THE NEW TA BRACKET
    // Data 0 -> length === oldest -> newest COMPLETE candle
    // closeData[closeData.length - 1] is the latest complete candle THIS IS THE STANDARD
    // let closeData = pairData;

    // taFuncs.cmo([...pairData], 15)
    //THIS IS FOR THE NEW TA BRACKET

    // TEST
    // finalResult = -1;
    // finalIndex = 0;
    // TEST

    if (Math.abs(finalResult) === 1) {
        let wallet = await getWalletTokens(strat.wallet.public);
        let usdEquity = wallet.usdc;
        // let usdEquity = 1000;

        if (finalResult === 1) {
            cs.longH("LONG! LONG! LONG!");
            profile = getNewPositionProfile(strat.rulesets[finalIndex].options, usdEquity, pairData, true, pairData[pairData.length - 2][4]);

            await openPosition(
                "long", 
                strat,
                finalIndex,
                profile.longQty, 
                profile.longSL, 
                profile.longTp,
                profile.curClose,
                profile.lev
                );
        }
        if (finalResult === -1) {
            cs.shortH("SHORT! SHORT! SHORT!");
            profile = getNewPositionProfile(strat.rulesets[finalIndex].options, usdEquity, pairData, false, pairData[pairData.length - 2][4]);

            await openPosition(
                "short", 
                strat, 
                finalIndex,
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

module.exports = {main, processIndicators};