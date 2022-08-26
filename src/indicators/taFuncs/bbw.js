// Returns the true range for the latest complete candle
const bolingerbands = require("./stdev");

function bbw(candleData, volLength, multi) {
    let bands = bolingerbands(candleData, volLength, multi);
    let result = [];

    return result;
}

module.exports = bbw;

// NOTDONE
// NOTDONE
// NOTDONE
// NOTDONE
// NOTDONE
// NOTDONE
// NOTDONE