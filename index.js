const inquirer = require('inquirer');
const strats = require("./config.js").strats;

const livebot = require("./src/runtimes/livebot");
const keeper = require("./src/runtimes/keeper");
const positionManager = require("./src/runtimes/positionManager");
const backtrace = require("./src/runtimes/backtrace");
const multiThreadStrats = require("./src/runtimes/findBestStrat");

// function buildQuestions () {
//   let message = "\nWhich strat?\n";
//   strats.forEach((strat, index) => {
//       message += ((index + 1)  + " - - - " + strat.opName + "\n")
//   });
//   if (strats.length > 7) {
//     console.log("Too many strats, comment some");
//   }

//   message += "\n";
//   message += ((strats.length + 1)  + " - - - " + "Keeper" + "\n");
//   message += "\n";
//   message += ((strats.length + 2)  + " - - - " + "Position Manager" + "\n");

//   return {type: 'input', name: 'acc', message: message};
// }

// function askStrat() {
//   let message = "\nWhich strat?\n";
//   strats.forEach((strat, index) => {
//     message += ((index + 1)  + " - - - " + strat.opName + "\n")
//   });
//   message += "\n";
//   return {type: 'input', name: 'acc', message: message};
// }
// function askMonths () {
//   let message = "\nHow many months back count the current month as 1?\n";
//   message += "\n";
//   return {type: 'input', name: 'acc', message: message};
// }

// inquirer.prompt(buildQuestions()).then(answers => {
//   if ((answers.acc >= 1) && (answers.acc <= strats.length)) {
//         livebot(strats[answers.acc - 1]);
//   } else if (answers.acc - 1 === strats.length) {
//         keeper();
//   } else if (answers.acc - 1 === strats.length + 1) {
//         positionManager();
//   }
// });

// livebot(strats[3]);
// multiThreadStrats();
positionManager();