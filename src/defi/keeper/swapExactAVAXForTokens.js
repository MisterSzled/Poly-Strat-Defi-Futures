const getExchangeContract = require("../getExchangeContract");
const estimateGas = require("../estimateGas");
const cs = require("../../general/chalkSpec");

let callLookup = {
    "AVAX": "swapExactAVAXForTokens",
    "ARBITRUM": "swapExactETHForTokens",
}

async function swapExactAVAXForTokens(wallet, amtIn, amtOut) {
    let joeExchange = await getExchangeContract(wallet.priv);

    cs.process("avax ==> $$$$")
    let swapRequestRequest = await joeExchange[callLookup[global.chain]](
        amtOut,                                                               //-amtOut
        [
            "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //WAVAX
            "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E" //USDC
        ],                                                                    //-path
        wallet.public,                                                        //-toWHO
        new Date().valueOf() + 300000,                                        //-deadLine
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
            value: amtIn, 
        }
    );
    let swapResp = await swapRequestRequest.wait();
    cs.win("Done")
}

module.exports = swapExactAVAXForTokens