const fs = require('fs');
const cs = require("../general/chalkSpec");
const strats = require("../../config").strats
const processIndicators = require("../main").processIndicators
const getNewPositionProfile = require("../indicators/risk/getNewPositionProfile");

let timemap = {
    "1m": 1000 * 60,
    "5m": 5000 * 60,
    "15m": 15000 * 60,
    "30m": 30000 * 60,
    "1h": 60000 * 60,
    "2h": 120000 * 60,
    "4h": 240000 * 60,
    "1d": 144000 * 60,
}

let wallet = {
    curUSD: 250,
    prevUSD: 0,
    
    curPositionOpen:   0,
    curPositionAmtIn:  0,
    curPositionLev:    0,
    curPositionSL:     0,
    curPositionTP:     0,
    curPositionIsLong: 0,

    positionOpens: [],
    positionClosed: [],

    totalLongsIndicated:  0,
    totalShortsIndicated: 0,
    longWins: 0,
    shortWins: 0,
    longs: 0,
    shorts: 0,
}

const stratIndex = 0;

function backtrace(token, timeframe) {
    let path = "./src/backtest/history/" + token + "/" + timeframe + "/";
    let files = fs.readdirSync(path);
    let historyArray = [];

    // Merge data into single array
    for (let i = 0; i < files.length; i++) {
        let file = fs.readFileSync(path + files[i], {encoding:'utf8', flag:'r'});
        historyArray = historyArray.concat(JSON.parse(file));
    }

    // Check it flows in time correctly without gaps
    for (let i = 0; i < historyArray.length - 2; i++) {
        if (parseInt(historyArray[i][0]) !== parseInt(historyArray[i+1][0]) - (timemap[timeframe])) {
            cs.fail("Data corrupt at: " + i);
            throw new Error("Data corrupt");
        }
    }
    cs.win("Data merged and checked");

    console.log("INITIAL DATE OF START: ", new Date(parseInt(historyArray[1240][0])));

    //Run through strat
    for (let i = 1000; i < historyArray.length - 2; i++) {

        if (i % 1000 === 0) {
            console.log("Index: ", i, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
        }
        let mockSlice = historyArray.slice(i - 1000, i + 1);
        let finalResult = processIndicators(strats[stratIndex], mockSlice);

        let curPrice = mockSlice[mockSlice.length - 2][4];
        let lastHigh = mockSlice[mockSlice.length - 2][2];
        let lastLow  = mockSlice[mockSlice.length - 2][3];
        let curDate  = new Date(parseInt(mockSlice[mockSlice.length - 1][0]));

        if (finalResult !== 0) {
            console.log("i: ", i, " date: ", curDate);
        }

        // if (parseInt(mockSlice[mockSlice.length - 1][0]) === 1661388300000) {
        //     x++
        // }

        // Check open positions
        if (wallet.curPositionAmtIn > 0) {
            if (wallet.curPositionIsLong === "true") {
                // is in a long
                if (lastLow <= wallet.curPositionSL) {
                    // loss
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, wallet.curPositionSL, wallet.curPositionAmtIn, wallet.curPositionLev, true);
                    console.log("Long LOSS Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                } else if (lastHigh >= wallet.curPositionTP) {
                    // win
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, wallet.curPositionTP, wallet.curPositionAmtIn, wallet.curPositionLev, true);
                    console.log("Long WIN Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,
                        longWins: wallet.longWins + 1,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                }
            }else if (wallet.curPositionIsLong  === "false") {
                // is in a short
                if (lastHigh >= wallet.curPositionSL) {
                    // loss
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, wallet.curPositionSL, wallet.curPositionAmtIn, wallet.curPositionLev, false);
                    console.log("Short LOSS Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                } else if (lastLow <= wallet.curPositionTP) {
                    // win
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, wallet.curPositionTP, wallet.curPositionAmtIn, wallet.curPositionLev, false);
                    console.log("Short WIN Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,
                        shortWins: wallet.shortWins + 1,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                }
            }
        }

        if (Math.abs(finalResult) === 1) {
            if (finalResult === 1) {
                //Long indicated
                console.log("Indicating Long");

                wallet.totalLongsIndicated++;
                if ((wallet.curPositionOpen > 0) && (wallet.curPositionIsLong === "true")) {
                    console.log("Already in a long");
                    continue;
                }
                if (((wallet.curPositionOpen > 0) && (wallet.curPositionIsLong === "false"))) {
                    console.log("Already in a short but time to go long");
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, curPrice, wallet.curPositionAmtIn, wallet.curPositionLev, false);
                    console.log("Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    };
                    if (positionResult - wallet.curPositionAmtIn > 0) {
                        wallet = {
                            ...wallet,
                            shortWins: wallet.shortWins + 1
                        }
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                }
                let newPosProfile = getNewPositionProfile(strats[stratIndex], wallet.curUSD, mockSlice, true, curPrice);
                console.log("Opening long amtin: ", newPosProfile.longQty, " lev: ", newPosProfile.lev, " SL: ", newPosProfile.longSL, " TP: ", newPosProfile.longTp);
                wallet = {
                    ...wallet,
                    curUSD: wallet.curUSD - newPosProfile.longQty,
                    longs: wallet.longs + 1,
                    
                    curPositionOpen:   curPrice,
                    curPositionAmtIn:  newPosProfile.longQty,
                    curPositionLev:    newPosProfile.lev,
                    curPositionSL:     newPosProfile.longSL,
                    curPositionTP:     newPosProfile.longTp,
                    curPositionIsLong: "true",

                    positionOpens: [...wallet.positionOpens, {date: curDate, SL: newPosProfile.longSL, TP: newPosProfile.longTp, type: "long"}]
                };
                console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
            }
            if (finalResult === -1) {
                //Short indicated
                console.log("Indicating Short");

                wallet.totalShortsIndicated++;
                if ((wallet.curPositionOpen > 0) && (wallet.curPositionIsLong === "false")) {
                    console.log("Already in a short");
                    continue;
                } 
                if (((wallet.curPositionOpen > 0) && (wallet.curPositionIsLong === "true"))) {
                    console.log("Already in a long but time to go short");
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, curPrice, wallet.curPositionAmtIn, wallet.curPositionLev, true);
                    console.log("Delta: ", positionResult - wallet.curPositionAmtIn);

                    wallet = {
                        ...wallet,
                        curUSD: wallet.curUSD + positionResult,
                        curPositionOpen:   0,
                        curPositionAmtIn:  0,
                        curPositionLev:    0,
                        curPositionSL:     0,
                        curPositionTP:     0,
                        curPositionIsLong: 0,

                        positionClosed: [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}]
                    }
                    if (positionResult - wallet.curPositionAmtIn > 0) {
                        wallet = {
                            ...wallet,
                            longWins: wallet.longWins + 1
                        }
                    }
                    console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
                }
                let newPosProfile = getNewPositionProfile(strats[stratIndex], wallet.curUSD, mockSlice, false, curPrice);
                console.log("Opening short amtin: ", newPosProfile.shortQty, " lev: ", newPosProfile.lev, " SL: ", newPosProfile.shortSL, " TP: ", newPosProfile.shortTp);
                wallet = {
                    ...wallet,
                    curUSD: wallet.curUSD - newPosProfile.shortQty,
                    shorts: wallet.shorts + 1,
                    
                    curPositionOpen:   curPrice,
                    curPositionAmtIn:  newPosProfile.shortQty,
                    curPositionLev:    newPosProfile.lev,
                    curPositionSL:     newPosProfile.shortSL,
                    curPositionTP:     newPosProfile.shortTp,
                    curPositionIsLong: "false",

                    positionOpens: [...wallet.positionOpens, {date: curDate, SL: newPosProfile.shortSL, TP: newPosProfile.shortTp, type: "short"}]
                };
                console.log("Index: ", curDate, " wallet: ", wallet.curUSD, " + (" + wallet.curPositionAmtIn + ")");
            }
        }
    }
    console.log("FINAL WALLET");
    console.log(wallet);
}

function calculateClosePosition(openPrice, closePrice, amtIn, lev, isLong) {
    let initialSizeUSD = amtIn * lev;
    let initialTokenSize = initialSizeUSD / openPrice;
    let finalSizeUSD = initialTokenSize * closePrice; 

    let diff = finalSizeUSD - initialSizeUSD;

    if (isLong) {
        return amtIn + diff
    } else {
        return amtIn - diff
    }
}

module.exports = backtrace