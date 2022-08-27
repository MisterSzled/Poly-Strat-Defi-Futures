const ethers = require('ethers');
const joe = require("./abis/joe");

async function getExchangeContract(privKey) {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contractAddress = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"; //Exchange router

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