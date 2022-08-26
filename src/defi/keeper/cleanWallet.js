const cs = require("../../general/chalkSpec");
const sleep = require("../../general/sleep");
const getWalletTokens = require("../getWalletTokens");
const getJoePrice = require("./getJoePrice");
const swapExactTokensForTokens = require("./swapExactTokensForTokens");
const swapExactAVAXForTokens = require("./swapExactAVAXForTokens");
const swapExactTokensForAVAX = require("./swapExactTokensForAVAX");
const getGMXOrderbook = require("../getGMXOrderbook");
const getGMXOrderbookReader = require("../getGMXOrderbookReader");
const cancelDecreaseOrder = require("../cancelDecreaseOrder");

const avaxUpperLimit = 1.5;
const avaxLowerLimit = 0.5;
const dollarsIntoAvax = 10;

async function cleanWallet(wallet) {
    let curWallet = await getWalletTokens(wallet.public, true);
    let swapArray = [];

    // Swap all eth to USDC
    if ((parseFloat(curWallet["weth"]) / 10**18) > 0) {
        cs.fail("ETH");
        let temp = {token: "weth"};
        temp.amtIn = curWallet["weth"];
        temp.amtOut = await getJoePrice("weth", curWallet["weth"], "usdc");
        swapArray.push(temp);
    } else {
        cs.win("ETH clean");
    }

    // Swap all btc to USDC
    if ((parseFloat(curWallet["wbtc"]) / 10**18) > 0) {
        cs.fail("BTC");
        let temp = {token: "wbtc"};
        temp.amtIn = curWallet["wbtc"];
        temp.amtOut = await getJoePrice("wbtc", curWallet["wbtc"], "usdc");
        swapArray.push(temp);
    } else {
        cs.win("BTC clean");
    }

    // Swap all avax > 1 if you have more than avaxUpperLimit
    if ((parseFloat(curWallet["avax"]) / 10**18) > avaxUpperLimit) {
        cs.fail("AVAX+");
        let temp = {token: "avax"};
        temp.amtIn = "0x" + (curWallet["avax"] - (10**18)).toString(16);

        temp.amtOut = await getJoePrice("avax", temp.amtIn, "usdc");
        swapArray.push(temp);
    } else {
        cs.win("AVAX+ clean");
    }

    for (let i = 0; i < swapArray.length; i++) {
        cs.process("Cleaning " + swapArray[i].token + " amtIn: " + swapArray[i].amtIn)
        if (swapArray[i].token === "avax") {
            try {
                await swapExactAVAXForTokens(wallet, swapArray[i].amtIn, swapArray[i].amtOut);
                await sleep(1000*10);
            } catch (error) {
                cs.fail("Failure at swapExactAVAXForTokens");
            }
        } else {
            try {
                await swapExactTokensForTokens(wallet, swapArray[i].token, swapArray[i].amtIn, swapArray[i].amtOut);
                await sleep(1000*10);
            } catch (error) {
                cs.fail("Failure at swapExactTokensForTokens from: " + swapArray[i].token);
            }
        }
    }

    // //if avax < 0.5 convert usdc to avax
    if ((parseFloat(curWallet["avax"]) / 10**18) < avaxLowerLimit) {
        cs.fail("AVAX -");

        let amtIn = "0x" + (dollarsIntoAvax * (10**6)).toString(16);
        let amtOut = await getJoePrice("usdc", amtIn, "avax");
        
        try {
            await swapExactTokensForAVAX(wallet, "usdc", amtIn, amtOut);
            await sleep(1000*10);
        } catch (error) {
            cs.fail("Failure at swapExactTokensForAVAX");
        }
    } else {
        cs.win("AVAX- clean");
    }

    //Check Orders of each type
    let GMXOrderbook = await getGMXOrderbook();
    let GMXOrderbookReader = await getGMXOrderbookReader();

    let orderIndex = await GMXOrderbook["decreaseOrdersIndex"](
        wallet.public,   //addy
    );
    orderIndex = parseInt(orderIndex);

    if (orderIndex > 5) {
        let orderIndexes = [];
        for (let i = orderIndex - 1; i > orderIndex - 11; i--) {
            orderIndexes.push(i);
        }
    
        let decreaseOrders = await GMXOrderbookReader["getDecreaseOrders"](
            "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
            wallet.public,
            orderIndexes
        );
        let orderInfo = [];
        for (let i = 0; i < decreaseOrders[0].length / 5; i++) {
            let temp = [];
            temp.push(orderIndex - 1 - i);
            temp.push(decreaseOrders[0].slice(i*5, (i*5) + 5));
            temp.push(decreaseOrders[1].slice((i*2), (i*2) + 2))
            orderInfo.push(temp.flat());
        }
    
        //IndexNumber
        //???
        //Size
        //isLong
        //Trigger Price
        //??
        //PathFrom
        //PathTo
    
        cs.process("Checking orders");
        for (let i = 0; i < orderInfo.length; i++) {
            let iPath = parseInt(orderInfo[i][6]);
            if (iPath === 0) continue;
    
            let check = -1;
            for (let j = 0; j < orderInfo.length; j++) {
                if (i === j) continue;
                if (orderInfo[i][6] === orderInfo[j][6]) check = j;
            }
    
            if (check === -1) {
                // Kill the order at i
                cs.process("Lone order - " + orderInfo[i][6]);
    
                try {
                    await cancelDecreaseOrder(wallet, orderInfo[i][0]);
                    cs.win("Closed")
                } catch (error) {
                    cs.fail("Error with order: " + orderInfo[i][0])
                }
            }
        }
        cs.process("Orders checked");
    }

    return;
}

module.exports = cleanWallet;