const strats = require("../../config.js").strats;
const formatDate = require("../general/formatDate");
const sleep = require("../general/sleep");
const cs = require("../general/chalkSpec");

async function runManager() {
    let walletsToHandle = strats.map(val => val.wallet);
    walletsToHandle = walletsToHandle.filter((value, index, self) => index === self.findIndex((t) => (t.public === value.public)));
    
    // For each wallet ->
    // Get positions - check lastIncreasedTime in geTPositions

    // if pos get binance data
    // feed in slice per indicator at the inception time of the position
}

async function keeper() {
    let curTime = new Date().getTime();
    let cycleDelay = 500 * 60;

    let initDelay = ((cycleDelay - (curTime % cycleDelay)));

    console.log("Init delay: ", initDelay)
    await sleep(initDelay);

    while (true) {
      cs.indexer()
      let startTime = new Date();
      let timeInX = startTime.getTime() + (1000 * 60);

      console.log("Calling at:  " + formatDate(startTime) + " - " + startTime.getTime());
      try {
        await runManager();
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

module.exports = keeper;