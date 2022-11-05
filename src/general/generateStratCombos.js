function generateKeySeries(scheme) {
    if (typeof(scheme) === "string") {
        return scheme;
    }

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
    let setRulesets = [];

    for (let i = 0; i < variationScheme.rulesets.length; i++) {
        setRulesets.push(generateRulesetMap(variationScheme.rulesets[i], targetToken))
    }

    let combinedSets = [];
    if (variationScheme.rulesets.length === 1) {
        for (let i = 0; i < setRulesets[0].length; i++) {
            combinedSets.push({
                timeframe: variationScheme.timeframe,
                rulesets: [
                    setRulesets[0][i]
                ]
            })
        }
    } else if (variationScheme.rulesets.length === 2) {
        for (let i = 0; i < setRulesets[0].length; i++) {
            for (let j = 0; j < setRulesets[1].length; j++) {
                combinedSets.push({
                    timeframe: variationScheme.timeframe,
                    rulesets: [
                        setRulesets[0][i],
                        setRulesets[1][j],
                    ]
                })
            }
        }
    }

    let tokenRes = [];
    for (let i = 0; i < combinedSets.length; i++) {
        for (let j = 0; j < targetToken.length; j++) {
            tokenRes.push({
                token: targetToken[j],
                ...combinedSets[i],
                
            })
        }
    }
    return tokenRes
}

function generateRulesetMap (variationScheme, targetToken) {
    let options_map = [];
    let optionsSeries = getOptionsSeries(variationScheme)
    for (let i = 0; i < optionsSeries.swingHighLowLookbackLength.length; i ++) {
        for (let j = 0; j < optionsSeries.percentageRiskedPerTrade.length; j ++) {
            for (let k = 0; k < optionsSeries.profitFactor.length; k ++) {
            for (let l = 0; l < optionsSeries.riskFactor.length; l ++) {
                options_map.push({
                        percentageRiskedPerTrade: optionsSeries.percentageRiskedPerTrade[j], 
                        profitFactor: optionsSeries.profitFactor[k], 
                        riskFactor: optionsSeries.riskFactor[l], 

                        swingHighLowLookbackLength: optionsSeries.swingHighLowLookbackLength[i],
                        atrLength: 14,            
                });
            }
            }
        }
    }

    // For IJKLMN
    let fractal_map = [];
    let fractalScheme = variationScheme.indicators.find(val => val.name === "fractal");
    if (!!fractalScheme) {
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
                                            // filterBillWilliams:   variationScheme.indicators[0].settings.filterBillWilliams,
                                            // useTimeFractals:      variationScheme.indicators[0].settings.useTimeFractals,
                                            timeframe:            fractalSeries.timeframe[c],
        
                                            use_IJKLMN:     true,
                                            IJKLMN_use_J_as_pivot: fractalSeries.IJKLMN_use_J_as_pivot[d],
                                            // IJKLMN_use_J_as_pivot: variationScheme.indicators[0].settings.IJKLMN_use_J_as_pivot,
        
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
    }
    
    

    let boomHunter_map = [];
    let boomHunterScheme = variationScheme.indicators.find(val => val.name === "boomHunter");
    if (!!boomHunterScheme) {
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
    }
    

    let mhull_map = [];
    let mhullScheme = variationScheme.indicators.find(val => val.name === "mhull");
    if (!!mhullScheme) {
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
    }
    

    let volatilityOscillator_map = [];
    let volatilityOscillatorScheme = variationScheme.indicators.find(val => val.name === "volatilityOscillator");
    if (!!volatilityOscillatorScheme) {
        let volatilityOscillator_length_map = generateKeySeries(volatilityOscillatorScheme["settings"]["volLength"]);
        for (let i = 0; i < volatilityOscillator_length_map.length; i++) {
            volatilityOscillator_map.push({
                name: "volatilityOscillator",
                settings: {
                    volLength: volatilityOscillator_length_map[i]
                }
            });
        }
    }

    let coralTrend_map = [];
    let coralTrendScheme = variationScheme.indicators.find(val => val.name === "coralTrend");
    if (!!coralTrendScheme) {
        let coralTrendSeries = getIndicatorSeries(variationScheme, "coralTrend");
        for (let a = 0; a < coralTrendSeries.smoothingPeriod.length; a++) {
            for (let b = 0; b < coralTrendSeries.constantD.length; b++) {
                coralTrend_map.push({
                    name: "coralTrend",

                    settings: {
                        smoothingPeriod: coralTrendSeries.smoothingPeriod[a],
                        constantD:       coralTrendSeries.constantD[b],
                    }
                });
            }
        }
    }
    
    let adx_map = [];
    let adxScheme = variationScheme.indicators.find(val => val.name === "adx");
    if (!!adxScheme) {
        let adxSeries = getIndicatorSeries(variationScheme, "adx");
        for (let a = 0; a < adxSeries.length.length; a++) {
            for (let b = 0; b < adxSeries.midLine.length; b++) {
                adx_map.push({
                    name: "adx",

                    settings: {
                        length:          adxSeries.length[a],
                        midLine: adxSeries.midLine[b],
                    }
                });
            }
        }
    }

    let absoluteStrengthHistogram_map = [];
    let absoluteStrengthHistogramScheme = variationScheme.indicators.find(val => val.name === "absoluteStrengthHistogram");
    if (!!absoluteStrengthHistogramScheme) {
        let absoluteStrengthHistogramSeries = getIndicatorSeries(variationScheme, "absoluteStrengthHistogram");
        for (let a = 0; a < absoluteStrengthHistogramSeries.evalPeriod.length; a++) {
            for (let b = 0; b < absoluteStrengthHistogramSeries.smoothingPeriod.length; b++) {
                absoluteStrengthHistogram_map.push({
                    name: "absoluteStrengthHistogram",

                    settings: {
                        evalPeriod:          absoluteStrengthHistogramSeries.evalPeriod[a],
                        smoothingPeriod: absoluteStrengthHistogramSeries.smoothingPeriod[b],

                        method: "RSI"
                    }
                });
            }
        }
    }

    let hawkeyeVolumne_map = [];
    let hawkeyeVolumneScheme = variationScheme.indicators.find(val => val.name === "hawkeyeVolumne");
    if (!!hawkeyeVolumneScheme) {
        let hawkeyeVolumneSeries = getIndicatorSeries(variationScheme, "hawkeyeVolumne");
        for (let a = 0; a < hawkeyeVolumneSeries.length.length; a++) {
            for (let b = 0; b < hawkeyeVolumneSeries.divisor.length; b++) {
                hawkeyeVolumne_map.push({
                    name: "hawkeyeVolumne",

                    settings: {
                        length:  hawkeyeVolumneSeries.length[a],
                        divisor: hawkeyeVolumneSeries.divisor[b],
                    }
                });
            }
        }
    }

    let parabolicSAR_map = [];
    let parabolicSARScheme = variationScheme.indicators.find(val => val.name === "parabolicSAR");
    if (!!parabolicSARScheme) {
        let parabolicSARSeries = getIndicatorSeries(variationScheme, "parabolicSAR");
        for (let a = 0; a < parabolicSARSeries.trendCode.length; a++) {
            parabolicSAR_map.push({
                name: "parabolicSAR",

                settings: {
                    trendCode:  parabolicSARSeries.trendCode[a],
                }
            });
        }
    }

    let squeezeMomentum_map = [];
    let squeezeMomentumScheme = variationScheme.indicators.find(val => val.name === "squeezeMomentum");
    if (!!squeezeMomentumScheme) {
        let squeezeMomentumSeries = getIndicatorSeries(variationScheme, "squeezeMomentum");
        for (let a = 0; a < squeezeMomentumSeries.bbLength.length; a++) {
        for (let b = 0; b < squeezeMomentumSeries.bbMultiplier.length; b++) {
        for (let c = 0; c < squeezeMomentumSeries.kcLength.length; c++) {
        for (let d = 0; d < squeezeMomentumSeries.kcMultiplier.length; d++) {
        for (let e = 0; e < squeezeMomentumSeries.reportChangeInMomentum.length; e++) {
            squeezeMomentum_map.push({
                name: "squeezeMomentum",

                settings: {
                    bbLength:  squeezeMomentumSeries.bbLength[a],
                    bbMultiplier:  squeezeMomentumSeries.bbMultiplier[b],
                    kcLength:  squeezeMomentumSeries.kcLength[c],
                    kcMultiplier:  squeezeMomentumSeries.kcMultiplier[d],

                    // reportChangeInMomentum: squeezeMomentumSeries.reportChangeInMomentum[e]
                    reportChangeInMomentum: false
                }
            });
        }
        }
        }
        }
        }
    }

    let duoMA_map = [];
    let duoMAScheme = variationScheme.indicators.find(val => val.name === "duoMA");
    if (!!duoMAScheme) {
        let duoMASeries = getIndicatorSeries(variationScheme, "duoMA");
        for (let a = 0; a < duoMASeries.ma1_length.length; a++) {
        for (let b = 0; b < duoMASeries.ma2_length.length; b++) {
            duoMA_map.push({
                name: "duoMA",

                settings: {
                    ma1_type: "EMA",
                    ma2_type: "SMA",
                    ma1_length:  duoMASeries.ma1_length[a],
                    ma2_length:  duoMASeries.ma2_length[b],
                }
            });
        }
        }
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

    // let result = [];
    // for (let i = 0; i < mhull_map.length; i++) {
    //     for (let j = 0; j < fractal_map.length; j++) {
    //         for (let k = 0; k < options_map.length; k++) {
    //             for (let m = 0; m < volatilityOscillator_map.length; m++) {
    //                 result.push({               
    //                     opName: "Generated_" + i+"_"+j+"_"+k+"_"+m, 
                
    //                     // token: targetToken, 
                
    //                     options: options_map[k],
                
    //                     indicators: [
    //                         fractal_map[j],
    //                         mhull_map[i],
    //                         volatilityOscillator_map[m],
    //                     ],
    //                 });
    //             }
    //         }
    //     }
    // }

    // CORAL ADX
    // let result = [];
    // for (let i = 0; i < adx_map.length; i++) {
    //     for (let j = 0; j < coralTrend_map.length; j++) {
    //         for (let k = 0; k < options_map.length; k++) {
    //             result.push({               
    //                 opName: "Generated_" + i+"_"+j+"_"+k, 
            
    //                 // token: targetToken, 
            
    //                 options: options_map[k],
            
    //                 indicators: [
    //                     coralTrend_map[j],
    //                     adx_map[i],
    //                 ],
    //             });
    //         }
    //     }
    // }

    // CORAL ABS HAWKEYE
    // let result = [];
    // for (let i = 0; i < absoluteStrengthHistogram_map.length; i++) {
    //     for (let j = 0; j < coralTrend_map.length; j++) {
    //         for (let k = 0; k < options_map.length; k++) {
    //         for (let l = 0; l < hawkeyeVolumne_map.length; l++) {
    //             result.push({               
    //                 opName: "Generated_" + i+"_"+j+"_"+k, 
            
    //                 token: targetToken, 
            
    //                 options: options_map[k],
            
    //                 indicators: [
    //                     coralTrend_map[j],
    //                     absoluteStrengthHistogram_map[i],
    //                     hawkeyeVolumne_map[l],
    //                 ],
    //             });
    //         }
    //         }
    //     }
    // }

    // Parabolic + duaMA + hawkeye + 
    let result = [];
    for (let i = 0; i < parabolicSAR_map.length; i++) {
        for (let l = 0; l < squeezeMomentum_map.length; l++) {
            for (let j = 0; j < hawkeyeVolumne_map.length; j++) {
                for (let k = 0; k < options_map.length; k++) {
                    for (let m = 0; m < duoMA_map.length; m++) {
                        result.push({               
                            opName: "Generated_" + i+"_"+j+"_"+k, 
                    
                            token: targetToken, 
                    
                            options: options_map[k],
                    
                            indicators: [
                                parabolicSAR_map[i],
                                squeezeMomentum_map[l],
                                duoMA_map[m],
                                hawkeyeVolumne_map[j],
                            ],
                        });
                    }
                }
            }
        }
    }

    return result
}

module.exports = generateStratCombos