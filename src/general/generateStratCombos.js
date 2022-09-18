function generateKeySeries(scheme) {
    if (typeof(scheme) === "boolean") {
        return [true, false];
    }

    let result = [];
    for (let i = scheme[0]; i <= scheme[1]; i += scheme[2]) {
        result.push(i)
    }
    return result
}

function getIndicatorSeries(scheme, indicator) {
    let fields = scheme.indicators.find(val => val.name === indicator).settings;
    let keys = Object.keys(fields);

    for(let i = 0; i < keys.length; i++) {
        fields[keys[i]] = generateKeySeries(fields[keys[i]])
    }

    return fields
}
function getOptionsSeries(scheme) {
    let fields = scheme.options
    let keys = Object.keys(fields);

    for(let i = 0; i < keys.length; i++) {
        fields[keys[i]] = generateKeySeries(fields[keys[i]])
    }

    return fields
}

function generateStratCombos (variationScheme, targetToken) {
    let fractal_map = [];
    let fractalSeries = getIndicatorSeries(variationScheme, "fractal");
    for (let a = 0; a < fractalSeries.filterBillWilliams.length; a++) {
        for (let b = 0; b < fractalSeries.useTimeFractals.length; b++) {
            for (let c = 0; c < fractalSeries.timeframe.length; c++) {
                for (let e = 0; e < fractalSeries.ABCReversale_AB_min.length; e++) {
                    for (let f = 0; f < fractalSeries.ABCReversale_AB_max.length; f++) {
                        for (let g = 0; g < fractalSeries.ABCReversale_BC_min.length; g++) {
                            fractal_map.push({
                                name: "fractal",

                                settings: {
                                    filterBillWilliams:  fractalSeries.filterBillWilliams[a],
                                    useTimeFractals:     fractalSeries.useTimeFractals[b],
                                    timeframe:           fractalSeries.timeframe[c],

                                    use_ABCReversal:     true,
                                    ABCReversale_AB_min: fractalSeries.ABCReversale_AB_min[e], 
                                    ABCReversale_AB_max: fractalSeries.ABCReversale_AB_max[f],
                                    ABCReversale_BC_min: fractalSeries.ABCReversale_BC_min[g]
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    let options_map = [];
    let optionsSeries = getOptionsSeries(variationScheme)
    for (let i = 0; i < optionsSeries.swingHighLowLookbackLength.length; i ++) {
        for (let j = 0; j < optionsSeries.percentageRiskedPerTrade.length; j ++) {
            for (let k = 0; k < optionsSeries.profitFactor.length; k ++) {
                options_map.push({

                        swingHighLowLookbackLength: optionsSeries.swingHighLowLookbackLength[i],
                        percentageRiskedPerTrade: optionsSeries.percentageRiskedPerTrade[j], 
                        profitFactor: optionsSeries.profitFactor[k], 
                        atrLength: 14,
            
                        useLimitOrders: false,     
                        gmxLimitAdjustment: 1, 
                });
            }
        }
    }

    // let boomHunter_map = [];
    // let boomHunterScheme         = variationScheme.indicators.find(val => val.name === "boomHunter");
    // let boomHunter_LPPeriod1_map = generateKeySeries(boomHunterScheme["settings"]["LPPeriod1"]);
    // let boomHunter_LPPeriod2_map = generateKeySeries(boomHunterScheme["settings"]["LPPeriod2"]);
    // let boomHunter_k12_map       = generateKeySeries(boomHunterScheme["settings"]["k12"]);
    // for (let i = 0; i < boomHunter_LPPeriod1_map.length; i ++) {
    //     for (let j = 0; j < boomHunter_LPPeriod2_map.length; j ++) {
    //         for (let k = 0; k < boomHunter_k12_map.length; k ++) {
    //             boomHunter_map.push({
    //                 name: "boomHunter",
    //                 settings: {
    //                     triggerLength: 1, 
            
    //                     LPPeriod1: boomHunter_LPPeriod1_map[i],    
    //                     k1: 0,
            
    //                     LPPeriod2: boomHunter_LPPeriod2_map[j],    
    //                     k12: boomHunter_k12_map[k], 
    //                 }
    //             });
    //         }
    //     }
    // }

    // let mhull_map = [];
    // let mhullScheme = variationScheme.indicators.find(val => val.name === "mhull");
    // let mhullScheme_length_map = generateKeySeries(mhullScheme["settings"]["length"]);
    // for (let i = 0; i < mhullScheme_length_map.length; i++) {
    //     mhull_map.push({
    //         name: "mhull",
    //         settings: {
    //             source: "close",       
    //             hullVariation: "HMA",  
    //             length: mhullScheme_length_map[i],           
    //             lengthMultiplier: 1, 
    //             useHtf: false,         
    //             higherTimeframe: "4h", 
    //         }
    //     });
    // }

    // let volatilityOscillator_map = [];
    // let volatilityOscillatorScheme = variationScheme.indicators.find(val => val.name === "volatilityOscillator");
    // let volatilityOscillator_length_map = generateKeySeries(volatilityOscillatorScheme["settings"]["volLength"]);
    // for (let i = 0; i < volatilityOscillator_length_map.length; i++) {
    //     volatilityOscillator_map.push({
    //         name: "volatilityOscillator",
    //         settings: {
    //             volLength: volatilityOscillator_length_map[i]
    //         }
    //     });
    // }
    
    let result = [];
    // for (let i = 0; i < mhull_map.length; i++) {
    //     for (let j = 0; j < boomHunter_map.length; j++) {
    //         for (let k = 0; k < options_map.length; k++) {
    //             for (let m = 0; m < volatilityOscillator_map.length; m++) {
    //                 result.push({               
    //                     opName: "Generated_" + i+"_"+j+"_"+k+"_"+m, 
                
    //                     token: targetToken, 
    //                     timeframe: variationScheme.timeframe,
                
    //                     options: options_map[k],
                
    //                     indicators: [
    //                         boomHunter_map[j],
    //                         mhull_map[i],
    //                         volatilityOscillator_map[m],
    //                     ],
    //                 });
    //             }
    //         }
    //     }
    // }
    for (let i = 0; i < fractal_map.length; i++) {
            for (let k = 0; k < options_map.length; k++) {
                    result.push({               
                        opName: "Generated_" + i+"_"+k, 
                
                        token: targetToken, 
                        timeframe: variationScheme.timeframe,
                
                        options: options_map[k],
                
                        indicators: [
                            fractal_map[i],
                        ],
                    });
            }
    }
    return result
}

module.exports = generateStratCombos