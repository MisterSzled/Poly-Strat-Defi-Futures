// Returns the sma for every possible entry with more than volLength behind it

function ema(candleData, volLength) {
    let result = [];
    candleData = candleData.map(val => parseFloat(val))
    let alpha = 2 / (volLength + 1);

    for (let i = volLength; i < candleData.length; i++) {
        let src = candleData[i];
        if (result.length !== 0) {
            sum1 = result[result.length - 1];
            sum0 = alpha * src + (1 - alpha) * sum1;

            result.push(sum0);
        } else {
            result.push(src);
        }
        
    }

    return result;
}

module.exports = ema;