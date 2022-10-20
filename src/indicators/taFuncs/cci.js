// Returns the commodity channel index for the latest complete candle
const sma = require("./sma");

function Mean(arr, n) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum = sum + arr[i];
        }
           
        return sum / n;
}

function meanAbsDevtion(arr, n) {
        arr = arr.map(val => parseFloat(val))
        let absSum = 0;
           
        for (let i = 0; i < n; i++) {
            absSum = absSum + Math.abs(arr[i] - Mean(arr, n));
        }
       
        return absSum / n;
}

function getTypical(priceData) {
    return priceData.map(val => (parseFloat(val[2]) + parseFloat(val[3]) + parseFloat(val[4])) / 3);
}

function cci(candleData, volLength) {
    let typical = getTypical([...candleData]);
    let simple = sma([...typical].slice(0, typical.length - 1), volLength);

    typical = typical.slice(0, typical.length - 1);

    let absDeviation = [];

    for (let i = 0; i < volLength; i++) {
        let sum = 0.0
        for (let j = 0; j < volLength; j++) {
            let val = typical[typical.length - 1 - j - i];
            sum += Math.abs(val - simple[simple.length - 1 - i]);
        }
        absDeviation.push(sum/volLength);
    }

    let result = [];
    for (let i = 0; i < volLength; i++) {
        result.push((typical[typical.length - 1 - i] - simple[simple.length - 1 - i]) / (0.015 * absDeviation[absDeviation.length - 1 - i]))
    }

    return result
}

module.exports = cci;