const cs = require("../../general/chalkSpec");

const lookback = 200;

function getCoral(strat, candleData) {
    let priceData = candleData.slice(0, candleData.length - 1);

    let ctSm = strat.settings.smoothingPeriod;
    let ctCd = strat.settings.constantD;

    let di = (ctSm - 1.0) / 2.0 + 1.0;
    let c1 = 2 / (di + 1.0);
    let c2 = 1 - c1;
    let c3 = 3.0 * (ctCd * ctCd + ctCd * ctCd * ctCd);
    let c4 = -3.0 * (2.0 * ctCd * ctCd + ctCd + ctCd * ctCd * ctCd);
    let c5 = 3.0 * ctCd + 1.0 + ctCd * ctCd * ctCd + 3.0 * ctCd * ctCd;

    let i1 = [];
    let i2 = [];
    let i3 = [];
    let i4 = [];
    let i5 = [];
    let i6 = [];
    let bfr = [];
    for (let i = priceData.length - lookback; i < priceData.length; i++) {
        let src = priceData[i][4];

        if (i1.length > 0) {
            let i1_temp = c1 * src + c2 * i1[i1.length - 1];
            let i2_temp = c1 * i1_temp  + c2 * i2[i2.length - 1];
            let i3_temp = c1 * i2_temp  + c2 * i3[i3.length - 1];
            let i4_temp = c1 * i3_temp  + c2 * i4[i4.length - 1];
            let i5_temp = c1 * i4_temp  + c2 * i5[i5.length - 1];
            let i6_temp = c1 * i5_temp  + c2 * i6[i6.length - 1];

            i1.push(i1_temp);
            i2.push(i2_temp);
            i3.push(i3_temp);
            i4.push(i4_temp);
            i5.push(i5_temp);
            i6.push(i6_temp);

            bfr.push(-ctCd * ctCd * ctCd * i6_temp + c3 * i5_temp + c4 * i4_temp + c5 * i3_temp);
        } else {
            let i1_temp = c1 * src + c2;
            let i2_temp = c1 * i1_temp  + c2;
            let i3_temp = c1 * i2_temp  + c2;
            let i4_temp = c1 * i3_temp  + c2;
            let i5_temp = c1 * i4_temp  + c2;
            let i6_temp = c1 * i5_temp  + c2;

            i1.push(i1_temp);
            i2.push(i2_temp);
            i3.push(i3_temp);
            i4.push(i4_temp);
            i5.push(i5_temp);
            i6.push(i6_temp);

            bfr.push(-ctCd * ctCd * ctCd * i6_temp + c3 * i5_temp + c4 * i4_temp + c5 * i3_temp);
        }
    }


    // console.log("i1: ", i1[i1.length - 1]);
    // console.log("i2: ", i2[i2.length - 1]);
    // console.log("i3: ", i3[i3.length - 1]);
    // console.log("i4: ", i4[i4.length - 1]);
    // console.log("i5: ", i5[i5.length - 1]);
    // console.log("i6: ", i6[i6.length - 1]);
    // console.log("BFR: ", bfr[bfr.length - 1]);

    // console.log("i1: ", i1[i1.length - 2]);
    // console.log("i2: ", i2[i2.length - 2]);
    // console.log("i3: ", i3[i3.length - 2]);
    // console.log("i4: ", i4[i4.length - 2]);
    // console.log("i5: ", i5[i5.length - 2]);
    // console.log("i6: ", i6[i6.length - 2]);
    // console.log("BFR: ", bfr[bfr.length - 2]);

    return bfr;
}

function getCleanBarArray(candleData, bfr) {
    let priceData = candleData.slice(candleData.length - 1 - lookback, candleData.length - 1);

    let sincePrePullbackBullBreakout = -1;
    let sincePrePullbackBearBreakout = -1;

    let bullishBFRCrossover = -1;
    let bearishBFRCrossover = -1;

    let bullCountA = -1;
    let bearCountA = -1;

    let bullCountB = -1;
    let bearCountB = -1;
    let cleanBelow = -1;
    let cleanAbove = -1;

    let count = 0;
    for (let i = priceData.length - 1; i > 1; i--) {
        let bfr0 = bfr[bfr.length - 1 - count];
        let bfr1 = bfr[bfr.length - 2 - count];
        let bfr2 = bfr[bfr.length - 3 - count];

        if ((bullCountA > -1) && (bearCountA > -1) &&
            (bullCountB > -1) && (bearCountB > -1) &&
            (cleanBelow > -1) && (cleanAbove > -1) &&
            (bullishBFRCrossover > -1) && (bearishBFRCrossover > -1)
        ) break;

        if ((bullCountA < 0) && (priceData[i][4] > bfr0) && (priceData[i-1][4] < bfr1)) bullCountA = count;
        if ((bearCountA < 0) && (priceData[i][4] < bfr0) && (priceData[i-1][4] > bfr1)) bearCountA = count;

        if ((bullCountB < 0) && (priceData[i-1][4] > bfr1) && (priceData[i-2][4] < bfr2)) bullCountB = count;
        if ((bearCountB < 0) && (priceData[i-1][4] < bfr1) && (priceData[i-2][4] > bfr2)) bearCountB = count;

        if ((cleanAbove < 0) && (priceData[i][3] > bfr0)) cleanAbove = count;
        if ((cleanBelow < 0) && (priceData[i][2] < bfr0)) cleanBelow = count;

        if ((bullishBFRCrossover < 0) && (bfr0 > bfr1) && (bfr1 < bfr2)) bullishBFRCrossover = count
        if ((bearishBFRCrossover < 0) && (bfr0 < bfr1) && (bfr1 > bfr2)) bearishBFRCrossover = count

        if ((sincePrePullbackBullBreakout  < 0) && (priceData[i][4] > bfr0) && (priceData[i-1][4] < bfr1)) sincePrePullbackBullBreakout = count
        if ((sincePrePullbackBearBreakout < 0) && (priceData[i][4] < bfr0) && (priceData[i-1][4] > bfr1)) sincePrePullbackBearBreakout = count

        count++;
    }

    // console.log("cleanAbove: ", cleanAbove)
    // console.log("cleanBelow: ", cleanBelow)
    // console.log("sincePrePullbackBullBreakout: ", sincePrePullbackBullBreakout)
    // console.log("sincePrePullbackBearBreakout: ", sincePrePullbackBearBreakout)
    // console.log("bullishBFRCrossover: ", bullishBFRCrossover)
    // console.log("bearishBFRCrossover: ", bearishBFRCrossover)
    

    return {
        bull: [bullCountA, bullCountB],
        bear: [bearCountA, bearCountB],
        above: cleanAbove,
        below: cleanBelow,
        bullishBFRCrossover: bullishBFRCrossover,
        bearishBFRCrossover: bearishBFRCrossover,
        sincePrePullbackBullBreakout:   sincePrePullbackBullBreakout,
        sincePrePullbackBearBreakout:  sincePrePullbackBearBreakout,
    }
}

function coralTrend(strat, candleData) {
    cs.header("Coral Trend");

    let bfr = getCoral(strat, [...candleData]);

    // Condition 1: is coral bullish
    let isCoralBullish  = bfr[bfr.length - 1] > bfr[bfr.length - 2];
    let isCoralBearish = bfr[bfr.length - 1] < bfr[bfr.length - 2];

    // Condition 2: At least 1 candle completely above/below (long/short) Coral Trend since last cross above/below (long/short) Coral Trend
    let cleanBarArray = getCleanBarArray(candleData, bfr);
    let prePullbackBullBreakout  = cleanBarArray.above < cleanBarArray.bull[1];
    let prePullbackBearBreakout = cleanBarArray.below < cleanBarArray.bear[1];

    // Condition 3: Pullback closes below/above (long/short) Coral Trend
    let barssinceBullPullbackStart = cleanBarArray.bear[0];
    let barssinceBearPullbackStart = cleanBarArray.bull[0];
    let barssincePullbackStart = isCoralBullish ? barssinceBullPullbackStart : isCoralBearish ? barssinceBearPullbackStart : 0;

    // Condition 4: Coral Trend colour matched trend direction for duration of pullback
    let barssinceCoralflip = isCoralBullish ? cleanBarArray.bullishBFRCrossover : isCoralBearish ? cleanBarArray.bearishBFRCrossover : 0
    let isPullbackValid    = barssincePullbackStart < barssinceCoralflip;

    // Condition 5: After valid pullback, price then closes above/below (long/short) Coral Trend
    let entryBreakout = (isCoralBullish && (cleanBarArray.sincePrePullbackBullBreakout === 0)) || (isCoralBearish && (cleanBarArray.sincePrePullbackBearBreakout === 0));

    let isLong  = isCoralBullish && prePullbackBullBreakout && isPullbackValid && entryBreakout;
    let isShort = isCoralBearish && prePullbackBearBreakout && isPullbackValid && entryBreakout;

    cs[isCoralBullish ? "win" : isCoralBearish ? "fail" : "process"]("Direction:      " + (isCoralBullish ? 1 : isCoralBearish ? -1 : 0));
    cs[prePullbackBullBreakout ? "win" : prePullbackBearBreakout ? "fail" : "process"]("Clean break:    " + (prePullbackBullBreakout ? 1 : prePullbackBearBreakout ? -1 : 0));
    cs[isPullbackValid ? "win" : "process"]("Pullback valid: " + (isPullbackValid));
    cs[entryBreakout ? "win" : "process"]("Entry breakout: " + (entryBreakout));

    return isLong ? 1 : isShort ? -1 : 0;
}

module.exports = coralTrend;