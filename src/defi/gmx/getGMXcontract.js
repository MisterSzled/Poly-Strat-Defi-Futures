const ethers = require('ethers');
const gmx = require("../abis/gmx");

let rpcLookup = {
    "AVAX": "https://api.avax.network/ext/bc/C/rpc",
    "ARBITRUM": "https://arb1.arbitrum.io/rpc",
}
let contractLookup = {
    "AVAX": "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
    "ARBITRUM": "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
}
async function getGMXcontract(privKey) {
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

module.exports = getGMXcontract;