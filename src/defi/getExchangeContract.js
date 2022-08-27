const ethers = require('ethers');
const joe = require("./abis/joe");

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}
let contractLookup = {
    "AVAX": "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",     //Trader joe
    "ARBITRUM": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", //Sushi swap
}

async function getExchangeContract(privKey) {
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let contractAddress = contractLookup[global.chain];

        let contract = new ethers.Contract(contractAddress, joe.abi, provider);

        if (!!privKey) {
            let wallet = new ethers.Wallet(privKey, provider);

            let contractWithSigner = contract.connect(wallet);

            return contractWithSigner;
        } else {
            return contract;
        }
        
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = getExchangeContract;