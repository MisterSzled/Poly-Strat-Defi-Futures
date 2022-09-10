// Returns the difference between the latest entry close and the open from len bars ago

function change(candleData, len) {
    candleData = candleData.slice(0, candleData.length - 1);
    return candleData[candleData.length - 1][4] - candleData[candleData.length - 1 - len][1]
}

module.exports = change;