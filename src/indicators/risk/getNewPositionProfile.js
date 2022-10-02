const taFuncs  = require("../taFuncs/index");
const getAdjustedLeverageAndAmount    = require("./getAdjustedLeverageAndAmount");
const cs = require("../../general/chalkSpec");
const truncateNum = require("../../general/truncateNum.js");

function getNewPositionProfile(options, wallet, pairData, isLong, currentPrice) {
    let swingHighLow = taFuncs.swingHiLo(options, [...pairData]);
    let averageTrueRange = taFuncs.atr(options, [...pairData]);
    let curClose = parseFloat(pairData[pairData.length - 2][4]);

    let gmxAdjustmentUpper = options.gmxLimitAdjustment;
    let gmxAdjustmentLower = 1 + (1 - options.gmxLimitAdjustment);

    if (isLong) {
        let longSL  = Math.min(curClose - averageTrueRange, swingHighLow.low);
        let longStopPercent = Math.abs((1 - (longSL / curClose)) * 100);
        let longTpPercent = longStopPercent * options.profitFactor;
        let longTp = curClose + (curClose * (longTpPercent / 100));

        let riskCalc = getAdjustedLeverageAndAmount(wallet, options.percentageRiskedPerTrade, currentPrice, longSL, true);

        let longQty = riskCalc.amt;
        let lev = riskCalc.lev;

        longSL = longSL * gmxAdjustmentLower;
        longTp = longTp * gmxAdjustmentUpper;

        cs.long("Long amt: " + longQty + " => " + truncateNum(longQty, 4));
        cs.long("Long lev: " + lev + " => " + truncateNum(lev, 4));
        cs.long("Long TP: " + longTp +  " => " + truncateNum(longTp, 4));
        cs.long("Long SL: " + longSL + " => " + truncateNum(longSL, 4));
        cs.long("curClose: " + curClose + " => " + truncateNum(curClose, 4));

        return {
            longQty: longQty,
            longSL:  longSL,
            longTp: longTp,
            curClose: curClose,
            lev: lev,
        }
    } else {
        let shortSL = Math.max(curClose + averageTrueRange, swingHighLow.high);
        let shortStopPercent = Math.abs((1 - (shortSL / curClose)) * 100);
        let shortTpPercent = shortStopPercent * options.profitFactor;
        let shortTp = curClose - (curClose * (shortTpPercent / 100));
        
        let riskCalc = getAdjustedLeverageAndAmount(wallet, options.percentageRiskedPerTrade, currentPrice, shortSL, false)
        let shortQty = riskCalc.amt;
        let lev = riskCalc.lev;

        // Tighten limits for GMX's shit limits
        shortSL = shortSL * gmxAdjustmentUpper;
        shortTp = shortTp * gmxAdjustmentLower;

        cs.short("Short amt: " + shortQty + " => " + truncateNum(shortQty, 4));
        cs.short("Short lev: " + lev + " => " + truncateNum(lev, 4));
        cs.short("Short TP: " + shortTp + " => " + truncateNum(shortTp, 4));
        cs.short("Short SL: " + shortSL + " => " + truncateNum(shortSL, 4));
        cs.short("curClose: " + curClose + " => " + truncateNum(curClose, 4));

        return {
            shortQty: shortQty,
            shortSL:  shortSL,
            shortTp: shortTp,
            curClose: curClose,
            lev: lev,
        }
    }
}

module.exports = getNewPositionProfile 