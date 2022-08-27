const ethers = require('ethers');
const gmx = require("../abis/gmxReader");

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}
let contractLookup = {
    "AVAX": "0x67b789D48c926006F5132BFCe4e976F0A7A63d5D",
    "ARBITRUM": "0x22199a49A999c351eF7927602CFB187ec3cae489"
}

async function getGMXReader() {
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let contractAddress = contractLookup[global.chain];

        let contract = new ethers.Contract(contractAddress, gmx.abi, provider);

        return contract;
        
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = getGMXReader;