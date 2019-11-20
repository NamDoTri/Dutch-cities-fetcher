// import needed packages
const fs = require('fs')
// import helper modules
let readCityFile = require("./read-cities.js");
let fetchCoordinates = require("./coordinates-fetcher.js");

// path constants
const baseURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" // Wikipedia search API 
const cityPath = "./cities.json";

let cities = [];
let promises = [];
let invalidLinks = [];
let currentIteration = 0; // TODO: iterate through search results for the most suitable link

(async function(){
    let cities_undefined = await readCityFile(cityPath); // read the city names from a file
    cities_undefined = cities_undefined.map( city => city.replace(/\s/g, "%20") ) //replace white space in town names with '%20' to suit search API

    for(let city of cities_undefined){
        promises.push( // to keep track of all promises
            fetchCoordinates(baseURL + city, currentIteration)
            .then(
                (res) => {
                    cities.push({
                        city: city.replace(/(%20)/g," "),
                        longitude: res.Longitude,
                        latitude: res.Latitude,
                        province: res.province || "Missing"  // invalid provinces are filled with "Missing"
                    })
                    console.log("fetched information of " + city)
                    cities_undefined = cities_undefined.filter(c => c != city)  // keep track of invalid links for future iteration
                },
                (rej) => {

                }
            )
        )
    }
    Promise.all(promises)
    .then(result => {
        //console.log(cities)
        // write to a json file
        toSave = JSON.stringify(cities)
        ws = fs.createWriteStream("test.json")
        ws.write(toSave)
        ws.end()
        ws.on('pipe', ()=>console.log("Writing to file..."))
        ws.on('end', ()=>console.log("File writing done!"))

        // write to .csv file
        // fs.writeFileSync("cities.csv", 'City,Longitude,Latitude, Province')
        // for(let city of cities){
        //     fs.appendFileSync("cities.csv", `${city.name}, ${city.longitude}, ${city.latitude}, ${city.province || 'Missing'}\n`)
        // }
        // console.log("Done")
    })
})()