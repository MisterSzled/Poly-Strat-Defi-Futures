const strats = require("../../config.js").strats;
const formatDate = require("../general/formatDate");
const sleep = require("../general/sleep");
const cs = require("../general/chalkSpec");
const cleanWallet = require("../defi/keeper/cleanWallet");

async function runKeeper() {
    let walletsToHandle = strats.map(val => val.wallet);
    walletsToHandle = walletsToHandle.filter((value, index, self) => index === self.findIndex((t) => (t.public === value.public)));
    
    for (let i = 0; i < walletsToHandle.length; i++) {
        global.chain = walletsToHandle[i].chain;

        cs.process("Cleaning wallet: " + walletsToHandle[i].public);
        await cleanWallet(walletsToHandle[i]);
        cs.win("Cleaned wallet: " + walletsToHandle[i].public + "\n")
    }
}

async function keeper() {
    let curTime = new Date().getTime();
    let cycleDelay = (15000 * 60) + (7500 * 60);

    let initDelay = ((cycleDelay - (curTime % cycleDelay)) + (1000 * 10)) + (7500 * 60);

    console.log("Init delay: ", initDelay)
    await sleep(initDelay);

    while (true) {
      cs.indexer()
      let startTime = new Date();
      let timeInX = startTime.getTime() + (15000*60);

      console.log("Calling at:  " + formatDate(startTime) + " - " + startTime.getTime());
      try {
        await runKeeper();
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