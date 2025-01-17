const axios = require("axios");

function getPairData(pair, timeframe, maxLookBack) {
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(resolve, 30000, 'one');
    });

    const promise2 = new Promise(resolve => {
        axios.get("https://api.binance.com/api/v3/klines?symbol=" + pair + "&interval=" + timeframe + "&limit=" + (maxLookBack+4))
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            console.log(err)
            resolve([])
        });
    });

    return Promise.race([promise1, promise2])
};

/**
 * Array of numbers for each candle in order
 * 
 * 0: Open Time
 * 1: OPEN
 * 2: HIGH
 * 3: LOW
 * 4: CLOSE
 * 5: VOLUME
 * 6: Close time
 * 7: Quote Asset volume 
 * 
 */

module.exports = getPairData;