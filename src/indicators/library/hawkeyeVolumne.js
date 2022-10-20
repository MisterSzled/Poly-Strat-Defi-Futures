const cs = require("../../general/chalkSpec");

function getHevSMA(strat, candleData) {
    let diffs = [...candleData].map(val => parseFloat(val[2]) - parseFloat(val[3]));
    let vols  = [...candleData].map(val => parseFloat(val[5]));

    let ranges = [];
    let volume = [];
    for (let i = strat.settings.length - 1; i < diffs.length; i++) {
        if (ranges.length < strat.settings.length) {
            ranges.push(diffs[i]);
        } else {
            let tempSlice = diffs.slice(i - strat.settings.length + 1, i + 1);
            ranges.push((tempSlice.reduce((a,b) => (a+b))) / tempSlice.length);
        }

        if (volume.length < strat.settings.length) {
            volume.push(vols[i]);
        } else {
            let tempSlice = vols.slice(i - strat.settings.length + 1, i + 1);
            volume.push((tempSlice.reduce((a,b) => (a+b))) / tempSlice.length);
        }
    }
    return {
        range:  ranges[ranges.length - 1],
        volume: volume[volume.length - 1],
    }
} 

function hawkeyeVolumne(strat, candleData) {
    cs.header("Hawkeye Volumne");
    candleData = candleData.slice(0, candleData.length - 1);

    let hevSMA = getHevSMA(strat, [...candleData]);

    let hevRange1 = parseFloat(candleData[candleData.length - 1][2]) - parseFloat(candleData[candleData.length - 1][3]);
    let hevRangeAvg = hevSMA.range;
    let hevVolumeA  = hevSMA.volume;

    let high   = parseFloat(candleData[candleData.length - 1][2]);
    let low    = parseFloat(candleData[candleData.length - 1][3]);
    let close  = parseFloat(candleData[candleData.length - 1][4]);
    let volume = parseFloat(candleData[candleData.length - 1][5]);

    let hevHigh1 = parseFloat(candleData[candleData.length - 2][2]);
    let hevLow1  = parseFloat(candleData[candleData.length - 2][3]);
    let hevMid1  = (hevHigh1 + hevLow1) / 2;

    let hevU1 = hevMid1 + (hevHigh1 - hevLow1) / strat.settings.divisor;
    let hevD1 = hevMid1 - (hevHigh1 - hevLow1) / strat.settings.divisor;

    let rEnabled1 = (hevRange1 > hevRangeAvg) && (close < hevD1) && (volume > hevVolumeA);
    let rEnabled2 = close < hevMid1
    let rEnabled = rEnabled1 || rEnabled2

    let gEnabled1 = close > hevMid1;
    let gEnabled2 = (hevRange1 > hevRangeAvg) && (close > hevU1) && (volume > hevVolumeA);
    let gEnabled3 = (high > hevHigh1) && (hevRange1 < (hevRangeAvg / 1.5)) && (volume < hevVolumeA);
    let gEnabled4 = (low  < hevLow1)    && (hevRange1 < (hevRangeAvg / 1.5)) && (volume > hevVolumeA);
    let gEnabled  = gEnabled1 || gEnabled2 || gEnabled3 || gEnabled4;

    let grEnabled1 = (hevRange1 > hevRangeAvg) && (close > hevD1) && (close < hevU1) && (volume > hevVolumeA) && (volume < (hevVolumeA * 1.5)) && (volume > volume[1]);
    let grEnabled2 = (hevRange1 < (hevRangeAvg / 1.5)) && (volume < (hevVolumeA / 1.5))
    let grEnabled3 = (close > hevD1) && (close < hevU1)
    let grEnabled  = grEnabled1 || grEnabled2 || grEnabled3;

    let result = 0;
    if (!grEnabled && gEnabled) {
        result = 1;
    }
    if (!grEnabled && rEnabled) {
        result = -1;
    }

    cs[result === 1 ? "win"  : "process"]("NOT Gr AND G: " + (!grEnabled && gEnabled));
    cs[result === 1 ? "fail" : "process"]("NOT Gr AND R: " + (!grEnabled && rEnabled));

    return result;
}

module.exports = hawkeyeVolumne;