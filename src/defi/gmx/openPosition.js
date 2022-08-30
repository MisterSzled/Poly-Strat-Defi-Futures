const getGMXcontract = require("./getGMXcontract");
const getGMXOrderbook = require("./getGMXOrderbook");
const getGMXReader = require("./getGMXReader");
const truncateNum = require("../../general/truncateNum");
const estimateGas = require("../estimateGas");
const cs = require("../../general/chalkSpec")
const ethers = require('ethers');
const sleep = require("../../general/sleep");
const getGMXPositions = require("./getGMXPositions");

let tokens = {
    // Avax
    "AVAXUSDT": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //avax
    "ETHUSDT":  "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", //weth
    "BTCUSDT":  "0x50b7545627a5162F82A992c33b87aDc75187B218", //wbtc

    //Arbitrum
}

const positionOpenCloseCost = 0.966;

async function openPosition(type, strat, amountIn, SL, TP, curPrice, leverage) {

    console.log("type: ", type);
    console.log("amountIn: ", amountIn);
    console.log("SL: ", SL);
    console.log("TP: ", TP);
    console.log("curPrice: ", curPrice);
    console.log("leverage: ", leverage);

    let tokenAddy = tokens[strat.token];

    // Check existing positions
    let curPosInfo = await getGMXPositions(strat.wallet.public, tokenAddy);

    //if existing position is the same short/long do nothing
    if (parseInt(curPosInfo[type]) !== 0) {
        cs.win("Position is already: " + type);

        return;
    }

    //if no positions openNewPosition
    if (
        (parseInt(curPosInfo[type]) === 0) && 
        (parseInt(curPosInfo[type === "long" ? "short" : "long"]) === 0)
    ) {
        cs.process("No existing positions opening " + type);
        await openNewPosition(type, strat, amountIn, SL, TP, curPrice, leverage);

        return;
    }

    //if existing position is opposite THEN: CLOSE pos and limits, THEN openNew
    if (
        (parseInt(curPosInfo[type === "long" ? "short" : "long"]) !== 0)
    ) {
        cs.process("Existing position of other type closing");

        if (strat.options.useLimitOrders) {
            cs.process("Closing orders");
            await closeOrders(strat);
        }

        cs.process("Closing position");
        await closePosition(strat, curPrice);

        await sleep(2000*60);

        await openNewPosition(type, strat, amountIn, SL, TP, curPrice, leverage);

        return;
    }
}

async function closeOrders(strat) {
    let gmxOrderbook = await getGMXOrderbook(strat.wallet.priv);

    let orderIndex = await gmxOrderbook["decreaseOrdersIndex"](
        strat.wallet.public,   //addy
    );

    let cancelOne = await gmxOrderbook["cancelDecreaseOrder"](
        orderIndex - 1,
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
        }
    );
    let cancelOneResp = await cancelOne.wait();

    let cancelTwo = await gmxOrderbook["cancelDecreaseOrder"](
        orderIndex - 2,
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
        }
    );
    let cancelTwoResp = await cancelTwo.wait();

    return;
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

async function openNewPosition(type, strat, amountIn, SL, TP, curPrice, leverage) {
    let gmx          = await getGMXcontract(strat.wallet.priv);
    let gmxReader    = await getGMXReader(strat.wallet.priv);
    let gmxOrderbook = await getGMXOrderbook(strat.wallet.priv);

    let tokenAddy = tokens[strat.token];

    let delta = truncateNum(amountIn * leverage * positionOpenCloseCost, 4);
    let acceptable = curPrice * (
        type === "long" ? 1.005 : 
        type === "short" ? 0.995 : 
        0);

    amountIn = ethers.utils.parseUnits(`${amountIn}`, 6);
    delta = ethers.utils.parseUnits(`${delta}`, 30);
    acceptable = ethers.utils.parseUnits(`${acceptable}`, 30);

    SL = ethers.utils.parseUnits(`${SL}`, 30);;
    TP = ethers.utils.parseUnits(`${TP}`, 30);;
    type = type === "long";

    let tokenPath = ["0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"];
    if (type) {
        tokenPath.push(tokenAddy);
    }

    let openPositionRequest = await gmx["createIncreasePosition"](
        tokenPath,                                                            //path always from USDC
        tokenAddy,                                                            //indexToken
        amountIn,                                                             //amountIn
        0,                                                                    //minOut
        delta,                                                                //sizeDelta
        type,                                                                 //isLong
        acceptable,                                                           //acceptablePrice
        "20000000000000000",                                                  //executionFee
        "0x0000000000000000000000000000000000000000000000000000000000000000", //_referralCode
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
            value: ethers.utils.parseEther(`${0.02}`)
        }
    );
    let openPositionResp = await openPositionRequest.wait();

    cs.win("Position opened");

    await sleep(500*60);
    if (strat.options.useLimitOrders) {
        cs.process("Setting limits");

        let positions = await gmxReader["getPositions"](
            "0x9ab2De34A33fB459b538c43f251eB825645e8595",   //vault
            strat.wallet.public,   //addy
            [
                type ? tokenAddy : "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
            ], //collateralTokens tokens you've given? 
            [
                tokenAddy,                                  //indexTokens tokens you are in a pos of?
            ], 
            [type]                                          //isLong
        );
        let resultDelta = positions[0];

        if (parseInt(resultDelta) === 0) {
            cs.fail("Position doesn't exist");
            return;
        }
    
        let SLTriggerAbove = !type;
        let TPTriggerAbove = type;

        let createSL = await gmxOrderbook["createDecreaseOrder"](
            tokenAddy,
            resultDelta,
            "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            0,
            type,
            SL,
            SLTriggerAbove,
            {
                gasPrice: await estimateGas(1), 
                gasLimit: 450000,
                value: ethers.utils.parseEther(`${0.0101}`)
            }
        );
        let createSLResp = await createSL.wait();

        cs.win("SL set");

        let createTP = await gmxOrderbook["createDecreaseOrder"](
            tokenAddy,
            resultDelta,
            "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            0,
            type,
            TP,
            TPTriggerAbove,
            {
                gasPrice: await estimateGas(1), 
                gasLimit: 450000,
                value: ethers.utils.parseEther(`${0.0101}`)
            }
        );
        let createTPResp = await createSL.wait();

        cs.win("TP set");
    }
}

module.exports = openPosition