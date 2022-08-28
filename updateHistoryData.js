const getXLastMonthsForToken = require("./src/backtest/getXLastMonthsForToken");

/**
 * Calculates the hull moving average and returns long or short when the current candle is polar to the penultimate one and the current close
 * @param  {[string]}  token           "BTCUSDT"/"ETHUSDT" a valid binance token pair
 * @param  {[string]}  tokenTimeFrame  "1h" / "15m" a valid binance timeframe
 * @param  {[int]}     monthsbackl     number of months to checkback on
 * @return {[undefined]}               -
 */
getXLastMonthsForToken(
    "BTCUSDT",
    "15m",
    1
);