const cs = require("../../general/chalkSpec");

function getFractalArray(strat, candleData) {
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

        if (strat.settings.filterBillWilliams) {
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

    let result = [];
    let fractalTops = fractalArray.map(val => val.top);
    let fractalBots = fractalArray.map(val => val.bot);
    for (let i = 0; i < fractalArray.length - 3; i++) {
        if (fractalArray[i].top) {
            let index0 = fractalTops.indexOf(true, i);
            let index1 = fractalTops.indexOf(true, index0 + 1);
            let index2 = fractalTops.indexOf(true, index1 + 1);

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
            let index1 = fractalBots.indexOf(true, index0 + 1);
            let index2 = fractalBots.indexOf(true, index1 + 1);

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

    return result;
}

function getTimeFrameArray(strat, candleData, highHighLowerLows) {

    let lookbackNum = strat.settings.timeframe / 15;
    let allTimeFractals = highHighLowerLows.filter((hhll, i) => {
        if ((hhll.type === "HH")) {
            let highAtHigh = candleData[hhll.index][2];
            let timeDetractmentIndex = (candleData[hhll.index - 2][0] % 3600000) / 900000;

            let upperIndex = (((lookbackNum - 1) - timeDetractmentIndex) % lookbackNum);
            let lowerIndex = lookbackNum - 1 - upperIndex;
            let htfHighSlice = candleData.slice(hhll.index - 2 - upperIndex, hhll.index - 2 + lowerIndex + 1);
            htfHighSlice = htfHighSlice.map(val => parseFloat(val[2]));
            let maxInRange = Math.max(...htfHighSlice);
            
            return highAtHigh >= maxInRange
        }
        if ((hhll.type === "LL")) {
            let lowAtlow = candleData[hhll.index][3];
            let timeDetractmentIndex = (candleData[hhll.index - 2][0] % 3600000) / 900000;

            let upperIndex = (((lookbackNum - 1) - timeDetractmentIndex) % lookbackNum);
            let lowerIndex = lookbackNum - 1 - upperIndex;
            let htfLowSlice = candleData.slice(hhll.index - 2 - upperIndex, hhll.index - 2 + lowerIndex + 1);
            htfLowSlice = htfLowSlice.map(val => parseFloat(val[3]));
            let maxInRange = Math.min(...htfLowSlice);

            // if (hhll.index === 72) {
            //     console.log(hhll.index - 2)
            //     console.log("upperIndex", upperIndex)
            //     console.log("lowerIndex", lowerIndex)
            //     console.log(htfLowSlice)
            // }
            
            return lowAtlow <= maxInRange
        }
        return false
    });

    let result = [];
    let firstType;
    for (let i = 0; i < allTimeFractals.length - 2; i++) {
        if (i === 0) {
            firstType = allTimeFractals[i].type;
        }
        let curType = allTimeFractals[i].type;
        let temp = [allTimeFractals[i].index];

        for (let j = i + 1; j < allTimeFractals.length - 2; j++) {
            let isNextSame = allTimeFractals[j].type === curType
            if (isNextSame) {
                temp.push(allTimeFractals[j].index)
                i++
            } else {
                j = allTimeFractals.length - 2
            }
        }
        result.push(temp[temp.length - 1]);
    }
    
    result = result.map((val, i) => {
        if (i % 2 === 0) {
            // return parseFloat(candleData[val][firstType === "LL" ? 3 : 2])
            return {
                index: val,
                type: firstType === "LL" ? "LL" : "HH",
                price: parseFloat(candleData[val][firstType === "LL" ? 3 : 2])
            }
        } else {
            // return parseFloat(candleData[val][firstType === "LL" ? 2 : 3])
            return {
                index: val,
                type: firstType === "LL" ? "HH" : "LL",
                price: parseFloat(candleData[val][firstType === "LL" ? 2 : 3])
            }
        }
    })

    return result
}

function convertToZigZag(strat, candleData, fractalArray) {
    let sorted = fractalArray.map((val, i) => {
        if (val.top || val.bot) {
            return {
                index: i + 2,
                type: val.top ? "TOP" : "BOT",
                price: candleData[i + 2][val.top ? 2 : 3]
            }
        } else {
            return null
        }
    });
    sorted = sorted.filter(val => !!val);

    let result = [];
    for (let i = 0; i < sorted.length - 3; i++) {
        let curType = sorted[i].type;
        let temp = [sorted[i].index];

        for (let j = i + 1; j < sorted.length - 2; j++) {
            let isNextSame = sorted[j].type === curType
            if (isNextSame) {
                temp.push(sorted[j].index)
                i++
            } else {
                j = sorted.length - 2
            }
        }
        result.push({
            index: temp[temp.length - 1],
            type: curType,
            price: parseFloat(candleData[temp[temp.length - 1]][curType === "TOP" ? 2 : 3])
        })
    }

    return result;
}

function fractal(strat, candleData) {
    candleData = candleData.slice(0, candleData.length - 1)
    candleData.reverse();

    let finalPriceArray;
    let fractalArray = getFractalArray(strat, [...candleData]);
    
    if (strat.settings.useTimeFractals) {
        let highHighLowerLows = getHHLLArray(strat, [...candleData], fractalArray);
        finalPriceArray = getTimeFrameArray(strat, [...candleData], highHighLowerLows);
    } else {
        finalPriceArray = convertToZigZag(strat, [...candleData], fractalArray);
    }

    console.log(finalPriceArray)
}

module.exports = fractal;