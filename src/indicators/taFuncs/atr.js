// Returns the true range for the latest complete candle

function getTrueRange(candleData) {
    let trueRange = [];
    candleData.reverse();

    for (let i = candleData.length - 2; i > 0; i--) {
        let high0  = candleData[i][2];
        let low0   = candleData[i][3];
        let close1 = candleData[i + 1][4];

        let a = Math.abs(low0 - close1);
        let b = Math.max(high0 - low0, Math.abs(high0 - close1))
        
        let trueRangeAtI = 
                Math.max(
                    a, 
                    b
                );
        
        trueRange.push(trueRangeAtI);
    }

    trueRange.reverse();

    return trueRange;
}


// This is RMA william blaus rsi ema 
function getTrueRangeEMA(atrLength, trueRange) {
    trueRange.reverse();

    let alpha = 1 / atrLength;
    let result = [trueRange[0]];

    for (let i = 1; i < trueRange.length; i++) {
        result.push(trueRange[i] * alpha + result[i - 1] * (1 - alpha));
    }
    return result;
}

function atr(strat, candleData) {
    let trueRange = getTrueRange([...candleData]);
    let trueRangeEMA = getTrueRangeEMA(strat.atrLength, [...trueRange]);

    return trueRangeEMA[trueRangeEMA.length - 1];
}

module.exports = atr;