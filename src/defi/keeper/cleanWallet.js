const cs = require("../../general/chalkSpec");
const sleep = require("../../general/sleep");
const getWalletTokens = require("../getWalletTokens");
const getJoePrice = require("./getJoePrice");
const swapExactTokensForTokens = require("./swapExactTokensForTokens");
const swapExactAVAXForTokens = require("./swapExactAVAXForTokens");
const swapExactTokensForAVAX = require("./swapExactTokensForAVAX");
const getGMXOrderbook = require("../gmx/getGMXOrderbook");
const getGMXOrderbookReader = require("../gmx/getGMXOrderbookReader");
const cancelDecreaseOrder = require("../gmx/cancelDecreaseOrder");

const avaxUpperLimit = 1.5;
const avaxLowerLimit = 0.5;
const dollarsIntoAvax = 10;

async function cleanWallet(wallet, strat) {
    let curWallet = await getWalletTokens(wallet.public, true);
    let swapArray = [];

    console.log(parseFloat(curWallet["wavax"]) / 10**18)

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

    // Swap all btc to USDC
    if ((parseFloat(curWallet["wavax"]) / 10**18) > 0) {
        cs.fail("WAVAX");
        let temp = {token: "wavax"};
        temp.amtIn = curWallet["wavax"];
        temp.amtOut = await getJoePrice("wavax", curWallet["wavax"], "usdc");
        swapArray.push(temp);
    } else {
        cs.win("WAVAX clean");
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


    return;
}

module.exports = cleanWallet;