const taFuncs = require("../../taFuncs/index");
const getAdjustedLeverageAndAmount = require ("../getAdjustedLeverageAndAmount");
const cs = require("../../../general/chalkSpec");
const truncateNum = require("../../../general/truncateNum");

function swingAndATR (options, wallet, pairData, isLong, currentPrice) {
    let swingHighLow = taFuncs.swingHiLo(options, [...pairData]);
    let averageTrueRange = taFuncs.atr(options, [...pairData]);
    let curClose = parseFloat(pairData[pairData.length - 2][4]);

    if (isLong) {
        let longSL  = Math.min(curClose - averageTrueRange, swingHighLow.low);
        let longStopPercent = Math.abs((1 - (longSL / curClose)) * 100);
        let longTpPercent = longStopPercent * options.profitFactor;
        let longTp = curClose + (curClose * (longTpPercent / 100));

        longSL = curClose - ((curClose - longSL) * options.riskFactor);

        let riskCalc = getAdjustedLeverageAndAmount(wallet, options.percentageRiskedPerTrade, currentPrice, longSL, true);

        let longQty = riskCalc.amt;
        let lev = riskCalc.lev;

        cs.long("Long amt: " + longQty + " => " + truncateNum(longQty, 4));
        cs.long("Long lev: " + lev + " => " + truncateNum(lev, 4));
        cs.long("Long TP: " + longTp +  " => " + truncateNum(longTp, 4));
        cs.long("Long SL: " + longSL + " => " + truncateNum(longSL, 4));
        cs.long("curClose: " + curClose + " => " + truncateNum(curClose, 4));

        return {
            dollarAmt: longQty,
            SL:       longSL,
            TP:       longTp,
            curClose: curClose,
            lev:      lev,
        }
    } else {
        let shortSL = Math.max(curClose + averageTrueRange, swingHighLow.high);
        let shortStopPercent = Math.abs((1 - (shortSL / curClose)) * 100);
        let shortTpPercent = shortStopPercent * options.profitFactor;
        let shortTp = curClose - (curClose * (shortTpPercent / 100));

        shortSL = curClose + ((shortSL - curClose) * options.riskFactor);

        let riskCalc = getAdjustedLeverageAndAmount(wallet, options.percentageRiskedPerTrade, currentPrice, shortSL, false);
        let shortQty = riskCalc.amt;
        let lev = riskCalc.lev;

        cs.short("Short amt: " + shortQty + " => " + truncateNum(shortQty, 4));
        cs.short("Short lev: " + lev + " => " + truncateNum(lev, 4));
        cs.short("Short TP: " + shortTp + " => " + truncateNum(shortTp, 4));
        cs.short("Short SL: " + shortSL + " => " + truncateNum(shortSL, 4));
        cs.short("curClose: " + curClose + " => " + truncateNum(curClose, 4));

        return {
            dollarAmt: shortQty,
            SL:       shortSL,
            TP:       shortTp,
            curClose: curClose,
            lev:      lev,
        }
    }
}

module.exports = swingAndATR;