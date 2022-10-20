const cs = require("../../general/chalkSpec");
const universal = require("../../../config").universal;

function highpass(strat, candleData) {
    let results = [0,0];
    candleData.reverse();

    let trigNo = .707 * 2 * Math.PI / 100;
    let alpha1 = (Math.cos(trigNo) + (Math.sin(trigNo) - 1)) / (Math.cos(trigNo));

    for (let i = universal.maxLookBack + 1; i > 0; i--) {
        let close0 = parseFloat(candleData[i][4]);
        let close1 = parseFloat(candleData[i + 1][4]);
        let close2 = parseFloat(candleData[i + 2][4]);
        let HP1 = results[results.length - 1];
        let HP2 = results[results.length - 2];
        
        let base = (1 - alpha1 / 2) * (1 - alpha1 / 2) * (close0 - 2 * (close1) + (close2));
        let rec = 2 * (1 - alpha1) * (HP1) - (1 - alpha1) * (1 - alpha1) * (HP2);
        let result = base + rec;
        results.push(result);
    }

    return results.slice(2);
}

function filter(strat, highpass, oscillatorNum) {
    let LPPeriod = 0;
    if (oscillatorNum === 1) {
        LPPeriod = strat.settings.LPPeriod1
    } else {
        LPPeriod = strat.settings.LPPeriod2
    }

    let a1 = Math.exp(-1.414 * Math.PI / LPPeriod);
    let b1 = 2 * a1 * Math.cos(1.414 * Math.PI / LPPeriod);
    let c2 = b1;
    let c3 = -a1 * a1;
    let c1 = 1 - c2 - c3;

    let results = [0,0];
    highpass.reverse();

    for (let i = universal.maxLookBack; i > 0; i--) {
        
        let base = c1 * (highpass[i] + highpass[i-1]) / 2;
        let Filt1 = results[results.length - 1];
        let Filt2 = results[results.length - 2];

        let rec = c2 * Filt1 + c3 * Filt2;
        let result = base + rec;
        results.push(result);
    }

    return results.slice(2);
}

function peak(strat, filter) {
    let results = [0,0];
    filter.reverse();

    for (let i = universal.maxLookBack; i >= 0; i--) {
        
        let peak = 0.991 * results[results.length - 1];

        if (Math.abs(filter[i]) > peak) {
            peak = Math.abs(filter[i])
        }
        results.push(peak);
    }

    return results.slice(2);
}

function x(strat, filter, peak) {

    let results = [];
    filter.reverse();
    peak.reverse();

    for (let i = universal.maxLookBack - 1; i >= 0; i--) {
        
        if (peak[i] !== 0) {
            results.push(filter[i] / peak[i])
        } else {
            results.push(0)
        }

    }

    return results;
}

function boomHunterQ1(strat, candleData) {
    let HP = highpass(strat, candleData);
    // console.log("HP0:", HP[HP.length - 1]);

    let FILT = filter(strat, [...HP], 1);
    // console.log("FILT0:", FILT[FILT.length - 1]);

    let PEAK = peak(strat, [...FILT]);
    // console.log("PEAK0:", PEAK[PEAK.length - 1]);

    let X = x(strat, [...FILT], [...PEAK]);
    // console.log("X0:", X[X.length - 1]);

    let result = [0,0,0,0,0];
    let esize = 60;
    let ey = 50;

    X.reverse();

    result = result.map((_,i) => {
        let xTriggerAv = X.slice(0 + i, strat.settings.triggerLength + i);
        xTriggerAv = xTriggerAv.reduce((a,b) => (a+b)) / xTriggerAv.length;
        
        let Q1 = (xTriggerAv + strat.settings.k1) / (strat.settings.k1 * xTriggerAv + 1);
        Q1 = Q1 * esize + ey;
        return Q1;
    });

    // console.log("Q1: ", result)
    return result
}

function boomHunterQ2(strat, candleData) {
    let HP = highpass(strat, candleData);
    // console.log("HP2:", HP[HP.length - 1]);

    let FILT = filter(strat, [...HP], 2);
    // console.log("FILT2:", FILT[FILT.length - 1]);

    let PEAK = peak(strat, [...FILT]);
    // console.log("PEAK2:", PEAK[PEAK.length - 1]);

    let X = x(strat, [...FILT], [...PEAK]);
    // console.log("X2:", X[X.length - 1]);

    let result = [0,0,0,0,0];
    let esize = 60;
    let ey = 50;

    X.reverse();

    result = result.map((_,i) => {
        let xTriggerAv = X.slice(0 + i, strat.settings.triggerLength + i);
        xTriggerAv = xTriggerAv.reduce((a,b) => (a+b)) / xTriggerAv.length;
        
        let Q2 = (xTriggerAv + strat.settings.k12) / (strat.settings.k12 * xTriggerAv + 1);
        Q2 = Q2 * esize + ey;
        return Q2;
    });

    // console.log("Q2: ", result)
    return result
}

function boomHunter(strat, candleData) {
    let Q1 = boomHunterQ1(strat, [...candleData]);
    let Q2 = boomHunterQ2(strat, [...candleData]);

    cs.header("Boom Hunter");
    cs.process("White Q1: " + Q1[0] + ", Prev Q1:" + Q1[1]);
    cs.process("Red   Q2: " + Q2[0] + ", Prev Q2:" + Q2[1]);

    if (
        //Q1 was below Q2
        (Q1[1] <= Q2[1]) &&
        //Q1 now above  Q2
        (Q1[0] > Q2[0]) &&
        //Has changed
        (Q1[0] !== Q1[1])
    ) {
        return 1;
    } else if (
        //Q1 was above Q2
        (Q1[1] >= Q2[1]) &&
        //Q1 now under  Q2
        (Q1[0] < Q2[0])&&
        //Has changed
        (Q1[0] !== Q1[1])
    ) {
        return -1;
    } else {
        return 0;
    }
}

module.exports = boomHunter;