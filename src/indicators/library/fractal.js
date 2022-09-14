const cs = require("../../general/chalkSpec");

function getFractalArray(strat, candleData) {
    candleData = candleData.slice(0, candleData.length - 1)
    candleData.reverse();

    let result = [
        // {top: null, bot: null},
        // {top: null, bot: null},
    ];
    // for (let i = 0; i < 18; i++) {
    for (let i = 0; i < candleData.length - 6; i++) {
        let offset = 0;
        let topF = false;
        let botF = false;
        let high = candleData.slice(i + offset, i + 5 + offset).map(val => parseFloat(val[2]));
        let low  = candleData.slice(i + offset, i + 5 + offset).map(val => parseFloat(val[3]));

        if (strat.filterBillWilliams) {
            // Do NOT use BW
            topF = (high[4] < high[3])  && (high[3] < high[2])  && (high[2] > high[1])  && (high[1] > high[0]);
            botF = (low[4]  > low[3])    && (low[3] > low[2])    && (low[2] < low[1])    && (low[1] < low[0]);
        } else {
            // Use BW
            topF = (high[4] < high[2])  && (high[3] <= high[2]) && (high[2] >= high[1]) && (high[2] > high[0]);
            botF = (low[4]  > low[2])    && (low[3] >= low[2])   && (low[2] <= low[1])   && (low[2] < low[0]);
        }
        result.push({
            top: topF,
            bot: botF,
        });
    }
    return result
}

function getHHLLArray (strat, candleData, fractalArray) {
    candleData = candleData.slice(0, candleData.length - 1)
    candleData.reverse();

    console.log(candleData.length - 6);
    console.log(fractalArray.length);

    let result = [];
    let fractalTops = fractalArray.map(val => val.top);
    let fractalBots = fractalArray.map(val => val.bot);
    for (let i = 0; i < fractalArray.length - 3; i++) {

        

        if (fractalArray[i].top) {
            let index0 = fractalTops.indexOf(true, i);
            let index1 = fractalTops.indexOf(true, i + index0 + 1);
            let index2 = fractalTops.indexOf(true, i + index1 + 1);

            let checkHH1 = candleData[index1 + 2][2] < candleData[index0 + 2][2];
            let checkHH2 = candleData[index2 + 2][2] < candleData[index0 + 2][2];
            if (checkHH1 && checkHH2) {
                result.push({index: i + 2, type: "HH"});
            }

            let checkLH1 = candleData[index1 + 2][2] > candleData[index0 + 2][2];
            let checkLH2 = candleData[index2 + 2][2] > candleData[index0 + 2][2];
            if (checkLH1 && checkLH2) {
                result.push({index: i + 2, type: "LH"});
            }            
        }
        if (fractalArray[i].bot) {
            let index0 = fractalBots.indexOf(true, i);
            let index1 = fractalBots.indexOf(true, i + index0 + 1);
            let index2 = fractalBots.indexOf(true, i + index1 + 1);

            let checkHH1 = candleData[index1 + 2][3] < candleData[index0 + 2][3];
            let checkHH2 = candleData[index2 + 2][3] < candleData[index0 + 2][3];
            if (checkHH1 && checkHH2) {
                result.push({index: i + 2, type: "HL"});
            }

            let checkLH1 = candleData[index1 + 2][3] > candleData[index0 + 2][3];
            let checkLH2 = candleData[index2 + 2][3] > candleData[index0 + 2][3];
            if (checkLH1 && checkLH2) {
                result.push({index: i + 2, type: "LL"});
            }
        }
    }

    console.log(result)
}

function fractal(strat, candleData) {
    let fractalArray = getFractalArray(strat, [...candleData]);
    let highHighLowerLows = getHHLLArray(strat, [...candleData], fractalArray);

    console.log(result.map((val, i) => i + " :" + "top: " + val["top"] + " " + "bot: " + val["bot"]))
}

module.exports = fractal;