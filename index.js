const inquirer = require('inquirer');
const strats = require("./config.js").strats;

const livebot = require("./src/runtimes/livebot");
const keeper = require("./src/runtimes/keeper");
const updateHistoryData = require("./src/runtimes/updateHistoryData");
const backtrace = require("./src/runtimes/backtrace");

let tokenArray = ["BTCUSDT", "ETHUSDT", "AVAXUSDT", "LINKUSDT", "UNIUSDT"];
let timeArray  = ["1m", "5m", "15m", "30m", "1h", "2h", "4h", "1d"];

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

function askStrat() {
  let message = "\nWhich strat?\n";
  strats.forEach((strat, index) => {
    message += ((index + 1)  + " - - - " + strat.opName + "\n")
  });
  message += "\n";
  return {type: 'input', name: 'acc', message: message};
}
function askToken () {
  let message = "\nWhich token?\n";
  tokenArray.forEach((tkn, index) => {
    message += ((index + 1)  + " - - - " + tkn + "\n")
  });
  message += "\n";
  return {type: 'input', name: 'acc', message: message};
}
function askTime () {
  let message = "\nWhich timeframe?\n";
  timeArray.forEach((tkn, index) => {
    message += ((index + 1)  + " - - - " + tkn + "\n")
  });
  message += "\n";
  return {type: 'input', name: 'acc', message: message};
}
function askMonths () {
  let message = "\nHow many months back count the current month as 1?\n";
  message += "\n";
  return {type: 'input', name: 'acc', message: message};
}

inquirer.prompt(buildQuestions()).then(answers => {
  if ((answers.acc >= 1) && (answers.acc <= strats.length)) {
      livebot(strats[answers.acc - 1]);
  } else if (answers.acc - 1 === strats.length) {
      keeper();
  } else if (answers.acc - 1 === strats.length + 1) {
      inquirer.prompt(askToken()).then(tknAns => {
        let token = tokenArray[tknAns.acc - 1];
        inquirer.prompt(askTime()).then(timeAns => {
          let time = timeArray[timeAns.acc - 1];
          inquirer.prompt(askMonths()).then(monthsAns => {
            let monthsback = monthsAns.acc;
            updateHistoryData(token, time, monthsback);
          });
        });
      });
  } else if (answers.acc - 1 === strats.length + 2) {
      inquirer.prompt(askStrat()).then(stratAns => {
        let stratPick = strats[stratAns.acc - 1];
        backtrace(stratPick.token, stratPick.timeframe);
      });
  }
});