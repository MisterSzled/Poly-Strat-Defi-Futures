const ethers = require('ethers');
const gmx = require("./abis/gmxReader");

async function getGMXReader() {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contractAddress = "0x67b789D48c926006F5132BFCe4e976F0A7A63d5D";

        let contract = new ethers.Contract(contractAddress, gmx.abi, provider);

        // if (!!privKey) {
        //     let wallet = new ethers.Wallet(privKey, provider);

        //     let contractWithSigner = contract.connect(wallet);

        //     return contractWithSigner;
        // } else {
            return contract;
        // }
        
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = getGMXReader;