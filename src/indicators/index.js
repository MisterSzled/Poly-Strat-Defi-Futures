const boomHunter = require("./library/boomHunter");
const mhull = require("./library/mhull");
const volatilityOscillator = require("./library/volatilityOscillator");
const fractal = require("./library/fractal");
const coralTrend = require("./library/coralTrend");
const adx = require("./library/adx");
const absoluteStrengthHistogram = require("./library/absoluteStrengthHistogram");
const hawkeyeVolumne = require("./library/hawkeyeVolumne");
const parabolicSAR = require("./library/parabolicSAR");
const squeezeMomentum = require("./library/squeezeMomentum");
const duoMA = require("./library/duoMA");

let indicators = {
    boomHunter: boomHunter,
    mhull: mhull,
    volatilityOscillator: volatilityOscillator,
    fractal: fractal,
    coralTrend: coralTrend,
    adx: adx,
    absoluteStrengthHistogram: absoluteStrengthHistogram,
    hawkeyeVolumne: hawkeyeVolumne,
    parabolicSAR: parabolicSAR,
    squeezeMomentum: squeezeMomentum,
    duoMA: duoMA,
}

module.exports = indicators