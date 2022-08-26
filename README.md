# Poly-Strat-Defi-Futures

Module and configurable runner and backtester within Defi

## Setting up config file

### Universal

Config should contain the universal obj which stores information universally accessed with regard to the data which can be vended to the indicators. For binance the largest query available is 1000, for others it may be more. Most indicators will require a minimum length of data to operate at all let alone effectively so check if this is the case.

>const universal = {
>  maxLookBack: 1000
>}

### Strats Obj

The other member of the config file should contain all strats to be run with their respective wallets included per strat. The base config is of the following form.

>let strats = [
>  {} // A strat
>]

### Individual Strats

The other member of the config file should contain all strats to be run with their respective wallets included per strat. The base config is of the following form.

>{
>    //Wallet
>    wallet : {
>      public: "",
>      priv: ""
>    },
>    // Program settings
>    opName: "BoomHullVolOsc BTC 15m", 
>
>    // Core strat information
>    token: "BTCUSDT", // "BTCUSDT", "ETHUSDT", "AVAXUSDT"
>    timeframe: "15m",  //1m 5m 15m 30m 1h 2h 4h 1d
>
>    options: {
>      // Risk settings
>      percentageRiskedPerTrade: 25, // min 1 max 98
>      profitFactor: 2.78, // This predominantly effects how long term your positions are
>
>      // GMX settings
>      useLimitOrders: false,     // Set GMX limit orders when position is opened
>      gmxLimitAdjustment: 0.999, // 1 is no adjustment - tightens strat defined SL/TP because GMX is a cunt
>    },
>
>    core: {
>      swingHighLowLookbackLength: 25,
>      atrLength: 14
>    },
>
>    indicators: [
>      {
>        name: "mhull",
>        settings: {
>          source: "close",       
>          hullVariation: "HMA",  
>          length: 250,           
>          lengthMultiplier: 2.6, 
>          useHtf: false,         
>          higherTimeframe: "4h",
>        }
>      }
>    ],
>  }

#### wallet
Contains the public and private key of the wallet this strat will be run from

#### opName
The name of this particular strat - will be used to identify said strat in terminal when selecting

#### token
The name of the tokenpair which will be passed to the API to collect the current token information, for binance "BTCUSDT", "ETHUSDT", "AVAXUSDT" etc

#### timeFrame
The time frame which will be passed to the API along with token pair to obtain current token information to be run with e.g. 1m 5m 15m 30m 1h 2h 4h 1d

#### options
Contains the risk setting as well as the perp-future service provider specific settings

##### percentageRiskedPerTrade
The near approximate % of the acc you will LOSE when any given position is wrong

##### profitFactor
This factor determines how far reaching any position will be relative to the current identified swing highs and lows

##### useLimitOrders
If checked the account will set and manage limit orders at position inception

##### gmxLimitAdjustment
If limit orders are set - this factor will tighten the calculated targets to account for delay in order filling. E.g.: 0.99

#### swingHighLowLookbackLength
This determines the number of candles back to be checked when calculating current highs and lows for TP/SL target calculation
