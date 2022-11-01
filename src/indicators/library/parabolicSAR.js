const cs = require("../../general/chalkSpec");
const sar = require("../taFuncs/index").sar

function parabolicSAR(strat, candleData) {
    cs.header("Parabolic SAR");

    let startPSAR = 0.02;
    let increment = 0.02;
    let maximum   = strat.settings.trendCode * 0.005;
    let psar = sar([...candleData.slice(0, candleData.length - 1)], startPSAR, increment, maximum);
    // let psar = sar([...candleData.slice(0, candleData.length - 1)], 0.02, 0.02, 0.2);

    let dir0 = psar[psar.length - 1] < candleData[candleData.length - 2][4] ? 1 : -1;
    let dir1 = psar[psar.length - 1] < candleData[candleData.length - 3][4] ? 1 : -1;

    cs.process("Direction 0: " + dir0);
    cs.process("Direction 1: " + dir1);

    let long  = (dir0 ===  1) && (dir1 === -1);
    let short = (dir0 === -1) && (dir1 === 1);

    if (long)  return 1;
    if (short) return -1;
    
    return 0;
}

module.exports = parabolicSAR;