const strats = require("../../config.js").strats;
const cs = require("../general/chalkSpec");
const getGMXPositions = require("../defi/gmx/getGMXPositions");
const getPairData = require("../biananceAPIs/getPairData.js");
const getLatestRaw = require("../biananceAPIs/getLatestRaw.js");
const getNewPositionProfile = require("../indicators/risk/getNewPositionProfile");
const closePosition = require("../defi/gmx/closePosition");

let tokens = {
    "AVAXUSDT": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", //avax
    "ETHUSDT":  "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", //weth
    "BTCUSDT":  "0x50b7545627a5162F82A992c33b87aDc75187B218", //wbtc
}

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

async function positionManager() {
    
    for (let i = 0; i < strats.length; i++) {
        global.chain = strats[i].wallet.chain;

        cs.process("Checking Positions: " + strats[i].wallet.public);
        let curPositions = await getGMXPositions(strats[i].wallet.public, tokens[strats[i].token]);
        let longTime  = parseInt(curPositions.longTime);
        let shortTime = parseInt(curPositions.shortTime);

        let curTime = longTime > 0 ? longTime : shortTime > 0 ? shortTime : 0;
        let isLong  = longTime > 0;

        if (curTime > 0) {
            cs.process("Position detected");

            curTime *= 1000;
            let roundedTime = (curTime - (curTime % (15000 * 60)));
            let pairData = await getPairData(strats[i].token, strats[i].timeframe, 1000);
            let latestCandle = pairData[pairData.length - 1];
            

            pairData = pairData.filter(val => val[6] <= (roundedTime + (15000 * 60)));

            let posProfile = getNewPositionProfile(strats[i].rulesets[0].options, 100, pairData, isLong, pairData[pairData.length - 1][4]);
            let SL = isLong ? posProfile.longSL : posProfile.shortSL;
            let TP = isLong ? posProfile.longTp : posProfile.shortTp;


            let shouldPositionBeClosed = false;
            let timeNow = new Date().getTime();
            let hasBeenMoreThanOneCandle = (roundedTime + (timemap[strats[i].timeframe])) < timeNow;

            if (hasBeenMoreThanOneCandle) {
                cs.process("Position existed > 1 timeframe");
            } else {
                cs.process("Position within 1 timeframe.");
            }

            let curPrice = await getLatestRaw(strats[i].token);
            if (!!curPrice) {
                curPrice = parseFloat(curPrice.price);
            }

            if (isLong) {
                if (hasBeenMoreThanOneCandle) {
                    console.log("TP", TP)
                    console.log("SL", SL)
                    console.log("latestCandle[2]", latestCandle[2])
                    console.log("latestCandle[3]", latestCandle[3])
                    if (latestCandle[2] >= TP) shouldPositionBeClosed = true;
                    if (latestCandle[3] <= SL) shouldPositionBeClosed = true;
                } else {
                    if (curPrice >= TP) shouldPositionBeClosed = true;
                    if (curPrice <= SL) shouldPositionBeClosed = true;    
                }
            } else {
                if (hasBeenMoreThanOneCandle) {
                    console.log("TP", TP)
                    console.log("SL", SL)
                    console.log("latestCandle[2]", latestCandle[2])
                    console.log("latestCandle[3]", latestCandle[3])
                    if (latestCandle[3] <= TP) shouldPositionBeClosed = true;
                    if (latestCandle[2] >= SL) shouldPositionBeClosed = true;
                } else {
                    if (curPrice <= TP) shouldPositionBeClosed = true;
                    if (curPrice >= SL) shouldPositionBeClosed = true;
                }
            }

            if (shouldPositionBeClosed) {
                cs.process("Closing " + (isLong ? "Long" : "Short"));
                await closePosition(strats[i], curPrice);
                cs.win("Position closed");
            }
        } else {
            cs.win("No position to monitor");
        }
    }
}

// async function positionManager() {
//     let curTime = new Date().getTime();
//     let cycleDelay = 1000 * 60;

//     let initDelay = ((cycleDelay - (curTime % cycleDelay))) + (500 * 60);

//     console.log("Init delay: ", initDelay)
//     await sleep(initDelay);

//     while (true) {
//       cs.indexer()
//       let startTime = new Date();
//       let timeInX = startTime.getTime() + (1000 * 60);

//       console.log("Calling at:  " + formatDate(startTime) + " - " + startTime.getTime());
//       try {
//         await runManager();
//       } catch (error) {
//         console.log("Fatal error: " + error);
//       }

//       let endTime = new Date();
//       if (endTime.getTime() > timeInX) {
//           continue;
//       } else {
//           await sleep(Math.floor((timeInX - endTime)));
//       }
//     };
// }

module.exports = positionManager;