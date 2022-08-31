const inquirer = require('inquirer');
const strats = require("./config.js").strats;

const livebot = require("./src/runtimes/livebot");
const keeper = require("./src/runtimes/keeper");
const updateHistoryData = require("./src/runtimes/updateHistoryData");
const backtrace = require("./src/runtimes/backtrace");

function buildQuestions () {
  let message = "\nWhich strat?\n";

  strats.forEach((strat, index) => {
      message += ((index + 1)  + " - - - " + strat.opName + "\n")
  });

  if (strats.length > 7) {
    console.log("Too many strats, comment some");
  }

  message += "\n";
  message += ((strats.length + 1)  + " - - - " + "Keeper" + "\n");
  message += "\n";
  message += ((strats.length + 2)  + " - - - " + "Update History" + "\n");
  message += "\n";
  message += ((strats.length + 3)  + " - - - " + "Backtrace" + "\n");

  return {type: 'input', name: 'acc', message: message};
}

inquirer.prompt(buildQuestions()).then(answers => {
  if ((answers.acc >= 1) && (answers.acc <= strats.length)) {
      livebot(strats[answers.acc - 1]);
  } else if (answers.acc - 1 === strats.length) {
      keeper();
  } else if (answers.acc - 1 === strats.length + 1) {
      updateHistoryData("BTCUSDT", "15m", 2);
  } else if (answers.acc - 1 === strats.length + 2) {
      backtrace("BTCUSDT", "15m");
  }
});

// backtrace("BTCUSDT", "15m");