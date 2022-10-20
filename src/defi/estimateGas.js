const ethers = require('ethers');

async function estimateGas(multi) {
    let provider = ethers.getDefaultProvider("https://api.avax.network/ext/bc/C/rpc");

    let gas = ethers.utils.formatUnits(
        await provider.getGasPrice(),
         "gwei"
    );

    return ethers.utils.parseUnits(Number(gas*multi).toFixed(1) + "", 'gwei');
}

module.exports = estimateGas