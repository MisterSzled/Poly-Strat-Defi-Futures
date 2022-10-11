const cs = require("../../general/chalkSpec");

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
    for (let i = priceData.length - 200; i < priceData.length; i++) {
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


    console.log("i1: ", i1[i1.length - 1]);
    console.log("i2: ", i2[i2.length - 1]);
    console.log("i3: ", i3[i3.length - 1]);
    console.log("i4: ", i4[i4.length - 1]);
    console.log("i5: ", i5[i5.length - 1]);
    console.log("i6: ", i6[i6.length - 1]);
    console.log("BFR: ", bfr[bfr.length - 1]);

    return bfr;
    // return bfr[bfr.length - 1] > bfr[bfr.length - 2] ? 1 : 
    //        bfr[bfr.length - 1] < bfr[bfr.length - 2] ? -1 : 
    //        0;
}

function coralTrend(strat, candleData) {
    cs.header("Coral Trend");

    let coralArray = getCoral(strat, [...candleData]);

    // Condition 1: is coral bullish
}

module.exports = coralTrend;