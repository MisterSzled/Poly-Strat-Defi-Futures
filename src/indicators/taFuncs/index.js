const alma = require("./alma");
const atr = require("./atr");
const swingHiLo = require("./swingHiLo");
const bolingerbands = require("./bolingerbands");
const stdev = require("./stdev");
const sma = require("./sma");
const bbw = require("./bbw");

let taFuncs = {
    swingHiLo: swingHiLo,

    alma: alma,
    atr: atr,
    bolingerbands: bolingerbands,
    bbw: bbw,
    stdev: stdev,
    sma: sma,
}

module.exports = taFuncs