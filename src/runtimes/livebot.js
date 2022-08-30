const main = require("../main.js").main;
const formatDate = require("../general/formatDate");
const cs = require("../general/chalkSpec");
const sleep = require("../general/sleep");

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

async function livebot (strat) {
    let curTime = new Date().getTime();
    let cycleDelay = timemap[strat.timeframe];

    let initDelay = (cycleDelay - (curTime % cycleDelay)) + (1000 * 10);

    console.log("Init delay: ", initDelay);
    await sleep(initDelay);

    while (true) {
      cs.header(strat.opName)
      let startTime = new Date();
      let timeInX = startTime.getTime() + (15000*60);

      console.log("Calling at:  " + formatDate(startTime) + " - " + startTime.getTime());
      try {
        await main(strat);
      } catch (error) {
        console.log("Fatal error: " + error);
      }
      
      let endTime = new Date();
      if (endTime.getTime() > timeInX) {
          continue;
      } else {
          await sleep(Math.floor((timeInX - endTime)));
      }
    };
}

module.exports = livebot;