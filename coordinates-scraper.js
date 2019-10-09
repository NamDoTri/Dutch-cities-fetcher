const rp = require('request-promise');
const parseDMS = require('./coordinates-parser.js');
const $ = require("cheerio");

let readCityFile = require("./read-cities.js");
let fetchCoordinates = require("./coordinates-fetcher.js");

const baseURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
const cityPath = "../data-subsets/cities_undefined.txt";

let cities = [];
let promises = [];

(async function(){
    let cities_undefined = await readCityFile(cityPath);
    cities_undefined = cities_undefined.map( city => city.replace(/\s/g, "%20") )

    for(let city of cities_undefined){
        promises.push( new Promise(
            (resolve, reject) => {
                rp(baseURL+city)
                .then(
                    res => {
                        let link = JSON.parse(res)[3][0];
                        rp(link)
                        .then(
                            html => {
                                try{
                                    let lat = $(" .geo-default .geo-dms .latitude ", html)[0].children[0].data
                                    let lng = $(" .geo-default .geo-dms .longitude ", html)[0].children[0].data

                                    let parsedCoordinates = parseDMS( lat +" "+ lng )
                                    if( parsedCoordinates.Longitude && parsedCoordinates.Latitude){
                                        //console.log(parsedCoordinates.Longitude, parsedCoordinates.Latitude)
                                        //TODO: write all these coordinates to a file
                                    }else{
                                        throw new Error()
                                    }
                                }catch(e){
                                    console.log(city.toUpperCase())
                                }
                                
                            }
                        )
                    }
                )
                .catch(e => reject(e))
            }
        ))
    }
    //Promise.all(promises).then(result => console.log(result))

})()

//write those coordinates to a file