let multiTTT = {
    opName: "Multi TTT", 
    token: "BTCUSDT", 
    timeframe: "15m",

    rulesets: [
        {
            // 1-4
            options: {
                swingHighLowLookbackLength: 10,
                percentageRiskedPerTrade: 20,
                profitFactor: 2,

                atrLength: 14,
                useLimitOrders: false,
                gmxLimitAdjustment: 1,
            },
            indicators: [
                {
                    name: "fractal",
                    settings: {
                        use_IJKLMN: true,

                        filterBillWilliams: true,
                        useTimeFractals: true,
                        timeframe: 10,
                        IJKLMN_use_J_as_pivot: true,
        
                        IJKLMN_IJK_min: 1,
                        IJKLMN_IJK_max: 1000,
        
                        IJKLMN_IJN_min: 0,
                        IJKLMN_IJN_max: 1000,
        
                        IJKLMN_JKL_min: 0,
                        IJKLMN_JKL_max: 1,
        
                        IJKLMN_KLM_min: 0,
                        IJKLMN_KLM_max: 1,
        
                        IJKLMN_LMN_min: 0,
                        IJKLMN_LMN_max: 1,
                    }
                },
                {
                    name: "mhull",
                        settings: {
                            hullVariation: "HMA",  //Only uses HMA atm
                            length: 700,           //Max value is 2x < 1000 === 499
                            lengthMultiplier: 1,    //This can be used but is literally the same as simply increaseing length
                        }
                },
                {
                    name: "volatilityOscillator",
                    settings: {
                        volLength: 75
                    }
                },
            ],
        },
    ]
    
    
}