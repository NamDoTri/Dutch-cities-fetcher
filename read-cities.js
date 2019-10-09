const fs = require('fs');

function readCityFile(path){
    return new Promise( (resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if(err) reject();
            let cities_undefined = "" + data;
            cities_undefined = JSON.parse(cities_undefined);
            resolve(cities_undefined);
        })
    })
}
module.exports = readCityFile;