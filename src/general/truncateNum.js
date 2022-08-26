function truncateNum(number, precision) {
    let strNum = number.toString();
    if (strNum.includes(".")) precision++
    return parseFloat(strNum.slice(0 , precision));
}

module.exports = truncateNum;