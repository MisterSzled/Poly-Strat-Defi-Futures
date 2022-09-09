// Returns the true range for the latest complete candle
const bolingerbands = require("./bolingerbands");

function bbw(candleData, volLength, multi) {
    let bands = bolingerbands(candleData, volLength, multi);
    let result = bands.map(val => ((val.HI - val.LO) / val.MI));

    return result;
}

module.exports = bbw;