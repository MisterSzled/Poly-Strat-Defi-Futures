// Returns the cmo
const change = require("./change");

function cmo(candleData, volLength) {
    candleData = candleData.slice(0, candleData.length);

    let sm1 = 0;
    let sm2 = 0
    for (let i = 0; i < volLength; i++) {
        let mom = change(candleData.slice(0, candleData.length - i), 0);
        if (mom > 0) sm1 += mom;
        if (mom < 0) sm2 += mom; 
    }
    sm2 = Math.abs(sm2)

    return 100 * (sm1 - sm2) / (sm1 + sm2)
}

module.exports = cmo;