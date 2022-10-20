const cs = require("../../general/chalkSpec");

function avAndSmooth(strat, bears, bulls) {
    let avBears = [];
    let avBulls = [];
    for (let i = strat.settings.evalPeriod - 1; i <= bears.length; i++) {
        if (avBears.length < strat.settings.evalPeriod) {
            avBears.push(bears[i]);
            avBulls.push(bulls[i]);
        } else {
            let bearSlice = bears.slice(i - strat.settings.evalPeriod, i);
            avBears.push((bearSlice.reduce((a,b) => (a+b))) / bearSlice.length);

            let bullSlice = bulls.slice(i - strat.settings.evalPeriod, i);
            avBulls.push((bullSlice.reduce((a,b) => (a+b))) / bullSlice.length);
        }
    }

    let smoothBears = [];
    let smoothBulls = [];
    for (let i = strat.settings.smoothingPeriod - 1; i <= avBears.length; i++) {
        if (smoothBears.length < strat.settings.smoothingPeriod) {
            smoothBears.push(avBears[i]);
            smoothBulls.push(avBulls[i]);
        } else {
            let bearSlice = avBears.slice(i - strat.settings.smoothingPeriod, i);
            smoothBears.push((bearSlice.reduce((a,b) => (a+b))) / bearSlice.length);

            let bullSlice = avBulls.slice(i - strat.settings.smoothingPeriod, i);
            smoothBulls.push((bullSlice.reduce((a,b) => (a+b))) / bullSlice.length);
        }
    }

    return {
        bull: smoothBulls[smoothBulls.length - 1],
        bear: smoothBears[smoothBulls.length - 1]
    }
}

function getRSIPair(strat, candleData) {
    let bears = [];
    let bulls = [];
    for (let i = candleData.length - 100; i < candleData.length; i++) {
        let tempBull = 0.5 * (Math.abs(candleData[i][4] - candleData[i - 1][4]) + (candleData[i][4] - candleData[i - 1][4]));
        let tempBear = 0.5 * (Math.abs(candleData[i][4] - candleData[i - 1][4]) - (candleData[i][4] - candleData[i - 1][4]));

        bears.push(tempBear);
        bulls.push(tempBull);
    }

    return avAndSmooth(strat, bears, bulls);
}

function getStochastic(strat, candleData) {
    let bears = [];
    let bulls = [];
    for (let i = candleData.length - 100; i < candleData.length; i++) {
        let localSlice = candleData.slice(i - strat.settings.evalPeriod + 1, i + 1);
        let min = Math.min(...localSlice.map(val => parseFloat(val[4])));
        let max = Math.max(...localSlice.map(val => parseFloat(val[4])));

        bulls.push(candleData[i][4] - min);
        bears.push(max - candleData[i][4]);
    }

    return avAndSmooth(strat, bears, bulls);
}

function getADXPair(strat, candleData) {
    let bears = [];
    let bulls = [];
    for (let i = candleData.length - 100; i < candleData.length; i++) {
        let tempBull = 0.5 * (Math.abs(candleData[i][2] - candleData[i - 1][2]) + (candleData[i][2] - candleData[i - 1][2]));
        let tempBear = 0.5 * (Math.abs(candleData[i][3] - candleData[i - 1][3]) - (candleData[i][3] - candleData[i - 1][3]));

        bears.push(tempBear);
        bulls.push(tempBull);
    }

    return avAndSmooth(strat, bears, bulls);
}

function absoluteStrengthHistogram(strat, candleData) {
    cs.header("ABS Histogram");

    candleData = candleData.slice(0, candleData.length - 1);

    let price1 = candleData[candleData.length - 1][4];
    let price2 = candleData[candleData.length - 2][4];

    let bull, bear;

    if (strat.settings.method === "RSI") {
        let rsiPair = getRSIPair(strat, [...candleData]);
        bull = rsiPair.bull;
        bear = rsiPair.bear;
    }
    if (strat.settings.method === "STOCHASTIC") {
        let stochasticPair = getStochastic(strat, [...candleData]);
        bull = stochasticPair.bull;
        bear = stochasticPair.bear;
    }
    if (strat.settings.method === "ADX") {
        let adxPair = getADXPair(strat, [...candleData]);
        bull = adxPair.bull;
        bear = adxPair.bear;
    }

    let res = bull > bear;

    cs.process("Smooth Bull: " + bull)
    cs.process("Smooth Bear: " + bear)

    return res ? 1 : -1
}

module.exports = absoluteStrengthHistogram;