const getPairData = require("./biananceAPIs/getPairData");

const indicators = require("./indicators/index");
const taFuncs    = require("./indicators/taFuncs/index");

const getWalletTokens = require("./defi/getWalletTokens");
const openPosition = require("./defi/openPosition.js");

const truncateNum = require("./general/truncateNum.js");
const cs = require("./general/chalkSpec");

const calculateRiskQuantities = require("./indicators/risk/calculateRiskQuantities")

const universal = require("../config").universal

async function main(strat) {
    let pairData = await getPairData(strat.token, strat.timeframe, universal.maxLookBack);

    let resultSum = 0;
    let configIndicators = strat.indicators
    for (let i = 0; i < configIndicators.length; i++) {
        let name = configIndicators[i].name;
        let temp = indicators[name](configIndicators[i], [...pairData]);

        cs[temp === 1 ? "long" : temp === -1 ? "short" : "process"](name +": "+ temp + "\n");

        resultSum += temp;
    }

    //THIS IS FOR THE NEW TA BRACKET
    // Data 0 -> length === oldest -> newest COMPLETE candle
    // closeData[closeData.length - 1] is the latest complete candle THIS IS THE STANDARD
    // let closeData = pairData.slice(0, pairData.length - 1);

    // taFuncs.bolingerbands(closeData.map(val => val[4]), 15, 2)
    //THIS IS FOR THE NEW TA BRACKET

    let finalResult = 0;
    if (resultSum === configIndicators.length)        finalResult = 1;
    if (resultSum === (-1 * configIndicators.length)) finalResult = -1;

    // TEST
    // finalResult = -1;
    // TEST

    if (Math.abs(finalResult) === 1) {
        let currentPrice = pairData[pairData.length - 1][4];
        let swingHighLow = taFuncs.swingHiLo(strat.options, [...pairData]);
        let averageTrueRange = taFuncs.atr(strat.options, [...pairData]);
        let curClose = parseFloat(pairData[pairData.length - 2][4]);

        let wallet = await getWalletTokens(strat.wallet.public);
        let usdEquity = wallet.usdc;
        // let usdEquity = 1000;

        let gmxAdjustmentUpper = strat.options.gmxLimitAdjustment;
        let gmxAdjustmentLower = 1 + (1 - strat.options.gmxLimitAdjustment);

        if (finalResult === 1) {
            cs.longH("LONG! LONG! LONG!");

            let longSL  = Math.min(curClose - averageTrueRange, swingHighLow.low);
            let longStopPercent = Math.abs((1 - (longSL / curClose)) * 100);
            let longTpPercent = longStopPercent * strat.options.profitFactor;
            let longTp = curClose + (curClose * (longTpPercent / 100));

            //Amt / Leverage calc
            // let levRatio = -0.0082;
            let riskCalc = calculateRiskQuantities(usdEquity, strat.options.percentageRiskedPerTrade, currentPrice, longSL, true)
            let longQty = riskCalc.amt;
            let lev = riskCalc.lev;
            //Amt / Leverage calc

            // Tighten limits for GMX's shit limits
            longSL = longSL * gmxAdjustmentLower;
            longTp = longTp * gmxAdjustmentUpper;

            cs.long("Long amt: " + longQty + " => " + truncateNum(longQty, 4));
            cs.long("Long lev: " + lev + " => " + truncateNum(lev, 4));
            cs.long("Long TP: " + longTp +  " => " + truncateNum(longTp, 4));
            cs.long("Long SL: " + longSL + " => " + truncateNum(longSL, 4));
            cs.long("curClose: " + curClose + " => " + truncateNum(curClose, 4));

            await openPosition(
                "long", 
                strat,
                truncateNum(longQty, 4), 
                truncateNum(longSL, 4), 
                truncateNum(longTp, 4),
                truncateNum(currentPrice, 4),
                truncateNum(lev, 4)
                );
        }
        if (finalResult === -1) {
            cs.shortH("SHORT! SHORT! SHORT!");
            
            let shortSL = Math.max(curClose + averageTrueRange, swingHighLow.high);
            let shortStopPercent = Math.abs((1 - (shortSL / curClose)) * 100);
            let shortTpPercent = shortStopPercent * strat.options.profitFactor;
            let shortTp = curClose - (curClose * (shortTpPercent / 100));
            
            //Amt / Leverage calc
            // let levRatio = -0.0082;
            let riskCalc = calculateRiskQuantities(usdEquity, strat.options.percentageRiskedPerTrade, currentPrice, shortSL, false)
            let shortQty = riskCalc.amt;
            let lev = riskCalc.lev;
            //Amt / Leverage calc

            // Tighten limits for GMX's shit limits
            shortSL = shortSL * gmxAdjustmentUpper;
            shortTp = shortTp * gmxAdjustmentLower;

            cs.short("Short amt: " + shortQty + " => " + truncateNum(shortQty, 4));
            cs.short("Short lev: " + lev + " => " + truncateNum(lev, 4));
            cs.short("Short TP: " + shortTp + " => " + truncateNum(shortTp, 4));
            cs.short("Short SL: " + shortSL + " => " + truncateNum(shortSL, 4));
            cs.short("curClose: " + curClose + " => " + truncateNum(curClose, 4));

            await openPosition(
                "short", 
                strat, 
                truncateNum(shortQty, 4), 
                truncateNum(shortSL, 4), 
                truncateNum(shortTp, 4),
                truncateNum(currentPrice, 4),
                truncateNum(lev, 4)
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

module.exports = main;