const getGMXReader = require("./getGMXReader");

async function getGMXPositions(public, tokenAddy) {
    let gmxReader = await getGMXReader();

    let longPos = await gmxReader["getPositions"](
        "0x9ab2De34A33fB459b538c43f251eB825645e8595",   //vault
        public,                                         //addy
        [
            tokenAddy
        ],                                              //collateralTokens tokens you've given? 
        [
            tokenAddy,                                  //indexTokens tokens you are in a pos of?
        ], 
        [true]                                          //isLong
    );
    let shortPos = await gmxReader["getPositions"](
        "0x9ab2De34A33fB459b538c43f251eB825645e8595",   //vault
        public,                                         //addy
        [
            "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
        ],                                              //collateralTokens tokens you've given? 
        [
            tokenAddy,                                  //indexTokens tokens you are in a pos of?
        ], 
        [false]                                         //isLong
    );

    return {
        long: longPos[0],
        longTime: longPos[6],
        short: shortPos[0],
        shortTime: shortPos[6]
    }
}

module.exports = getGMXPositions;