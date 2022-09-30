const cs = require("../../general/chalkSpec");

function findLiqudation(entryPrice, lev, isLong) {
    // let gmxCosts = 1
    let gmxCosts = 0.966

    let size = 1 * lev * gmxCosts;
    let size1p = size * 0.01;
    let lossAmt = 1 - size1p;

    let liqVal;
    if (isLong) liqVal = size - lossAmt
    else liqVal = size + lossAmt

    let sizeAsToken = size / entryPrice;
    return liqVal / sizeAsToken;
}

function findLevWhereSLAtLiqidation(entry, SL, isLong) {
    let levArray = [];
    for (let i = 1; i < 30; i += 0.1) {
      levArray.push({
        i: i,
        liq: findLiqudation(entry, i, isLong)
      });
    }

    return closest = levArray.reduce(function(prev, curr) {
      return (Math.abs(curr.liq - SL) < Math.abs(prev.liq - SL) ? curr : prev);
    });
}

function getAdjustedLeverageAndAmount(wallet, risk, entry, SL, isLong) {
    const lossRatioAtLiq = 0.7;
    let finalAmt, finalLev;

    let liqAtMaxLev = findLiqudation(entry, 30, isLong);

    // CHECKED AND WORKS
    if (isLong && (SL > liqAtMaxLev)) {
      cs.process("Long and use more dollar");

      let ratio = (entry - SL) / (entry - liqAtMaxLev);
      let idealAmt = wallet * (risk/100);
      let real = idealAmt / (ratio * lossRatioAtLiq);

      if (real > wallet) {
        cs.process("Capped wallet for max lev");
        real = wallet * 0.99;
      }

      finalAmt = real;
      finalLev = 30;
    }

    if (isLong && (liqAtMaxLev > SL)) {
      cs.process("Long and use less lev");

      let newSL = SL * 0.975;
      let closestLev = findLevWhereSLAtLiqidation(entry, newSL, isLong);
      
      let ratio = (entry - newSL) / (entry - closestLev.liq);
      let idealAmt = wallet * (risk/100);
      let real = idealAmt / (ratio * lossRatioAtLiq)

      if (real > wallet) {
        real = wallet * 0.99;
      }

      finalAmt = real;
      finalLev = closestLev.i;
    }

    if (!isLong && (SL < liqAtMaxLev)) {
      cs.process("Short and use more dollar");

      let ratio = (entry - SL) / (entry - liqAtMaxLev);
      let idealAmt = wallet * (risk/100);
      let real = idealAmt / (ratio * lossRatioAtLiq);

      if (real > wallet) {
        cs.process("Capped wallet for max lev");
        real = wallet * 0.99;
      }

      finalAmt = real;
      finalLev = 30;
    }

    if (!isLong && (SL > liqAtMaxLev)) {
      cs.process("Short and use less lev");

      let newSL = SL * 1.025;
      let closestLev = findLevWhereSLAtLiqidation(entry, newSL, isLong);
      
      let ratio = (entry - newSL) / (entry - closestLev.liq);
      let idealAmt = wallet * (risk/100);
      let real = idealAmt / (ratio * lossRatioAtLiq)

      if (real > wallet) {
        real = wallet * 0.99;
      }

      finalAmt = real;
      finalLev = closestLev.i;
    }

    return {
        amt: finalAmt,
        lev: finalLev
    }
}

module.exports = getAdjustedLeverageAndAmount