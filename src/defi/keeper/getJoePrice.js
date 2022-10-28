const getExchangeContract = require("../getExchangeContract");
let tokenInfo = {
    "avax":  {addy: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", scale: 10**18},
    "usdc":  {addy: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", scale: 10**6},
    "weth":  {addy: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", scale: 10**18},
    "wavax": {addy: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", scale: 10**18},
    "wbtc":  {addy: "0x50b7545627a5162F82A992c33b87aDc75187B218", scale: 10**8},
};

async function getTokenPrice (exchange, amount, tokenA, tokenB) {
    try {
        let result = await exchange["getAmountsOut"](
            amount,
            [tokenA, tokenB]
        );
        return result[1];
    } catch (error) {
        console.log("Shit's fucked yo");
        return 0;
    }
}

async function getJoePrice (tokenIn, amtIn, tokenOut) {
    let joeExchange = await getExchangeContract();

    return await getTokenPrice(
        joeExchange,
        amtIn,
        tokenInfo[tokenIn].addy,
        tokenInfo[tokenOut].addy,
    );
}

module.exports = getJoePrice;