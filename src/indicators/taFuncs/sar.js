// Returns the sma for every possible entry with more than volLength behind it

function sar(candleData, start, inc, max) {
    let priceData = candleData.slice(0, candleData.length - 2).reverse();
    
    let result = [];
    let maxMin = 0;
    let acceleration = 0;

    for (let i = 0; i < 100; i++) {
        
    }
}

module.exports = sar;