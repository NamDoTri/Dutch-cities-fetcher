const $ = require('cheerio');
const rp = require('request-promise');
const parseDMS = require("./coordinates-parser.js")

function fetchCoordinates(url){
    return new Promise( (resolve, reject) => {
        rp(url)
        .then(
            res => {
                try{
                    let link = JSON.parse(res)[3][0];
                    rp(link)
                    .then(
                        html => {
                            try{
                                let lat = $(" .geo-default .geo-dms .latitude ", html)[0].children[0].data
                                let lng = $(" .geo-default .geo-dms .longitude ", html)[0].children[0].data

                                let parsedCoordinates = parseDMS( lat +" "+ lng ) // coordinates in decimal format
                                resolve(parsedCoordinates)
                            }catch(e){
                                throw e;
                            }
                        }
                    ).catch(e => reject(e))
                }catch(e){
                    throw e;
                }
            }
        ).catch(e => reject(e))
    })
}

module.exports = fetchCoordinates;

