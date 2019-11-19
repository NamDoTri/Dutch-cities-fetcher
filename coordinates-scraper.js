let readCityFile = require("./read-cities.js");
let fetchCoordinates = require("./coordinates-fetcher.js");

const baseURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" // Wikipedia search API 
const cityPath = "./cities.json";

let cities = [];
let promises = [];
let invalidLinks = [];
let currentIteration = 0;

(async function(){
    let cities_undefined = await readCityFile(cityPath); // read the city names from a file
    cities_undefined = cities_undefined.map( city => city.replace(/\s/g, "%20") ) //replace white space in town names with '%20'

    for(let city of cities_undefined){
        promises.push(
            fetchCoordinates(baseURL + city, currentIteration)
            .then(
                (res) => {
                    cities.push({
                        city: city.replace(/(%20)/g," "),
                        longitude: res.Longitude,
                        latitude: res.Latitude,
                        province: res.province
                    })
                    cities_undefined = cities_undefined.filter(c => c != city)
                },
                (rej) => {
                    //continue
                }
            )
        )
    }
    Promise.all(promises)
    .then(result => {
        console.log("Cities with coords: " + cities.length)
        console.log(cities_undefined)
    })

})()

//write those coordinates to a file