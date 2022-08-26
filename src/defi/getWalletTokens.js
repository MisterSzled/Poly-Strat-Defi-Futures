const ethers = require('ethers');
const erc20 = require("./abis/erc20.js");

// let wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
let tokenInfo = {
    "usdc":  {addy: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", scale: 10**6},
    "weth":  {addy: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", scale: 10**18},
    "wbtc":  {addy: "0x50b7545627a5162F82A992c33b87aDc75187B218", scale: 10**8},
};

async function getTokenContract(tokenAddress) {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contract = new ethers.Contract(tokenAddress, erc20.abi, provider);

        return contract;        
    } catch (e) {
        throw new Error(e);
    }
}

async function getWalletTokens(myAddress, raw) {
    
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let wallet = {};
        let tokenKeys = Object.keys(tokenInfo)
        for (let i = 0; i < tokenKeys.length; i++) {
            let tokenContract = await getTokenContract(tokenInfo[tokenKeys[i]].addy);
            let res = await tokenContract.balanceOf(myAddress);
            if (raw) {
                wallet[tokenKeys[i]] = res
            } else {
                wallet[tokenKeys[i]] = parseFloat(res) / tokenInfo[tokenKeys[i]].scale
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