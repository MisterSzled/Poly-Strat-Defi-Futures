const cs = require("../../general/chalkSpec");

function absoluteStrengthHistogram(strat, candleData) {
    cs.header("ABS Histogram");

    let price1 = candleData[candleData.length - 2][4];
    let price2 = candleData[candleData.length - 3][4];

    if (strat.settings.method === "RSI") {
        let bulls0 = 0.5 * (math.abs(price1 - price2) +  price1 - price2);
        let bears0 = 0.5 * (math.abs(price1 - price2) - (price1 - price2));
    }
    if (strat.settings.method === "STOCHASTIC") {
        let highest = getHighest([...candleData], strat.settings.evalPeriod);

        let bulls1 = price1 - ta.lowest(price1, ashLength);
        let bears1 = highest - price1;
    }
    if (strat.settings.method === "ADX") {
        let high0 = candleData[candleData.length - 2][2];
        let high1 = candleData[candleData.length - 3][2];

        let low0 = candleData[candleData.length - 2][3];
        let low1 = candleData[candleData.length - 3][3];

        let bulls2 = 0.5 * (Math.abs(high0 - high1) + high0 - high1);
        let bears2 = 0.5 * (Math.abs(low1 - low0) + low1 - low0);
    }

    console.log(sma0[sma0.length - 1])
}

module.exports = absoluteStrengthHistogram;