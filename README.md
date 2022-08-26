# Poly-Strat-Defi-Futures

Module and configurable runner and backtester within Defi

## Setting up config file

### Universal

Config should contain the universal obj which stores information universally accessed with regard to the data which can be vended to the indicators. For binance the largest query available is 1000, for others it may be more. Most indicators will require a minimum length of data to operate at all let alone effectively so check if this is the case.

```
const universal = {
  maxLookBack: 1000
}
```

### Strats Obj

The other member of the config file should contain all strats to be run with their respective wallets included per strat. The base config is of the following form.

```
let strats = [
  {} // A strat
]
```

### Individual Strats

The other member of the config file should contain all strats to be run with their respective wallets included per strat. The base config is of the following form.

```
{
    // Wallet
    wallet : {
        public: "",                     // Public Key
        priv: ""                        // Private Key
    },

    // Program settings
    opName: "BoomHullVolOsc ETH 15m",   // Specific name for THIS strat with these settings

    // Core strat information
    token: "ETHUSDT",                   // "BTCUSDT", "ETHUSDT", "AVAXUSDT"
    timeframe: "15m",                   //1m 5m 15m 30m 1h 2h 4h 1d

    // Risk settings
    options: {
        percentageRiskedPerTrade: 25,   // min 1 max 98
        profitFactor: 3,                // How far reaching you are in your SL/TP settings
        swingHighLowLookbackLength: 30, // The number of candles that are back checked for determining current swing highs and lows
        atrLength: 14,

        // GMX settings
        useLimitOrders: false,          // Set GMX limit orders when position is opened
        gmxLimitAdjustment: 0.999,      // 1 is no adjustment - tightens strat defined SL/TP because GMX is a cunt
    },

    // Indicator to be checked for this strat
    indicators: [
        {
            name: "mhull",
            settings: {
                source: "close",        // Only uses close atm
                hullVariation: "HMA",   // Only uses HMA atm
                length: 220,            // Max value is 2x < 1000 === 499
                lengthMultiplier: 2.4,  // This can be used but is literally the same as simply increaseing length
                useHtf: false,          // NOT IMPLEMENTED
                higherTimeframe: "4h",  // PART OF useHtf NOT IMPLEMENTED
            }
        }
    ],
}
```

- wallet
    - Contains the public and private key of the wallet this strat will be run from
    - Every wallet running needs USDC ("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E") and gas to opperate.

- opName
    - The name of this particular strat - is used to identify said strat in terminal when selecting

- token
    - The name of the tokenpair which is passed to the API to collect the current token information, for binance "BTCUSDT", "ETHUSDT", "AVAXUSDT" etc

- timeFrame
    - The time frame which is passed to the API along with token pair to obtain current token information to be run with e.g. 1m 5m 15m 30m 1h 2h 4h 1d

- options
    - Contains the risk setting as well as the perp-future service provider specific settings

- percentageRiskedPerTrade
    - The near approximate % of the acc you will LOSE when any given position is wrong

- profitFactor
    - This factor determines in part how far reaching the SL and TP points are.

- useLimitOrders
    - If checked the account will set and manage limit orders at position inception

- gmxLimitAdjustment
    - If useLimitOrders is true this factor will tighten the calculated targets to account for delay in order filling. E.g.: 0.99

- swingHighLowLookbackLength
    - This determines the number of candles back to be checked when calculating current highs and lows for TP/SL target calculation
