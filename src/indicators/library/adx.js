const cs = require("../../general/chalkSpec");

function getATRPair(price0, price1) {
    let atr0 = Math.max(Math.max(price0[2] - price0[3], Math.abs(price0[2] - price1[4]), Math.abs(price0[3] - price1[4])));

    return atr0
}

function getDirection(price0, price1) {
    let directionalMovementPlus0  = price0[2] - price1[2] > price1[3] - price0[3] ? Math.max(price0[2] - price1[2], 0) : 0;
    let directionalMovementMinus0 = price1[3] - price0[3] > price0[2] - price1[2] ? Math.max(price1[3] - price0[3], 0) : 0;

    return {
        dmpPlus0: directionalMovementPlus0,
        dmpMin0: directionalMovementMinus0,
    }
}

function adx(strat, candleData) {
    cs.header("ADX");

    let priceData  = candleData.slice(0, [...candleData].length - 1);

    let smoothedTrueRange = [];
    let smoothDirPlus  = [];
    let smoothDirMinus = [];
    let DX = [];
    let ADX = [];
    for (let i = 800; i < priceData.length; i++) {
        let atr = getATRPair(priceData[i], priceData[i-1]);
        let dir = getDirection(priceData[i], priceData[i-1]);

        if (smoothedTrueRange.length > 0) {
            let str = smoothedTrueRange[smoothedTrueRange.length - 1] - smoothedTrueRange[smoothedTrueRange.length - 1] / strat.settings.length + atr;
            let sdp = smoothDirPlus[smoothDirPlus.length - 1] - (smoothDirPlus[smoothDirPlus.length - 1] / strat.settings.length) + dir.dmpPlus0;
            let sdm = smoothDirMinus[smoothDirMinus.length - 1] - (smoothDirMinus[smoothDirMinus.length - 1] / strat.settings.length) + dir.dmpMin0;

            smoothedTrueRange.push(str);
            smoothDirPlus.push(sdp);
            smoothDirMinus.push(sdm);

            let DIPlus  = sdp / str * 100;
            let DIMinus = sdm / str * 100;
            DX.push(Math.abs(DIPlus - DIMinus) / (DIPlus + DIMinus) * 100);

            if (DX.length > strat.settings.length) {
                let tempSlice = DX.slice(DX.length - strat.settings.length, DX.length);
                let av = tempSlice.reduce((a,b) => (a+b)) / tempSlice.length;
                ADX.push(av);
            }

        } else {
            smoothedTrueRange.push(atr);
            smoothDirPlus.push(dir.dmpPlus0);
            smoothDirMinus.push(dir.dmpMin0);
        }
    }

    let DIPlus  = smoothDirPlus[smoothDirPlus.length   - 1] / smoothedTrueRange[smoothedTrueRange.length - 1] * 100;
    let DIMinus = smoothDirMinus[smoothDirMinus.length - 1] / smoothedTrueRange[smoothedTrueRange.length - 1] * 100;

    let isAdxUp             = ADX[ADX.length - 1]  > ADX[ADX.length - 2];
    let isAdxValid          = (ADX[ADX.length - 1]  > strat.settings.midLine) && isAdxUp;
    let longTradeConfirmed  = (DIPlus  > DIMinus) && isAdxValid;
    let shortTradeConfirmed = (DIMinus > DIPlus)  && isAdxValid;
    
    cs.process("ADX 0:        " + ADX[ADX.length - 1]);
    cs.process("ADX 1:        " + ADX[ADX.length - 2]);
    cs.process("DIPlus:       " + DIPlus);
    cs.process("DIMinus:      " + DIMinus);
    cs.process("Is ADX up:    " + isAdxUp);
    cs.process("Is ADX valid: " + isAdxValid);


    if (longTradeConfirmed) cs.win("ADX Long confirmed");
    if (shortTradeConfirmed) cs.fail("ADX Short confirmed");

    if (longTradeConfirmed) return 1;
    if (shortTradeConfirmed) return -1;
    return 0;
}

module.exports = adx;