const cs = require("../../general/chalkSpec");

function getStandardDeviation(strat, candleData) {

    let volCandles = candleData.slice(1, strat.settings.volLength + 1);
    volCandles = volCandles.map(val => parseFloat(val[4]) - parseFloat(val[1]));

    let n = strat.settings.volLength
    let mean = volCandles.reduce((a, b) => a + b) / n
    return Math.sqrt(volCandles.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function volatilityOscillator(strat, candleData) {
    candleData.reverse();

    let x = getStandardDeviation(strat, [...candleData]);
    let y = x * -1;

    let spike = candleData[1][4] - candleData[1][1];
    let result = (spike > x) ? 1 : (spike < y) ? -1 : 0;

    cs.header("Volatility Oscillator");
    cs.process("X: " + x);
    cs.process("y: " + y);
    cs.process("Spike: " + spike);

    return result;
}

module.exports = volatilityOscillator;