const getExchangeContract = require("../getExchangeContract");
const estimateGas = require("../estimateGas");
const cs = require("../../general/chalkSpec");

let tokenInfo = {
    "avax":  {addy: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", scale: 10**18},
    "usdc":  {addy: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", scale: 10**6},
    "weth":  {addy: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", scale: 10**18},
    "wbtc":  {addy: "0x50b7545627a5162F82A992c33b87aDc75187B218", scale: 10**8},
};

let callLookup = {
    "AVAX": "swapExactTokensForTokens",
    "ARBITRUM": "swapExactTokensForTokens",
};

async function swapExactTokensForTokens (wallet, tokenIn, amtIn, amtOut) {
    let joeExchange = await getExchangeContract(wallet.priv);

    cs.process(tokenIn + " ==> $$$$")

    let swapRequestRequest = await joeExchange[callLookup[global.chain]](
        amtIn,                                                                //-amtIn
        amtOut,                                                               //-amtOut
        [
            tokenInfo[tokenIn].addy,
            "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E" //USDC
        ],                                                                    //-path
        wallet.public,                                                        //-toWHO
        new Date().valueOf() + 300000,                                        //-deadLine
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
        }
    );
    let swapResp = await swapRequestRequest.wait();
    cs.win("Done")
}

module.exports = swapExactTokensForTokens