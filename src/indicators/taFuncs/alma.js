// Returns the Arnaud Legoux Moving Average for the most recent entry

function alma(series, windowsize, offset, sigma) {
    series = series.map(val => parseFloat(val));
    series.reverse();

    let m = Math.floor(offset * (windowsize - 1));
    let s = windowsize / sigma;
    let weight = 0.0;
    let norm = 0.0;
    let sum = 0.0;

    for (let i = 0; i < windowsize; i++) {
        weight = Math.exp(-1 * Math.pow(i - m, 2) / (2 * Math.pow(s, 2)));

        norm = norm + weight;
        sum = sum + (series[windowsize - i - 1] * weight);
    }
    return (sum / norm);
}

module.exports = alma;