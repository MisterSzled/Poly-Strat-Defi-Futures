const cs = require("../../general/chalkSpec");
const universal = require("../../../config").universal;

function getMA(strat, candleData) {
    if (strat.settings.hullVariation === "HMA") {
        return getHMA(strat, candleData);
    } else if (strat.settings.hullVariation === "EHMA") {
        //getEHMA here
    } else if (strat.settings.hullVariation === "THMA") {
        //getTHMA here
    }
}

function getHMA(strat, candleData) {
    candleData.reverse();
    let multiedLength = strat.settings.length * strat.settings.lengthMultiplier

    let hmaP3 = [];
    for (let i = 1; i < universal.maxLookBack - strat.settings.length; i++) {
        let WMABracket = candleData.slice(i, multiedLength + i);
        WMABracket = WMABracket.map(val => parseFloat(val[4]));

        let norm = 0;
        let sum = 0;
        let norm2 = 0;
        let sum2  = 0;
        let divLength = WMABracket.length / 2
        for (let j = 0; j < WMABracket.length; j++) {
            // wma * 2
            if (j < divLength) {
                let weight = (divLength - j) * divLength
                norm = norm + weight
                sum = sum + WMABracket[j] * weight
            }
            // wma
            let weight2 = (WMABracket.length - j) * WMABracket.length
            norm2 = norm2 + weight2
            sum2 = sum2 + WMABracket[j] * weight2
        }
        hmaP3.push(((sum/norm) * 2) - sum2/norm2);
    }

    // let hmaP3 = hmaP1.map((_, i) => hmaP1[i] - hmaP2[i]);

    let results = [];
    let rootLength = Math.round(Math.sqrt(multiedLength));
    for (let i = 0; i < 5; i++) {
        let WMABracket = hmaP3.slice(i, multiedLength + i);

        let norm = 0;
        let sum = 0;
        for (let j = 0; j < rootLength; j++) {
            let weight = (rootLength - j) * rootLength
            norm = norm + weight
            sum = sum + WMABracket[j] * weight
        }

        results.push(sum/norm);
    }

    return results;
}

let prevAns = {};
/**
 * Calculates the hull moving average and returns long or short when the current candle is polar to the penultimate one and the current close
 * @param  {[string]}  source           "close"/"open" which price point from the candle to work from
 * @param  {[string]}  hullVariation    "HMA"/"THMA"/"EHMA" which moving average variation to work from
 * @param  {[int]}     length           lookback length for MA calculations 
 * @param  {[float]}   lengthMultiplier multiple length by multiplier 
 * @param  {[boolean]} useHtf           if this indicator should call for a specific timeframe to operate from - default is strat default
 * @param  {[string]}  higherTimeframe  "1m"/"5m"/"2h" etc - timeframe to use if useHtf is true
 * @return {[int]}                      1,0,-1 if indicator directs long, nill, short   
 */
function mhull(strat, candleData) {
    cs.header("MHULL");

    if (!prevAns[strat.settings.length * strat.settings.lengthMultiplier]) {
        prevAns[strat.settings.length * strat.settings.lengthMultiplier] = {}
    }
    
    let MHULL;
    let SHULL;

    let prevAnsNow = prevAns[strat.settings.length * strat.settings.lengthMultiplier][candleData[candleData.length - 1][0]];
    if (typeof(prevAnsNow) === "number") {
        cs.process("MHULL prev: " + prevAnsNow);
        return prevAnsNow
    }

    let MA;
    if (strat.settings.useHtf) {
        // Deliver the htf candle data
        // MA = getMA(strat, HTF_CANDLE_DATA);
    } else {
        MA = getMA(strat, [...candleData]);
    }

    MHULL = MA[0];
    SHULL = MA[2]; //Could have a custom var here to decide the amount to lookback
    curClose = candleData[candleData.length - 2][4];

    cs.process("MHULL: " + MHULL);
    cs.process("SHULL: " + SHULL);


    if ((MHULL > SHULL) && (curClose > MHULL)) {
        prevAns[strat.settings.length * strat.settings.lengthMultiplier][candleData[candleData.length - 1][0]] = 1
        return 1;
    } 
    if ((MHULL < SHULL) && (curClose < SHULL)) {
        prevAns[strat.settings.length * strat.settings.lengthMultiplier][candleData[candleData.length - 1][0]] = -1
        return -1
    }
    prevAns[strat.settings.length * strat.settings.lengthMultiplier][candleData[candleData.length - 1][0]] = 0
    return 0;
}

module.exports = mhull;