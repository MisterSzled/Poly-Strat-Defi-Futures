const getGMXcontract = require("./getGMXcontract");
const getGMXPositions = require("./getGMXPositions");
const ethers = require('ethers');
const estimateGas = require("../estimateGas");

let tokens = {
    "AVAXUSDT": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //avax
    "ETHUSDT":  "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", //weth
    "BTCUSDT":  "0x50b7545627a5162F82A992c33b87aDc75187B218", //wbtc
}

async function closePosition(strat, curPrice) {
    let gmx          = await getGMXcontract(strat.wallet.priv);
    let tokenAddy = tokens[strat.token];

    let posInfo = await getGMXPositions(strat.wallet.public, tokenAddy);
    let delta = 0;
    let openType; 
    let tokenPath = [];

    if (parseInt(posInfo["short"]) === 0) {
        delta = posInfo["long"];
        openType = true;
        tokenPath = [tokenAddy]
    } else {
        delta = posInfo["short"];
        openType = false;
        tokenPath = ["0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"];
    }

    let acceptable = curPrice * (
        openType ? 0.995 : 1.005);

    acceptable = ethers.utils.parseUnits(`${acceptable}`, 30);

    let closePositionRequest = await gmx["createDecreasePosition"](
        tokenPath,                                                            //-path
        tokenAddy,                                                            //-indexToken
        "0",                                                                    //-collateralDelta
        delta,                                                                //-sizedelta
        openType,                                                             //-openType
        strat.wallet.public,                                                 //-receiver (you)
        acceptable,                                                           //-acceptable price
        "0",                                                                    //-minout
        "20000000000000000",                                                    //-exceutionFee
        false,
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
            value: ethers.utils.parseEther(`${0.02}`)
        }
    );
    let closePositionResp = await closePositionRequest.wait();

    return;
}

module.exports = closePosition;