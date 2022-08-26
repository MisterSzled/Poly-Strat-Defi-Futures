const ethers = require('ethers');
const gmx = require("./abis/gmxOrderbook");

async function getGMXOrderbook(privKey) {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contractAddress = "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5";

        let contract = new ethers.Contract(contractAddress, gmx.abi, provider);

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

module.exports = getGMXOrderbook;