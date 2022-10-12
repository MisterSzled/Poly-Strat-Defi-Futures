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

    return bfr;
}

function getCleanBarArray(candleData, bfr) {
    let priceData = candleData.slice(candleData.length - 1 - lookback, candleData.length - 1);

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

        if (bullCountA > -1 && bearCountA > -1 &&
            bullCountB > -1 && bearCountB > -1 &&
            cleanBelow > -1 && cleanAbove > -1
        ) break;
        if (bullCountA < 0 && (priceData[i][4] > bfr0) && (priceData[i-1][4] < bfr1)) bullCountA = count;
        if (bearCountA < 0 && (priceData[i][4] < bfr0) && (priceData[i-1][4] > bfr1)) bearCountA = count;

        if (bullCountB < 0 && (priceData[i-1][4] > bfr0) && (priceData[i-2][4] < bfr1)) bullCountB = count;
        if (bearCountB < 0 && (priceData[i-1][4] < bfr0) && (priceData[i-2][4] > bfr1)) bearCountB = count;

        if (cleanAbove < 0 && (cleanAbove < 0) && (priceData[i][3] > bfr0)) cleanAbove = count;
        if (cleanBelow < 0 && (cleanBelow < 0) && (priceData[i][2] < bfr0)) cleanBelow = count;
        count++;
    }

    return {
        bull: bullCountB,
        bear: bearCountB,
        above: cleanAbove,
        below: cleanBelow,
    }
}

function coralTrend(strat, candleData) {
    cs.header("Coral Trend");

    let bfr = getCoral(strat, [...candleData]);

    // Condition 1: is coral bullish
    let longA = bfr[bfr.length - 1] > bfr[bfr.length - 2];
    let shortA = bfr[bfr.length - 1] > bfr[bfr.length - 2];

    // XXX
    // Need to check this works at the threshold of cross over
    // XXX
    // Condition 2: At least 1 candle completely above/below (long/short) Coral Trend since last cross above/below (long/short) Coral Trend
    let cleanBarArray = getCleanBarArray(candleData, bfr);
    console.log(cleanBarArray)

    let longB = cleanBarArray.above  < cleanBarArray.bull[1];
    let shortB = cleanBarArray.below < cleanBarArray.bear[1];

    // Condition 3: Pullback closes below/above (long/short) Coral Trend

}

module.exports = coralTrend;