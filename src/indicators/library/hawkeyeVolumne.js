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
    console.log(hevSMA)
}

module.exports = hawkeyeVolumne;