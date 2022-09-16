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

function getShapes(priceSlice) {
    let x = priceSlice[4].price;
    let a = priceSlice[3].price;
    let b = priceSlice[2].price;
    let c = priceSlice[1].price;
    let d = priceSlice[0].price;

    // console.log("x ", x)
    // console.log("a ", a)
    // console.log("b ", b)
    // console.log("c ", c)
    // console.log("d ", d + "\n")

    let xab = Math.abs(b - a) / Math.abs(x - a);
    let xad = Math.abs(a - d) / Math.abs(x - a);
    let abc = Math.abs(b - c) / Math.abs(a - b);
    let bcd = Math.abs(c - d) / Math.abs(b - c);

    // console.log("xab ", xab);
    // console.log("xad ", xad);
    // console.log("abc ", abc);
    // console.log("bcd ", bcd + "\n");

    let isBat = (_mode) => {
        let _xab = (xab >= 0.382) && (xab <= 0.5);
        let _abc = (abc >= 0.382) && (abc <= 0.886);
        let _bcd = (bcd >= 1.618) && (bcd <= 2.618);
        let _xad = (xad <= 0.886);
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c));
    }
    let isAltBat = (_mode) => {
        let _xab = xab <= 0.382
        let _abc = (abc >= 0.382) && (abc <= 0.886)
        let _bcd = (bcd >= 2.0) && (bcd <= 3.618)
        let _xad = (xad <= 1.13)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c));
    }
    let isButterfly = (_mode) => {
        let _xab = xab <= 0.786
        let _abc = (abc >= 0.382) && (abc <= 0.886)
        let _bcd = (bcd >= 1.618) && (bcd <= 2.618)
        let _xad = (xad >= 1.27) && (xad <= 1.618)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isABCD = (_mode) => {
        let _abc = (abc >= 0.382) && (abc <= 0.886)
        let _bcd = (bcd >= 1.13) && (bcd <= 2.618)
        return _abc && _bcd && (_mode == 1 ? (d < c) : (d > c))
    }
    let isGartley = (_mode) => {
        let _xab = (xab >= 0.5) && (xab <= 0.618) // 0.618
        let _abc = (abc >= 0.382) && (abc <= 0.886)
        let _bcd = (bcd >= 1.13) && (bcd <= 2.618)
        let _xad = (xad >= 0.75) && (xad <= 0.875) // 0.786
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isCrab = (_mode) => {
        let _xab = (xab >= 0.75) && (xab <= 0.875) // 0.886
        let _abc = (abc >= 0.382) && (abc <= 0.886)
        let _bcd = (bcd >= 2.0) && (bcd <= 3.618)
        let _xad = (xad >= 1.5) && (xad <= 1.625) // 1.618
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isShark = (_mode) => {
        let _xab = (xab >= 0.5) && (xab <= 0.875) // 0.886
        let _abc = (abc >= 1.13) && (abc <= 1.618)
        let _bcd = (bcd >= 1.27) && (bcd <= 2.24)
        let _xad = (xad >= 0.88) && (xad <= 1.13)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let is5o = (_mode) => {
        let _xab = (xab >= 1.13) && (xab <= 1.618)
        let _abc = (abc >= 1.618) && (abc <= 2.24)
        let _bcd = (bcd >= 0.5) && (bcd <= 0.625) // 0.5
        let _xad = (xad >= 0.0) && (xad <= 0.236) // negative?
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isWolf = (_mode) => {
        let _xab = (xab >= 1.27) && (xab <= 1.618)
        let _abc = (abc >= 0) && (abc <= 5)
        let _bcd = (bcd >= 1.27) && (bcd <= 1.618)
        let _xad = (xad >= 0.0) && (xad <= 5)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isHnS = (_mode) => {
        let _xab = (xab >= 2.0) && (xab <= 10)
        let _abc = (abc >= 0.90) && (abc <= 1.1)
        let _bcd = (bcd >= 0.236) && (bcd <= 0.88)
        let _xad = (xad >= 0.90) && (xad <= 1.1)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isConTria = (_mode) => {
        let _xab = (xab >= 0.382) && (xab <= 0.618)
        let _abc = (abc >= 0.382) && (abc <= 0.618)
        let _bcd = (bcd >= 0.382) && (bcd <= 0.618)
        let _xad = (xad >= 0.236) && (xad <= 0.764)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }
    let isExpTria = (_mode) => {
        let _xab = (xab >= 1.236) && (xab <= 1.618)
        let _abc = (abc >= 1.000) && (abc <= 1.618)
        let _bcd = (bcd >= 1.236) && (bcd <= 2.000)
        let _xad = (xad >= 2.000) && (xad <= 2.236)
        return _xab && _abc && _bcd && _xad && (_mode == 1 ? (d < c) : (d > c))
    }

    return {
        isBat:      {bull: isBat(1), bear: isBat(-1)}, 
        isAltBat:   {bull: isAltBat(1), bear: isAltBat(-1)}, 
        isButterfly:{bull: isButterfly(1), bear: isButterfly(-1)}, 
        isABCD:     {bull: isABCD(1), bear: isABCD(-1)}, 
        isGartley:  {bull: isGartley(1), bear: isGartley(-1)}, 
        isCrab:     {bull: isCrab(1), bear: isCrab(-1)}, 
        isShark:    {bull: isShark(1), bear: isShark(-1)}, 
        is5o:       {bull: is5o(1), bear: is5o(-1)}, 
        isWolf:     {bull: isWolf(1), bear: isWolf(-1)}, 
        isHnS:      {bull: isHnS(1), bear: isHnS(-1)}, 
        isConTria:  {bull: isConTria(1), bear: isConTria(-1)}, 
        isExpTria:  {bull: isExpTria(1), bear: isExpTria(-1)}, 
    }
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

    // x4-a3-b2-c1-d0
    let shapeRecognitionRes = 0;
    if (strat.settings.useShapeRecognition) {
        let shapes0 = getShapes([...finalPriceArray].slice(0, 5))
        let shapes1 = getShapes([...finalPriceArray].slice(1, 6))

        if (
            (shapes0.isBat["bull"]       && !shapes1.isBat["bull"])       ||
            (shapes0.isAltBat["bull"]    && !shapes1.isAltBat["bull"])    ||
            (shapes0.isButterfly["bull"] && !shapes1.isButterfly["bull"]) ||
            (shapes0.isABCD["bull"]      && !shapes1.isABCD["bull"])      ||
            (shapes0.isGartley["bull"]   && !shapes1.isGartley["bull"])   ||
            (shapes0.isCrab["bull"]      && !shapes1.isCrab["bull"])      ||
            (shapes0.isShark["bull"]     && !shapes1.isShark["bull"])     ||
            (shapes0.is5o["bull"]        && !shapes1.is5o["bull"])        ||
            (shapes0.isWolf["bull"]      && !shapes1.isWolf["bull"])      ||
            (shapes0.isHnS["bull"]       && !shapes1.isHnS["bull"])       ||
            (shapes0.isConTria["bull"]   && !shapes1.isConTria["bull"])   ||
            (shapes0.isExpTria["bull"]   && !shapes1.isExpTria["bull"])
        ) {
            shapeRecognitionRes = 1;
        }
        if (
            (shapes0.isBat["bear"]       && !shapes1.isBat["bear"])       ||
            (shapes0.isAltBat["bear"]    && !shapes1.isAltBat["bear"])    ||
            (shapes0.isButterfly["bear"] && !shapes1.isButterfly["bear"]) ||
            (shapes0.isABCD["bear"]      && !shapes1.isABCD["bear"])      ||
            (shapes0.isGartley["bear"]   && !shapes1.isGartley["bear"])   ||
            (shapes0.isCrab["bear"]      && !shapes1.isCrab["bear"])      ||
            (shapes0.isShark["bear"]     && !shapes1.isShark["bear"])     ||
            (shapes0.is5o["bear"]        && !shapes1.is5o["bear"])        ||
            (shapes0.isWolf["bear"]      && !shapes1.isWolf["bear"])      ||
            (shapes0.isHnS["bear"]       && !shapes1.isHnS["bear"])       ||
            (shapes0.isConTria["bear"]   && !shapes1.isConTria["bear"])   ||
            (shapes0.isExpTria["bear"]   && !shapes1.isExpTria["bear"])
        ) {
            shapeRecognitionRes = 1;
        }
    }

    if (strat.settings.useLightningBolt) {
        
    }

    return shapeRecognitionRes;
    // console.log(finalPriceArray)
}

module.exports = fractal;