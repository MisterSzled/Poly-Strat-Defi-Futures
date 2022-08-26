const ethers = require('ethers');
const gmx = require("./abis/gmx");

async function getGMXcontract(privKey) {
    try {
        let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

        let contractAddress = "0x195256074192170d1530527abC9943759c7167d8"; //Exchange router

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

module.exports = getGMXcontract;