const inquirer = require('inquirer');
const strats = require("./config.js").strats;
const main = require("./src/main.js");
const formatDate = require("./src/general/formatDate");
const sleep = require("./src/general/sleep");
const cs = require("./src/general/chalkSpec")

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

function buildQuestions () {
  let message = "\nWhich strat?\n";

  strats.forEach((strat, index) => {
      message += ((index + 1)  + " - - - " + strat.opName + "\n")
  });

  return {type: 'input', name: 'acc', message: message};
}

inquirer.prompt(buildQuestions()).then(answers => {
  if ((answers.acc >= 1) && (answers.acc <= strats.length)) {
      runLiveBot(strats[answers.acc - 1]);
  }
});

async function runLiveBot (strat) {
    let curTime = new Date().getTime();
    let cycleDelay = timemap[strat.timeframe];

    let initDelay = (cycleDelay - (curTime % cycleDelay)) + (1000 * 10);

    console.log("Init delay: ", initDelay)
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
// runLiveBot(strats[0])

