const boomHunter = require("./boomHunter");
const mhull = require("./mhull");
const volatilityOscillator = require("./volatilityOscillator");

let indicators = {
    boomHunter: boomHunter,
    mhull: mhull,
    volatilityOscillator: volatilityOscillator,
}

module.exports = indicators