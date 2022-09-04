let baseStrat = {
    options: {
    // Risk settings
        swingHighLowLookbackLength: 20,
        percentageRiskedPerTrade: 25, // min 1 max 98
        profitFactor: 2, // This predominantly effects how long term your positions are
        atrLength: 14,

        // GMX settings
        useLimitOrders: false,     // Set GMX limit orders when position is opened
        gmxLimitAdjustment: 1, // 1 is no adjustment - tightens strat defined SL/TP because GMX is a cunt
    },

    indicators: [
        {
            name: "boomHunter",
            settings: {
            triggerLength: 1, 

            LPPeriod1: 14,    
            k1: 0,

            LPPeriod2: 28,    
            k12: 0.35, 
            }
        },
        {
            name: "mhull",
            settings: {
            source: "close",       //Only uses close atm
            hullVariation: "HMA",  //Only uses HMA atm
            length: 700,           //Max value is 2x < 1000 === 499
            lengthMultiplier: 1, //This can be used but is literally the same as simply increaseing length
            useHtf: false,         //NOT IMPLEMENTS
            higherTimeframe: "4h", //PART OF useHtf NOT IMPLEMENTD
            }
        },
        {
            name: "volatilityOscillator",
            settings: {
            volLength: 200
            }
        },
    ],
    
}

function generateKeySeries(scheme) {
    let result = [];
    for (let i = scheme[0]; i <= scheme[1]; i += scheme[2]) {
        result.push(i)
    }
    return result
}

function generateStratCombos (variationScheme) {
    let options_map = [];
    let swingHighLowLookbackLength_map = generateKeySeries(variationScheme["options"]["swingHighLowLookbackLength"]);
    let percentageRiskedPerTrade_map   = generateKeySeries(variationScheme["options"]["percentageRiskedPerTrade"]);
    let profitFactor_map               = generateKeySeries(variationScheme["options"]["profitFactor"]);
    for (let i = 0; i < swingHighLowLookbackLength_map.length; i ++) {
        for (let j = 0; j < percentageRiskedPerTrade_map.length; j ++) {
            for (let k = 0; k < profitFactor_map.length; k ++) {
                options_map.push({
                        swingHighLowLookbackLength: swingHighLowLookbackLength_map[i],
                        percentageRiskedPerTrade: percentageRiskedPerTrade_map[j], 
                        profitFactor: profitFactor_map[k], 
                        atrLength: 14,
            
                        useLimitOrders: false,     
                        gmxLimitAdjustment: 1, 
                });
            }
        }
    }

    let boomHunter_map = [];
    let boomHunterScheme         = variationScheme.indicators.find(val => val.name === "boomHunter");
    let boomHunter_LPPeriod1_map = generateKeySeries(boomHunterScheme["settings"]["LPPeriod1"]);
    let boomHunter_LPPeriod2_map = generateKeySeries(boomHunterScheme["settings"]["LPPeriod2"]);
    let boomHunter_k12_map       = generateKeySeries(boomHunterScheme["settings"]["k12"]);
    for (let i = 0; i < boomHunter_LPPeriod1_map.length; i ++) {
        for (let j = 0; j < boomHunter_LPPeriod2_map.length; j ++) {
            for (let k = 0; k < boomHunter_k12_map.length; k ++) {
                boomHunter_map.push({
                    name: "boomHunter",
                    settings: {
                        triggerLength: 1, 
            
                        LPPeriod1: boomHunter_LPPeriod1_map[i],    
                        k1: 0,
            
                        LPPeriod2: boomHunter_LPPeriod2_map[j],    
                        k12: boomHunter_k12_map[k], 
                    }
                });
            }
        }
    }

    let mhull_map = [];
    let mhullScheme = variationScheme.indicators.find(val => val.name === "mhull");
    let mhullScheme_length_map = generateKeySeries(mhullScheme["settings"]["length"]);
    for (let i = 0; i < mhullScheme_length_map.length; i++) {
        mhull_map.push({
            name: "mhull",
            settings: {
                source: "close",       
                hullVariation: "HMA",  
                length: mhullScheme_length_map[i],           
                lengthMultiplier: 1, 
                useHtf: false,         
                higherTimeframe: "4h", 
            }
        });
    }

    let volatilityOscillator_map = [];
    let volatilityOscillatorScheme = variationScheme.indicators.find(val => val.name === "volatilityOscillator");
    let volatilityOscillator_length_map = generateKeySeries(volatilityOscillatorScheme["settings"]["volLength"]);
    for (let i = 0; i < volatilityOscillator_length_map.length; i++) {
        volatilityOscillator_map.push({
            name: "volatilityOscillator",
            settings: {
                volLength: volatilityOscillator_length_map[i]
            }
        });
    }
    
    let result = [];
    for (let i = 0; i < mhull_map.length; i++) {
        for (let j = 0; j < boomHunter_map.length; j++) {
            for (let k = 0; k < options_map.length; k++) {
                for (let m = 0; m < volatilityOscillator_map.length; m++) {
                    result.push({               
                        opName: "Generated_" + i+"_"+j+"_"+k+"_"+m, 
                
                        token: variationScheme.token, 
                        timeframe: variationScheme.timeframe,
                
                        options: options_map[k],
                
                        indicators: [
                            boomHunter_map[j],
                            mhull_map[i],
                            volatilityOscillator_map[m],
                        ],
                    });
                }
            }
        }
    }
    return result
}

module.exports = generateStratCombos