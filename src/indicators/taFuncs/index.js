const alma = require("./alma");
const atr = require("./atr");
const swingHiLo = require("./swingHiLo");
const bolingerbands = require("./bolingerbands");
const stdev = require("./stdev");
const sma = require("./sma");
const bbw = require("./bbw");
const cci = require("./cci");
const cmo = require("./cmo");
const change = require("./change");

let taFuncs = {
    swingHiLo: swingHiLo,

    alma: alma,
    atr: atr,
    bolingerbands: bolingerbands,
    bbw: bbw,
    stdev: stdev,
    sma: sma,
    cci: cci,
    cmo: cmo,
    change: change,
}

module.exports = taFuncs