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

    // For ABC
    // let fractal_map = [];
    // let fractalSeries = getIndicatorSeries(variationScheme, "fractal");
    // for (let a = 0; a < fractalSeries.filterBillWilliams.length; a++) {
    //     for (let b = 0; b < fractalSeries.useTimeFractals.length; b++) {
    //         for (let c = 0; c < fractalSeries.timeframe.length; c++) {
    //             for (let e = 0; e < fractalSeries.ABCReversale_AB_min.length; e++) {
    //                 for (let f = 0; f < fractalSeries.ABCReversale_AB_max.length; f++) {
    //                     for (let g = 0; g < fractalSeries.ABCReversale_BC_min.length; g++) {
    //                         fractal_map.push({
    //                             name: "fractal",

    //                             settings: {
    //                                 filterBillWilliams:  fractalSeries.filterBillWilliams[a],
    //                                 useTimeFractals:     fractalSeries.useTimeFractals[b],
    //                                 timeframe:           fractalSeries.timeframe[c],

    //                                 use_ABCReversal:     true,
    //                                 ABCReversale_AB_min: fractalSeries.ABCReversale_AB_min[e], 
    //                                 ABCReversale_AB_max: fractalSeries.ABCReversale_AB_max[f],
    //                                 ABCReversale_BC_min: fractalSeries.ABCReversale_BC_min[g]
    //                             }
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // For IJKLMN
    let fractal_map = [];
    let fractalSeries = getIndicatorSeries(variationScheme, "fractal");
    for (let a = 0; a < fractalSeries.filterBillWilliams.length; a++) {
    for (let b = 0; b < fractalSeries.useTimeFractals.length; b++) {
    for (let c = 0; c < fractalSeries.timeframe.length; c++) {
    for (let d = 0; d < fractalSeries.IJKLMN_use_J_as_pivot.length; d++) {
        for (let e = 0; e < fractalSeries.IJKLMN_IJK_min.length; e++) {
        for (let f = 0; f < fractalSeries.IJKLMN_IJK_max.length; f++) {
            for (let g = 0; g < fractalSeries.IJKLMN_IJN_min.length; g++) {
            for (let h = 0; h < fractalSeries.IJKLMN_IJN_max.length; h++) {
                for (let i = 0; i < fractalSeries.IJKLMN_JKL_min.length; i++) {
                for (let j = 0; j < fractalSeries.IJKLMN_JKL_max.length; j++) {
                    for (let l = 0; l < fractalSeries.IJKLMN_KLM_min.length; l++) {
                    for (let m = 0; m < fractalSeries.IJKLMN_KLM_max.length; m++) {
                        for (let n = 0; n < fractalSeries.IJKLMN_LMN_min.length; n++) {
                        for (let o = 0; o < fractalSeries.IJKLMN_LMN_max.length; o++) {

                            if (
                                !(fractalSeries.IJKLMN_IJK_min[e] >= fractalSeries.IJKLMN_IJK_max[f]) &&
                                !(fractalSeries.IJKLMN_IJN_min[e] >= fractalSeries.IJKLMN_IJN_max[f]) &&
                                !(fractalSeries.IJKLMN_JKL_min[e] >= fractalSeries.IJKLMN_JKL_max[f]) &&
                                !(fractalSeries.IJKLMN_KLM_min[e] >= fractalSeries.IJKLMN_KLM_max[f]) &&
                                !(fractalSeries.IJKLMN_LMN_min[e] >= fractalSeries.IJKLMN_LMN_max[f]) 
                                // (fractalSeries.timeframe[d] ? (fractalSeries.IJKLMN_IJK_max[f] < 1) : (fractalSeries.IJKLMN_IJK_max[f] > 1))
                            ) {
                                fractal_map.push({
                                    name: "fractal",
    
                                    settings: {
                                        filterBillWilliams:   fractalSeries.filterBillWilliams[a],
                                        useTimeFractals:      fractalSeries.useTimeFractals[b],
                                        // filterBillWilliams:   false,
                                        // useTimeFractals:      true,
                                        timeframe:            fractalSeries.timeframe[c],
    
                                        use_IJKLMN:     true,
                                        IJKLMN_use_J_as_pivot: fractalSeries.IJKLMN_use_J_as_pivot[d],
                                        // IJKLMN_use_J_as_pivot: true,
    
                                        IJKLMN_IJK_min: fractalSeries.IJKLMN_IJK_min[e], 
                                        IJKLMN_IJK_max: fractalSeries.IJKLMN_IJK_max[f],
    
                                        IJKLMN_IJN_min: fractalSeries.IJKLMN_IJN_min[g], 
                                        IJKLMN_IJN_max: fractalSeries.IJKLMN_IJN_max[h],
    
                                        IJKLMN_JKL_min: fractalSeries.IJKLMN_JKL_min[i], 
                                        IJKLMN_JKL_max: fractalSeries.IJKLMN_JKL_max[j],
    
                                        IJKLMN_KLM_min: fractalSeries.IJKLMN_KLM_min[l], 
                                        IJKLMN_KLM_max: fractalSeries.IJKLMN_KLM_max[m],
    
                                        IJKLMN_LMN_min: fractalSeries.IJKLMN_LMN_min[n], 
                                        IJKLMN_LMN_max: fractalSeries.IJKLMN_LMN_max[o],
                                    }
                                });
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
            }
        }
        }
    }
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
    // let result = [];
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
    // for (let i = 0; i < fractal_map.length; i++) {
    //         for (let k = 0; k < options_map.length; k++) {
    //                 result.push({               
    //                     opName: "Generated_" + i+"_"+k, 
                
    //                     token: targetToken, 
    //                     timeframe: variationScheme.timeframe,
                
    //                     options: options_map[k],
                
    //                     indicators: [
    //                         fractal_map[i],
    //                     ],
    //                 });
    //         }
    // }
    let result = [];
    for (let i = 0; i < mhull_map.length; i++) {
        for (let j = 0; j < fractal_map.length; j++) {
            for (let k = 0; k < options_map.length; k++) {
                for (let m = 0; m < volatilityOscillator_map.length; m++) {
                    result.push({               
                        opName: "Generated_" + i+"_"+j+"_"+k+"_"+m, 
                
                        // token: targetToken, 
                        timeframe: variationScheme.timeframe,
                
                        options: options_map[k],
                
                        indicators: [
                            fractal_map[j],
                            mhull_map[i],
                            volatilityOscillator_map[m],
                        ],
                    });
                }
            }
        }
    }

    let tokenRes = [];
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < targetToken.length; j++) {
            tokenRes.push({
                ...result[i],
                token: targetToken[j]
            })
        }
    }
    return tokenRes
}

module.exports = generateStratCombos