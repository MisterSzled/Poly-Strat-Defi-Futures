const fs = require('fs');

async function writeToFile(filename, newEntries) {
    fs.writeFileSync(filename, JSON.stringify(newEntries, null, 1), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Written");
        }
    });
}

module.exports = writeToFile;