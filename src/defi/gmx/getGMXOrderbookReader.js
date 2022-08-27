const ethers = require('ethers');
const gmxOrderbookReader = require("../abis/gmxOrderbookReader");

async function getGMXOrderbookReader(privKey) {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contractAddress = "0xccFE3E576f8145403d3ce8f3c2f6519Dae40683B";

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