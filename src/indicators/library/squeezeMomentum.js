const cs = require("../../general/chalkSpec");
const bolingerbands = require("../taFuncs/index").bolingerbands;
const sma = require("../taFuncs/index").sma;

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    /*
     * Calculate the sum for each of the parts necessary.
     */

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }


    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y];
}

function getKC(strat, priceSlice) {
    let averages = [];

    let startIndex = 100;
    for (let i = priceSlice.length - startIndex; i < priceSlice.length; i++) {
        let tempSlice = priceSlice.slice(i - strat.settings.kcLength + 1, i + 1);
        let highest   = Math.max(...(tempSlice.map(val => parseFloat(val[2]))));
        let lowest    = Math.min(...(tempSlice.map(val => parseFloat(val[3]))));

        let tempMA    = sma([...tempSlice].map(val => parseFloat(val[4])), strat.settings.kcLength);
        let av = (((highest + lowest)/2) + tempMA[tempMA.length - 1]) / 2;

        averages.push(parseFloat(priceSlice[i][4]) - av);
    }

    let avSlice    = averages.slice(averages.length - strat.settings.kcLength, averages.length + 1);
    let countSlice = [...avSlice].map((_,i) => i);

    let linReq = findLineByLeastSquares(countSlice, avSlice);

    return linReq[1];
}

function squeezeMomentum(strat, candleData) {
    cs.header("Squeeze Momentum");
    let priceSlice = [...candleData.slice(0, candleData.length - 1)];

    // let bb = bolingerbands(priceSlice.map(val => parseFloat(val[4])), strat.settings.bbLength, strat.settings.bbMultiplier);

    let ma      = sma([...priceSlice].map(val => parseFloat(val[4])), strat.settings.kcLength);
    let rangema = sma([...priceSlice].map(val => parseFloat(val[2]) - parseFloat(val[3])), strat.settings.kcLength);

    let upperKC = ma[ma.length - 1] + rangema[rangema.length - 1] * strat.settings.kcMultiplier;
    let lowerKC = ma[ma.length - 1] - rangema[rangema.length - 1] * strat.settings.kcMultiplier;
    // let sqzOn  = (bb.LOW > lowerKC) && (bb.HI < upperKC);
    // let sqzOff = (bb.LOW < lowerKC) && (bb.HI > upperKC);
    // let noSqz  = (sqzOn === false)  && (sqzOff === false);

    let linReqKC = getKC(strat, [...priceSlice]);

    let result0 = linReqKC[linReqKC.length - 1] > 0 ? 1 : -1;
    let result1 = linReqKC[linReqKC.length - 2] > 0 ? 1 : -1;
    let comparedRes = 0;
    
    if (result0 === 1  && result1 === -1) comparedRes = 1;
    if (result0 === -1 && result1 === 1)  comparedRes = -1;

    cs.process("Upper KC: " + upperKC);
    cs.process("Lower KC: " + lowerKC);

    if (strat.settings.reportChangeInMomentum) {
        cs[comparedRes === 1 ? "win" : comparedRes === -1 ? "fail" : "process"]("Squeeze Direction Change: " + comparedRes)
        return comparedRes
    } else {
        cs[result0 === 1 ? "win" : "fail"]("Squeeze Direction: " + linReqKC[linReqKC.length - 1]);
        result0
    }

    return result0;
}

module.exports = squeezeMomentum;