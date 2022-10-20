// Returns the sma for every possible entry with more than volLength behind it

function sma(candleData, volLength) {
    let result = [];
    candleData = candleData.map(val => parseFloat(val))

    for (let i = volLength; i <= candleData.length; i++) {
        let temp = candleData.slice(i - volLength, i);
        result.push(temp.reduce((a, b) => a + b) / volLength);
    }

    return result;
}

module.exports = sma;