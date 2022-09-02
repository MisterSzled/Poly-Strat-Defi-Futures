function swingHiLo(strat, candleData) {
    candleData.reverse();
    candleData = candleData.slice(1, strat.swingHighLowLookbackLength + 1);

    let highs = candleData.map(val => parseFloat(val[2]));
    let lows  = candleData.map(val => parseFloat(val[3]));

    return {
        high: Math.max(...highs),
        low: Math.min(...lows)
    }
}

module.exports = swingHiLo;