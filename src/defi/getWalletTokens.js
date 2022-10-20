const ethers = require('ethers');
const erc20 = require("./abis/erc20.js");

// let wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
let tokenInfo = {
    "AVAX": {
        "usdc":  {addy: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", scale: 10**6},
        "weth":  {addy: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", scale: 10**18},
        "wbtc":  {addy: "0x50b7545627a5162F82A992c33b87aDc75187B218", scale: 10**8},
    },
    "ARBITRUM": {
        "usdc":  {addy: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", scale: 10**6},
        "weth":  {addy: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", scale: 10**18},
        "wbtc":  {addy: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", scale: 10**8},
        "uni":   {addy: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0", scale: 10**18},
        "link":  {addy: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", scale: 10**18},
    }
};

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}

async function getTokenContract(tokenAddress) {
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let contract = new ethers.Contract(tokenAddress, erc20.abi, provider);

        return contract;        
    } catch (e) {
        throw new Error(e);
    }
}

async function getWalletTokens(myAddress, raw) {
    
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let wallet = {};
        let tokenKeys = Object.keys(tokenInfo[global.chain])
        for (let i = 0; i < tokenKeys.length; i++) {
            let tokenContract = await getTokenContract(tokenInfo[global.chain][tokenKeys[i]].addy);
            let res = await tokenContract.balanceOf(myAddress);
            if (raw) {
                wallet[tokenKeys[i]] = res
            } else {
                wallet[tokenKeys[i]] = parseFloat(res) / tokenInfo[global.chain][tokenKeys[i]].scale
            }
        }
        if (raw) {
            wallet["avax"] = await provider.getBalance(myAddress)
        } else {
            wallet["avax"] = parseFloat(await provider.getBalance(myAddress)) / 10**18;
        }


        return wallet;        
    } catch (e) {
        console.log("Wallet fetch error", e);
    }
}

module.exports = getWalletTokens;