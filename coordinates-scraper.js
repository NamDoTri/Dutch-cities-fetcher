let readCityFile = require("./read-cities.js");
let fetchCoordinates = require("./coordinates-fetcher.js");

const baseURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
const cityPath = "../data-subsets/cities_undefined.txt";

let cities = [];
let promises = []

(async function(){
    //open the list of city names
    let cities_undefined = await readCityFile(cityPath);

    //go to every baseURL + city name
    for(let city of cities_undefined){
        url = baseURL + city;
        promises.push(
            fetchCoordinates(url)
            .then(
                (res) => {
                    cities.push({
                        cityName: city,
                        longitude: res.Longitude,
                        latitude: res.Latitude
                    })
                },
                (rej) => {
                    cities.push({
                        cityName: city,
                        longitude: 0,
                        latitude: 0
                    })
                }
            )
            .catch(e => console.log(e))  
        )
    } 
    console.log(cities)
})()


//write those coordinates to a file