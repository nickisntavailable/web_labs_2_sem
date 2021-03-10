//mongod.exe --dbpath C:\Users\Dan\Desktop\db
const vars = require('./config').vars;
let MongoClient = require('mongodb').MongoClient;
const request = require('request');
// const port = 3000;

// let url = "mongodb://localhost:27017/cityDB";
const apiKey = vars.apiKey;
const dbName = vars.dbName;
const colName = vars.colName;
const url = vars.url;

function checkDirection(dir) {
    if (330 <= dir < 30) {
        return 'North';
    } else if (30 <= dir < 60) {
        return 'North-East';
    }else if(60 <= dir < 120) {
        return 'East';
    } else if(120 <= dir < 150) {
        return 'South-East';
    } else if(150 <= dir < 210) {
        return 'South';
    } else if (210 <= dir < 240) {
        return 'South-West';
    } else if (240 <= dir < 300) {
        return 'West';
    } else if(300 <= dir < 330) {
        return 'North-West';
    } else {
        return '';
    }
}

function findCity(res, city, collection) {
    const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/find?q=${city.name}&appid=${apiKey}&units=metric`

    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        console.log(body);
        if(body.cod == '200' & body.count == 0) {
        res.send({mes: '404'});
        } else if(body.cod != '404') {
        collection.insertOne(city, function(err, result) {
            if(err) {
                console.log(err);
            }
            res.send({mes: 'OK'});
        });
        } else {
        res.send({mes: '404'});
        }
    });
}
function getCity(res, city) {
    const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
        // url: `https://api.openweathermap.org/data/2.5/find?lon=${lon}&lat=${lat}&appid=${apiKey}&units=metric`
        
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        if(body.cod == '404') {
        res.send({mes: '404'});
        } else {
        let data = {
            name: city,
            temp: Math.round(body.main.temp),
            wind: body.weather[0].description + ', ' + body.wind.speed + ' m/s, ' + checkDirection(body.wind.deg),
            desc: body.weather[0].main,
            pres: body.main.pressure + ' hpa',
            hum: body.main.humidity + ' %',
            coords: '[' + body.coord.lat.toFixed(2) + ', '+ body.coord.lon.toFixed(2) + ']',
            icon: body.weather[0].icon
        };
        res.send(data);
        }
        
    });
}

function getCityByCoords(res, lon, lat) {
    const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/find?lon=${lon}&lat=${lat}&appid=${apiKey}&units=metric`
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        if (body.cod == '400') {
        res.send({mes: body.message});
        } else {
        body = body.list[0];
        let data = {
            name: body.name,
            temp: Math.round(body.main.temp),
            wind: body.weather[0].description + ', ' + body.wind.speed + ' m/s, ' + checkDirection(body.wind.deg),
            desc: body.weather[0].main,
            pres: body.main.pressure + ' hpa',
            hum: body.main.humidity + ' %',
            coords: '[' + body.coord.lat.toFixed(2) + ', '+ body.coord.lon.toFixed(2) + ']',
            icon: body.weather[0].icon
        };
        res.send(data);
        }
        
    });
}

function findFavourites(res) {
    MongoClient.connect(url, function(err, client) {
        var db = client.db(dbName);
        let collection = db.collection(colName);
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            client.close();
        });
    });
}
function postFavourites(res, cityName) {
    MongoClient.connect(url, function(err, client) {
        var db = client.db(dbName);
        let collection = db.collection(colName);
        let city = {name: cityName};
        collection.count(city, function(err, rslt) {
        if (rslt == 0) {
            findCity(res, city, collection);
        }else {
            res.send({mes: 'empty query or there is already such element in list'});
        }
        });
    });
}
function deleteFavourites(res, cityName) {
    MongoClient.connect(url, function(err, client) {
        var db = client.db(dbName);
        let collection = db.collection(colName);
        let city = {name: cityName};
        collection.deleteOne(city, function(err, result) {
            if (err) throw err;
            res.send({mes: 'OK'});
            client.close();
        })  
    });
}
module.exports.deleteFavourites = deleteFavourites;
module.exports.postFavourites = postFavourites;
module.exports.findFavourites = findFavourites;
module.exports.getCityByCoords = getCityByCoords;
module.exports.getCity = getCity;
module.exports.findCity = findCity;


