const getGMXOrderbook = require("./getGMXOrderbook");
const estimateGas = require("./estimateGas");

async function cancelDecreaseOrder(wallet, orderIndex) {
    let gmxOrderbook = await getGMXOrderbook(wallet.priv);

    let cancelOne = await gmxOrderbook["cancelDecreaseOrder"](
        orderIndex,
        {
            gasPrice: await estimateGas(1), 
            gasLimit: 450000,
        }
    );
    let cancelOneResp = await cancelOne.wait();
}

module.exports = cancelDecreaseOrder;