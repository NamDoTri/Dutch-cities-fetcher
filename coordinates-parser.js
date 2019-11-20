function ConvertDMSToDD(degrees, minutes, direction) {
    var dd = (degrees||0) + (minutes/60||0) ;
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } 
    return dd/10;
}
function parseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2]);
    var lng = ConvertDMSToDD(parts[3], parts[4], parts[5]);
    return {
        "Longitude": lng, 
        "Latitude": lat, 
        toString: function(){ //for testing, deletable
            return `Latitude: ${this.Latitude}\nLongitude: ${this.Longitude}`
    }}
}
module.exports = parseDMS;