const fs = require('fs');
const cs = require("../general/chalkSpec");
// const strats = require("../../config").strats
const processIndicators = require("../main").processIndicators
const getNewPositionProfile = require("../indicators/risk/getNewPositionProfile");
const chalk = require('chalk');
const truncateNum = require("../general/truncateNum");
const updateHistoryData = require("./updateHistoryData");

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

function resetWalletPosition () {
    wallet = {
        ...wallet,
        curPositionOpen:   0,
        curPositionAmtIn:  0,
        curPositionLev:    0,
        curPositionSL:     0,
        curPositionTP:     0,
        curPositionIsLong: 0,
    }
}
function resetWalletWhole () {
    wallet = {
        curUSD: 250,
        
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
}

let binanceGapList = [
    "1663803900000",
    "1632897900000",
    "1628819100000",
    "1628819100000",
    "1614995100000",
    "1618883100000",
    "1619323200000",
]

async function backtrace(strat, monthsback) {
    // Update the history folder to be used
    // await updateHistoryData(strat.token, strat.timeframe, monthsback + 2);
    
    let path = "./src/backtest/history/" + strat.token + "/" + strat.timeframe + "/";
    let files = fs.readdirSync(path);
    let historyArray = [];

    // Merge data into single array
    for (let i = 0; i < files.length; i++) {
        let file = fs.readFileSync(path + files[i], {encoding:'utf8', flag:'r'});
        historyArray = historyArray.concat(JSON.parse(file));
    }

    // Check it flows in time correctly without gaps
    for (let i = 0; i < historyArray.length - 2; i++) {
        if (parseInt(historyArray[i][0]) !== parseInt(historyArray[i+1][0]) - (timemap[strat.timeframe])) {
            // if (parseInt(historyArray[i][0]) === 1632897900000) {
            if (binanceGapList.includes(historyArray[i][0])) {
                // console.log("Gap at: " + new Date(parseInt(historyArray[i][0])));
            } else {
                console.log("Gap at: ", i);
                console.log(parseInt(historyArray[i][0]));
                console.log(parseInt(historyArray[i+1][0]));
                x++
            }
        }
    }
    cs.win("Data merged and checked");

    let millisAtTimeback = monthsback * 2592000000;
    let latestTimeStamp  = historyArray[historyArray.length - 1][0];
    let latestMinusTimeback = latestTimeStamp - millisAtTimeback;
    let startIndex = 0;
    for (let i = 0; i < historyArray.length; i++) {
        if (parseInt(historyArray[i][0]) === latestMinusTimeback) {
            startIndex = i;
            break;
        }
    }
    
    let wholeStart = new Date().getTime();
    console.log("INITIAL DATE OF START: ", new Date(parseInt(historyArray[startIndex][0])));
    for (let i = startIndex; i < historyArray.length - 2; i++) {

        let mockSlice = historyArray.slice(i - 1000, i + 1);

        // let start = new Date().getTime();
        let resArray = processIndicators(strat, mockSlice);

        let finalResult = 0;
        let finalIndex = 0;
        for (let i = 0; i < resArray.length; i++) {
            if (resArray[i].result !== 0) {
                finalIndex = resArray[i].index;
                finalResult = resArray[i].result;
            }
        }

        let curPrice = mockSlice[mockSlice.length - 2][4];
        let lastHigh = mockSlice[mockSlice.length - 2][2];
        let lastLow  = mockSlice[mockSlice.length - 2][3];
        let curDate  = new Date(parseInt(mockSlice[mockSlice.length - 1][0]));

        let isInPosition = wallet.curPositionAmtIn > 0;

        // if (wallet.curPositionAmtIn + wallet.curUSD < 100) {
        //     console.log("Borked")
        //     break;
        // }


        // console.log(parseInt(mockSlice[mockSlice.length - 1][0]))
        // if (parseInt(mockSlice[mockSlice.length - 1][0]) === (1666638900000)) {
        //     xxxx++
        // }

        // Check open positions
        if (isInPosition) {
            if (wallet.curPositionIsLong === "true") {
                // is in a long
                let loss = lastLow <= wallet.curPositionSL;
                let win  = lastHigh >= wallet.curPositionTP;
                if (loss || win) {
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, (loss ? wallet.curPositionSL : wallet.curPositionTP), wallet.curPositionAmtIn, wallet.curPositionLev, true);
                    wallet["curUSD"] = wallet.curUSD + positionResult;
                    wallet["positionClosed"] = [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}];
                    if (win) wallet["longWins"] = wallet.longWins + 1;

                    resString("Long ", loss, curDate, wallet.curUSD, positionResult - wallet.curPositionAmtIn);
                    resetWalletPosition();
                }
            } else if (wallet.curPositionIsLong  === "false") {
                // is in a short
                let loss = lastHigh >= wallet.curPositionSL;
                let win  = lastLow <= wallet.curPositionTP;
                if (loss || win) {
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, (loss ? wallet.curPositionSL : wallet.curPositionTP), wallet.curPositionAmtIn, wallet.curPositionLev, false);
                    wallet["curUSD"] = wallet.curUSD + positionResult;
                    wallet["positionClosed"] = [...wallet.positionClosed, {date: curDate, delta: positionResult - wallet.curPositionAmtIn}];
                    if (win) wallet["shortWins"] = wallet.shortWins + 1;

                    resString("Short", loss, curDate, wallet.curUSD, positionResult - wallet.curPositionAmtIn);
                    resetWalletPosition();
                }
            }
        }

        if (Math.abs(finalResult) === 1) {
            if (finalResult === 1) {
                //Long indicated
                wallet["totalLongsIndicated"] = wallet["totalLongsIndicated"] + 1;
                if (isInPosition && (wallet.curPositionIsLong === "true")) continue;
                if (isInPosition && (wallet.curPositionIsLong === "false")) {
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, curPrice, wallet.curPositionAmtIn, wallet.curPositionLev, false);
                    let delta = positionResult - wallet.curPositionAmtIn;

                    wallet["curUSD"] = wallet.curUSD + positionResult;
                    wallet["positionClosed"] = [...wallet.positionClosed, {date: curDate, delta: delta}];
                    resetWalletPosition();
                    if (delta > 0) wallet["shortWins"] = wallet["shortWins"] + 1;
                    resString("Short", delta < 0, curDate, wallet.curUSD, delta);
                }

                let newPosProfile = getNewPositionProfile(strat.rulesets[finalIndex].options, wallet.curUSD, mockSlice, true, curPrice);
                wallet = {
                    ...wallet,
                    curUSD: wallet.curUSD - newPosProfile.dollarAmt,
                    longs: wallet.longs + 1,
                    
                    curPositionOpen:   curPrice,
                    curPositionAmtIn:  newPosProfile.dollarAmt,
                    curPositionLev:    newPosProfile.lev,
                    curPositionSL:     newPosProfile.SL,
                    curPositionTP:     newPosProfile.TP,
                    curPositionIsLong: "true",

                    positionOpens: [...wallet.positionOpens, {date: curDate, SL: newPosProfile.SL, TP: newPosProfile.TP, type: "long"}]
                };
                openString("Long ", curDate, newPosProfile.dollarAmt, newPosProfile.lev, newPosProfile.SL, newPosProfile.TP, curPrice)
            }
            if (finalResult === -1) {
                //Short indicated
                wallet["totalShortsIndicated"] = wallet["totalShortsIndicated"] + 1;
                if (isInPosition && (wallet.curPositionIsLong === "false")) continue;
                if (isInPosition && (wallet.curPositionIsLong === "true")) {
                    let positionResult = calculateClosePosition(wallet.curPositionOpen, curPrice, wallet.curPositionAmtIn, wallet.curPositionLev, true);
                    let delta = positionResult - wallet.curPositionAmtIn;

                    wallet["curUSD"] = wallet.curUSD + positionResult;
                    wallet["positionClosed"] = [...wallet.positionClosed, {date: curDate, delta: delta}];
                    resetWalletPosition();
                    if (delta > 0) wallet["longWins"] = wallet["longWins"] + 1;
                    resString("Long ", delta < 0, curDate, wallet.curUSD, delta);
                }
                let newPosProfile = getNewPositionProfile(strat.rulesets[finalIndex].options, wallet.curUSD, mockSlice, false, curPrice);
                wallet = {
                    ...wallet,
                    curUSD: wallet.curUSD - newPosProfile.dollarAmt,
                    shorts: wallet.shorts + 1,
                    
                    curPositionOpen:   curPrice,
                    curPositionAmtIn:  newPosProfile.dollarAmt,
                    curPositionLev:    newPosProfile.lev,
                    curPositionSL:     newPosProfile.SL,
                    curPositionTP:     newPosProfile.TP,
                    curPositionIsLong: "false",

                    positionOpens: [...wallet.positionOpens, {date: curDate, SL: newPosProfile.SL, TP: newPosProfile.TP, type: "short"}]
                };
                openString("Short", curDate, newPosProfile.dollarAmt, newPosProfile.lev, newPosProfile.SL, newPosProfile.TP, curPrice);
            }
        }
    }

    wallet["winratio"] = (wallet.longWins + wallet.shortWins) / (wallet.longs + wallet.shorts);

    let worstStreak = wallet.positionClosed.reduce((res, n) => (n.delta < 0 ? res[res.length-1]++ : res.push(0), res), [0]);
    worstStreak = Math.max(...worstStreak);
    wallet["drawdown"] = 1 - ((1 - (strat.rulesets[0].options.percentageRiskedPerTrade/100))**worstStreak);

    console.log(wallet["curUSD"] + wallet["curPositionAmtIn"]);
    console.log("win: ", wallet["winratio"]);
    console.log("dd: ", wallet["drawdown"]);
    console.log("long: ", wallet["longs"]);
    console.log("shorts: ", wallet["shorts"]);
    console.log(new Date().getTime() - wholeStart);

    let finalWallet = {};
    finalWallet["curUSD"] = wallet["curUSD"] + wallet["curPositionAmtIn"];
    finalWallet["totalLongsIndicated"] = wallet["totalLongsIndicated"];
    finalWallet["totalShortsIndicated"] = wallet["totalShortsIndicated"];
    finalWallet["longWins"]  = wallet["longWins"];
    finalWallet["shortWins"] = wallet["shortWins"];
    finalWallet["longs"]     = wallet["longs"];
    finalWallet["shorts"]    = wallet["shorts"];
    finalWallet["winratio"]  = wallet["winratio"];
    finalWallet["drawdown"]  = wallet["drawdown"];
    //TEMP
    // finalWallet["indicators"]  = strat["indicators"];
    // finalWallet["options"]  = strat["options"];
    finalWallet["positionOpens"]  = wallet["positionOpens"];
    finalWallet["positionClosed"]  = wallet["positionClosed"];

    resetWalletWhole();
    return finalWallet;
}
function resString(type, isLoss, date, usd, delta) {
    console.log(type === "Short" ? chalk.red(type) : chalk.green(type), (isLoss ? chalk.redBright("LOSS") : chalk.greenBright("WIN ")), date.toUTCString().replaceAll(",", ""), " - ", truncateNum(usd,5), "(", truncateNum(delta, 5), ")");
}
function openString(type, date, amt, lev, sl, tp, openPrice) {
    console.log(
        type === "Short" ? chalk.red(type) : chalk.green(type), 
        chalk.cyanBright("OPEN"), 
        date.toUTCString().replaceAll(",", ""), 
        " - ", 
        truncateNum(amt, 5), 
        " Lev: ", 
        truncateNum(lev, 2), 
        " SL: ", 
        truncateNum(sl, 5), 
        " TP: ", 
        truncateNum(tp, 5),
        " Open: ",
        truncateNum(openPrice, 5)
        );
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