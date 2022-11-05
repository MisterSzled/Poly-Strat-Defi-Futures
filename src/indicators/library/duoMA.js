const cs = require("../../general/chalkSpec");
const bolingerbands = require("../taFuncs/index").bolingerbands;
const sma = require("../taFuncs/index").sma;
const ema = require("../taFuncs/index").ema;

funcmap = {
    "SMA": sma,
    "EMA": ema
}

let prevAns = {}

function duoMA(strat, candleData) {
    cs.header("Duo MA");

    if (!prevAns[strat.settings.ma1_length * strat.settings.ma2_length]) {
        prevAns[strat.settings.ma1_length * strat.settings.ma2_length] = {}
    }

    let prevAnsNow = prevAns[strat.settings.ma1_length * strat.settings.ma2_length][candleData[candleData.length - 1][0]];
    if (typeof(prevAnsNow) === "number") {
        cs.process("Duo MA prev: " + prevAnsNow);
        return prevAnsNow
    }

    let priceSlice = [...candleData.slice(0, candleData.length - 1)];

    let ma1 = funcmap[strat.settings.ma1_type]([...priceSlice].map(val => parseFloat(val[4])), strat.settings.ma1_length);
    let ma2 = funcmap[strat.settings.ma2_type]([...priceSlice].map(val => parseFloat(val[4])), strat.settings.ma2_length);

    let close = parseFloat(priceSlice[priceSlice.length - 1][4]);
    let ma1Res = ma1[ma1.length - 1];
    let ma2Res = ma2[ma2.length - 1];

    cs.process("MA 1    Res: " + ma1Res);
    cs.process("MA 2    Res: " + ma2Res);
    cs.process("Close > MA1: " + (close > ma1Res));
    cs.process("Close > MA2: " + (close > ma2Res));
    cs.process("MA2   > MA1: " + (ma2Res > ma1Res));

    let resLong  = (close > ma1Res) && (close > ma2Res) && (ma2Res > ma1Res);
    let resShort = (close < ma1Res) && (close < ma2Res) && (ma2Res < ma1Res);

    if (resLong) {
        prevAns[strat.settings.ma1_length * strat.settings.ma2_length][candleData[candleData.length - 1][0]] = 1;
        return  1;
    }
    if (resShort) {
        prevAns[strat.settings.ma1_length * strat.settings.ma2_length][candleData[candleData.length - 1][0]] = -1;
        return -1;
    }

    prevAns[strat.settings.ma1_length * strat.settings.ma2_length][candleData[candleData.length - 1][0]] = 0;
    return 0;
}

module.exports = duoMA;