const boomHunter = require("./library/boomHunter");
const mhull = require("./library/mhull");
const volatilityOscillator = require("./library/volatilityOscillator");

let indicators = {
    boomHunter: boomHunter,
    mhull: mhull,
    volatilityOscillator: volatilityOscillator,
}

module.exports = indicators