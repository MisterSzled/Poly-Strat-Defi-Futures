const chalk = require('chalk');
// const log = console.log;

const showLogging = true;
const log = showLogging ? console.log : () => {};

let long = (text)    => log(chalk.greenBright(text));
let longH = (text)   => log(chalk.greenBright.underline(text));
let short = (text)   => log(chalk.redBright(text));
let shortH = (text)  => log(chalk.redBright.underline(text));

let header = (text)  => log(chalk.yellowBright.underline(text));
let process = (text) => log(chalk.cyanBright(text));
let win = (text)     => log(chalk.greenBright(text));
let fail = (text)    => log(chalk.redBright(text));

let red = (text) => chalk.redBright(text);
let green = (text) => chalk.greenBright(text);

let indexer = () => log(chalk.yellowBright.bold(
    "<¥£$>«»<¥£$><¥£$¥£$¥£$¥£$¥£><¥£$>«»<¥£$>\n" +
    "<¥£$>«»<¥£$>░░░░░░░░░░░░░░░░<¥£$>«»<¥£$>\n" +
    "<¥£$>«»<¥£$>░░░░ KEEPER ░░░░<¥£$>«»<¥£$>\n" +
    "<¥£$>«»<¥£$>░░░░░░░░░░░░░░░░<¥£$>«»<¥£$>\n" +
    "<¥£$>«»<¥£$><¥£$¥£$¥£$¥£$¥£><¥£$>«»<¥£$>\n"
    ));

module.exports = {header, process, win, fail, indexer, long, short, longH, shortH, red, green};