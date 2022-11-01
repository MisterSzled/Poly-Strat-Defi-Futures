// Returns the true range for the latest complete candle
const stdev = require("./stdev");
const sma = require("./sma");

function bolingerbands(candleData, volLength, multi) {
    let stdDev = stdev([...candleData], volLength);
    stdDev = stdDev.map(val => val * multi);

    let avg = sma([...candleData], volLength);

    let result = [];
    for (let i = 0 ; i < stdDev.length; i++) {
        result.push({
            HI: avg[i] + stdDev[i],
            MI: avg[i],
            LO: avg[i] - stdDev[i],
        })
    }

    // console.log("MID: ", result[result.length - 1].MI)
    // console.log("HI: ", result[result.length - 1].HI)
    // console.log("LO: ", result[result.length - 1].LO)

    return result;
}

module.exports = bolingerbands;