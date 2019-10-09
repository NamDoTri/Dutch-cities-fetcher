const rp = require('request-promise');
const parseDMS = require('./coordinates-parser.js');
const $ = require("cheerio");

let readCityFile = require("./read-cities.js");
let fetchCoordinates = require("./coordinates-fetcher.js");

const baseURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
const cityPath = "../data-subsets/cities_undefined.txt";

let cities = [];
let promises = [];

//let testURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=oude%20ijsselstreek";

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
    Promise.all(promises).then(result => console.log(result))

    // for( let city of cities_undefined){
    //     promises.push(new Promise( 
    //         (resolve, reject) => {
    //             rp(baseURL + city)
    //             .then(
    //                 res => {
    //                     try{
    //                         let link = JSON.parse(res)[3][0];
    //                         rp(link)
    //                         .then(
    //                             html => {
    //                                 try{
    //                                     let lat = $(" .geo-default .geo-dms .latitude ", html)[0].children[0].data
    //                                     let lng = $(" .geo-default .geo-dms .longitude ", html)[0].children[0].data
        
    //                                     let parsedCoordinates = parseDMS( lat +" "+ lng ) // coordinates in decimal format
    //                                     cities.push({
    //                                         city: city,
    //                                         longitude: parsedCoordinates.Longitude,
    //                                         latitude: parsedCoordinates.Latitude,
    //                                     })
    //                                     resolve();
    //                                 }catch(e){
    //                                     reject(e);
    //                                 }
    //                             }
    //                         )
    //                     }catch(e){
    //                         reject(e);
    //                     }
    //                 }
    //             ).catch(e => reject(e))}
    //     ));
    // }
    // Promise.allSettled(promises, () =>{
    //     console.log(cities)
    // })

})()






// (async function(){
//     //open the list of city names
//     let cities_undefined = await readCityFile(cityPath);

//     //go to every baseURL + city name
//     for(let city of cities_undefined){
//         url = baseURL + city;
//         promises.push(fetchCoordinates(url));
//         // coords
//         // .then(
//         //     (res) => {
//         //         cities.push({
//         //             cityName: city,
//         //             longitude: res.Longitude,
//         //             latitude: res.Latitude
//         //         })
//         //     },
//         //     (rej) => {
//         //         cities.push({
//         //             cityName: city,
//         //             longitude: 0,
//         //             latitude: 0
//         //         })
//         //     }
//         // )
//         // .catch(e => console.log(e))  
//     } 
//     Promise.allSettled(promises).then( result => console.log(promises) )
// })();

//write those coordinates to a file