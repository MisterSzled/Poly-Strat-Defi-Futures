const ethers = require('ethers');
const gmxOrderbookReader = require("../abis/gmxOrderbookReader");

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}
let contractLookup = {
    "AVAX": "0xccFE3E576f8145403d3ce8f3c2f6519Dae40683B",
    "ARBITRUM": "0xa27C20A7CF0e1C68C0460706bB674f98F362Bc21 ",
}
async function getGMXOrderbookReader(privKey) {
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let contractAddress = contractLookup[global.chain];

        let contract = new ethers.Contract(contractAddress, gmxOrderbookReader.abi, provider);

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

module.exports = getGMXOrderbookReader;