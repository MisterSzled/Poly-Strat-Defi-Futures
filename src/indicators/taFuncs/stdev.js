// Returns the stdDeviation for every possible entry with more than volLength behind it

function stdev(candleData, volLength) {
    let result = [];
    candleData = candleData.map(val => parseFloat(val));

    for (let i = volLength; i <= candleData.length; i ++) {
        let temp = candleData.slice(i - volLength, i);

        const n = volLength
        const mean = temp.reduce((a, b) => a + b) / n

        result.push(Math.sqrt(temp.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n))
    }

    return result;
}

module.exports = stdev;