
const express = require('express');
const cors = require('cors');

const vars = require('./config').vars;
const funcs = require('./maindb');
// let MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;



const apiKey = vars.apiKey;
const dbName = vars.dbName;
const colName = vars.colName;
const url = vars.url;



app.use(cors());



app.get('/weather/city', (req, res) => {
  if(req.query.q) {
    funcs.getCity(res, req.query.q);
  } else {
    res.send({mes: 'error: city is empty'});
  }
  
})
app.get('/weather/coordinates', (req, res) => {
  if(req.query.lat != ' ' & req.query.lon != ' ') {
    funcs.getCityByCoords(res, req.query.lon, req.query.lat);
  } else {
    res.send({mes: 'error: coordinates are empty'});
  }
  
})
app.get('/favourites', (req, res) => {
  funcs.findFavourites(res); 
})
app.post('/favourites', (req, res) => {
  // console.log('POST ' + req.query.q);
  
  if(req.query.q.length != 0) {
    funcs.postFavourites(res, req.query.q);
  } else {
    res.send({mes: 'empty query or there is already such element in list'});
  } 
})
app.delete('/favourites', (req, res) => {
  if(req.query.q.length != 0) {
    funcs.deleteFavourites(res, req.query.q);
  } else {
    res.send({mes: 'empty query or there is no such element in list'});
  } 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})