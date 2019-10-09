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
        promises.push(
            fetchCoordinates(baseURL + city)
            .then(
                (res) => {
                    cities.push({
                        city: city.replace(/(%20)/g," "),
                        longitude: res.Longitude,
                        latitude: res.Latitude
                    })
                },
                (rej) => {
                    console.log(rej)
                }
            )
        )
    }
    Promise.all(promises).then(result => console.log(cities.length))

})()

//write those coordinates to a file