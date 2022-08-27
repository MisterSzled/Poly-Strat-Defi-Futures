const ethers = require('ethers');
const gmx = require("../abis/gmxOrderbook");

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}
let contractLookup = {
    "AVAX": "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    "ARBITRUM": "0x09f77e8a13de9a35a7231028187e9fd5db8a2acb",
}
async function getGMXOrderbook(privKey) {
    try {
        let provider = ethers.getDefaultProvider(rpcLookup[global.chain]);

        let contractAddress = contractLookup[global.chain];

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