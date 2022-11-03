const taFuncs  = require("../taFuncs/index");
const getAdjustedLeverageAndAmount    = require("./getAdjustedLeverageAndAmount");
const cs = require("../../general/chalkSpec");
const truncateNum = require("../../general/truncateNum.js");
const positionCalculators = require("./positionCalculators/index");

function getNewPositionProfile(options, wallet, pairData, isLong, currentPrice) {
    // If not pricerName selected use swingAndATR
    if (!options.pricerName) {
        options.pricerName = "swingAndATR"
    } 

    // Obtain function from pricerMethod lists and call to get info
    let pricerMethod = positionCalculators[options.pricerName];
    let positionInfo = pricerMethod(options, wallet, pairData, isLong, currentPrice);

    // Return it
    return {
        dollarAmt: positionInfo.dollarAmt,
        SL:       positionInfo.SL,
        TP:       positionInfo.TP,
        curClose: positionInfo.curClose,
        lev:      positionInfo.lev,
    }
}

module.exports = getNewPositionProfile 