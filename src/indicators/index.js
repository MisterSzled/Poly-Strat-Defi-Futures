const boomHunter = require("./library/boomHunter");
const mhull = require("./library/mhull");
const volatilityOscillator = require("./library/volatilityOscillator");
const fractal = require("./library/fractal");
const coralTrend = require("./library/coralTrend");

let indicators = {
    boomHunter: boomHunter,
    mhull: mhull,
    volatilityOscillator: volatilityOscillator,
    fractal: fractal,
    coralTrend: coralTrend,
}

module.exports = indicators