// Returns the sma for every possible entry with more than volLength behind it

function sar(priceData, start, inc, max) {
    let startIndex = 100;
    let finalRes = [];

    let working_result          = [];
    let working_maxMin          = [];
    let working_acceleration    = [];
    let working_isBelow         = [];

    for (let i = priceData.length - startIndex; i <= priceData.length - 1; i++) {
        let close0 = parseFloat(priceData[i][4]);        
        let close1 = parseFloat(priceData[i-1][4]);

        let high0  = parseFloat(priceData[i][2]);        
        let high1  = parseFloat(priceData[i-1][2]);        
        let high2  = parseFloat(priceData[i-2][2]);

        let low0   = parseFloat(priceData[i][3]);        
        let low1   = parseFloat(priceData[i-1][3]);        
        let low2   = parseFloat(priceData[i-2][3]);        

        let bar_index = i - (priceData.length - startIndex) + 1;

        let result;
        let maxMin;
        let acceleration;
        let isBelow;
        let isFirstTrendBar = false;
        
        if (bar_index === 1) {
            if (close0 > close1) {
                isBelow = true;
                maxMin  = high0;
                result  = low1;
            } else {
                isBelow = false;
                maxMin  = low0;
                result  = high1;
            }
            isFirstTrendBar = true;
            acceleration    = start;
        } else {
            result       = working_result[working_result.length - 1];
            maxMin       = working_maxMin[working_maxMin.length - 1];
            acceleration = working_acceleration[working_acceleration.length - 1];
            isBelow      = working_isBelow[working_isBelow.length - 1];
        }
        
        result += acceleration * (maxMin - result);

        if (isBelow) {
            if (result > low0) {
                isFirstTrendBar = true;
                isBelow = false;
                result = Math.max(high0, maxMin);
                maxMin = low0;
                acceleration = start;
            } 
        } else {
            if (result < high0) {
                isFirstTrendBar = true;
                isBelow = true;
                result = Math.min(low0, maxMin);
                maxMin = high0;
                acceleration = start;
            }
        }

        if (!isFirstTrendBar) {
            if (isBelow) {
                if (high0 > maxMin) {
                    maxMin = high0;
                    acceleration = Math.min(acceleration + inc, max);
                }
            } else {
                if (low0 < maxMin) {
                    maxMin = low0;
                    acceleration = Math.min(acceleration + inc, max);
                }
            }
        }
        if (isBelow) {
            result = Math.min(result, low1)
            if (bar_index > 1) {
                result = Math.min(result, low2)
            }
        } else {
            result = Math.max(result, high1)
            if (bar_index > 1) {
                result = Math.max(result, high2)
            }
        }

        working_result.push(result)
        working_maxMin.push(maxMin)
        working_acceleration.push(acceleration)
        working_isBelow.push(isBelow)
    }

    return working_result
}

module.exports = sar;