const axios = require("axios");

function getLatestRaw(pair) {
    return new Promise(resolve => {
        axios.get("https://api.binance.com/api/v3/ticker/price?symbol=" + pair)
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            console.log(err)
            resolve([])
        });
    });
};

module.exports = getLatestRaw;