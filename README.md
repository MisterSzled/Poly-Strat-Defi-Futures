# Poly-Strat-Defi-Futures  

**A modular and configurable trading and backtesting tool for DeFi.**  

*Warning: This is a trading tool. It uses your real wallets with real tokens and may contain bugs that will result in loss of funds. 
Use entirely at your own risk*

---

## **Abstract**  
Poly-Strat-Defi-Futures is a versatile DeFi trading framework designed to serve as a general-purpose tool for traders and developers.  

The platform enables users to execute strategies driven by customizable indicators, running in real-time via associated wallets with adjustable risk profiles. Additionally, the tool includes a multi-threaded backtester that generates performance reports for specific strategies over defined time periods. The backtester supports configurable noise levels and transaction cost simulations to provide realistic results.  

To ensure optimal performance, the system requires the accompanying "Keeper" service for live trading. This architecture was chosen to maximize throughput and minimize the risk of blocking transactions on the primary wallet threads.  

### **Key Features**  
- **Customizable Indicators**: The platform currently supports a variety of technical indicators. Adding new types of indicators — from sentiment analysis to a coin-flip — is as straightforward as adding a function call.  
- **DeFi Protocol Support**: Built-in support for GMX on Avalanche and Arbitrum. Adding support for additional protocols only requires creating a new configuration file with the appropriate token addresses.  
- **Backtesting Capabilities**: The multi-threaded backtester simulates strategy performance under realistic conditions, with options to adjust variables like entry noise and transaction costs.  

---

## **Disclaimer**  
**Important Note**: This project is currently non-functional due to outdated dependencies and will require updates to restore full functionality.  

While live trading and backtesting both operate, the backtesting interface is not user-friendly and requires apriori knowledge of the project for effective use. Resolving this issue however is not a large task.  
---  

## Keeper

Keeper scans all existing strats in your config file, extracts the wallets, and takes the following steps every 15mins on the 15m/2 to the hour basis. E.g. 15:07:30, then 15:22:30...
1. If any WETH is in the wallet. All WETH => USDC
2. If any WBTC is in the wallet. All WBTC => USDC
3. If current gas > 1.5. All gas - 1 => USDC
4. If current gas < 0.5. $10 => Gas
5. If limit orders are enabled, check for any unpaired orders and cancel them.

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
    },

    // Indicator to be checked for this strat
    indicators: [],
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

- swingHighLowLookbackLength
    - This determines the number of candles back to be checked when calculating current highs and lows for TP/SL target calculation

- indicators
    - This houses the indicators which will be used in the strat, it is an array of obj which represent the settings to be passed to the indicators

### Options

Universal options to be included regardless of risk profile type 
<br />
- percentageRiskedPerTrade
    - Defines the percentage of your *wallet*, not position, that will be lost in the ideal hit of the calcuated stop loss point

- reverse
    - Flips the indicated signals from the strat 

- profitFactor
    - Factor to be used to scale up the Take Profit point after base calculation

- riskFactor
    - Factor used to multiply up the calculated stop loss point, increase value to increase SL margins.

#### Swing and ATR 
DEFAULT pricer. Uses the average true range (ATR) and local swing extreams to price TP/SL
- atrLength
    - Value used by pricer to calculate average true range. Default 14.
- swingHighLowLookbackLength
    - Number of bars to lookback on for swing limits detection

### Indicators

#### Config

The objs which make up the contents of the indicators array each individually describe the settings for each indivdual indicator to be employed by the strat. <br />
The name of the indicator must match up with the file exported in './src/indicators/index.js'
<br />
To find the exact settings each indicator requires, inside each indicator file is a full description. In this case './src/indicators/mhull.js'
<br />
This is an example of an indictor called 'mhull' with six required inputs
```
{
    name: "mhull",
    settings: {
        source: "close",        
        hullVariation: "HMA",   
        length: 220,            
        lengthMultiplier: 2.4,  
        useHtf: false,          
        higherTimeframe: "4h",  
    }
}
```

#### Adding an indicator

Before you can run any strat you must add at least one 'indictor' added to the './src/indicators/lib' folder 
Each indicator must provide to './src/indicators/index' an import of the same name as the indicator file which returns 1 for long, -1 for short, and 0 for neither.
<br />
For example with the MHULL indicator: The name provided in the config of 'mhull' matches the file found in './src/indicators/mhull.js' 
<br />
Within the indicator function itself should be some documention showing exactly what fields must be provided in the config settings for the indicator to work from.
<br />
This is an example of the 'mhull' indicator with documentation imported into the './src/indicators/index' file
```
/**
 * Calculates the hull moving average and returns long or short when the current candle is polar to the penultimate one and the current close
 * @param  {[string]}  source           "close"/"open" which price point from the candle to work from
 * @param  {[string]}  hullVariation    "HMA"/"THMA"/"EHMA" which moving average variation to work from
 * @param  {[int]}     length           lookback length for MA calculations 
 * @param  {[float]}   lengthMultiplier multiple length by multiplier 
 * @param  {[boolean]} useHtf           if this indicator should call for a specific timeframe to operate from - default is strat default
 * @param  {[string]}  higherTimeframe  "1m"/"5m"/"2h" etc - timeframe to use if useHtf is true
 * @return {[int]}                      1,0,-1 if indicator directs long, nill, short   
 */
function mhull(strat, candleData) {
    ...
}

module.exports = mhull;
```

### Example of a full config.js file

The following is an example of a full working config file utilising only the 'mhull' indicator operating on the 15min btc data.

```
const universal = {
    maxLookBack: 996
};
  
let strats = [
    {
        wallet : {
            public: "XXXXX",
            priv:   "XXXXX"
        },

        opName: "MHULL BTC 15m", 
        token: "BTCUSDT",
        timeframe: "15m",

        options: {
            swingHighLowLookbackLength: 30,
            percentageRiskedPerTrade: 25,
            profitFactor: 3,
            atrLength: 14,

        },

        indicators: [
            {
                name: "mhull",
                    settings: {
                    source: "close",       
                    hullVariation: "HMA", 
                    length: 650,           
                    lengthMultiplier: 1,   
                    useHtf: false,         
                    higherTimeframe: "4h", 
                }
            },
        ],
    }
];
  
module.exports = {strats, universal}
```
