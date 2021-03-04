const refresh_btn = document.getElementById("refresh");
const del_btn = document.getElementsByClassName("btn");
const plus_btn = document.getElementsByClassName("plus_btn")[0];
const input = document.querySelector(".form input");
const apiKey = "7dcbf87ae275b086af805e94f3395b91";
const inputVal = "Moscow";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
let currentPos;
const defaultCity = 'Saint Petersburg';


function getLocation() {
  
  if (navigator.geolocation) {
    
    navigator.geolocation.getCurrentPosition(showPosition, errorPos);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function getCity(currentPos) {
  var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
  var token = "65d0530b20aff0efe7545487b5733d9c140982d1";
  var query = { lat: currentPos.latitude, lon: currentPos.longitude };

  var options = {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token " + token
      },
      body: JSON.stringify(query)
  }

  fetch(url, options)
    .then(response => response.json())
    .then(result => {
      getWeather(0, result['suggestions'][0]['data']['city'], 1)
    })
    .catch(error => console.log("error", error));
}
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
function checkIcon(icon){
  if (icon == '01d' | icon == '01n') {
    return 'clear_sky';
  } else if (icon == '02d' | icon == '02n') {
    return 'few_clouds';
  } else if (icon == '03d' | icon == '03n') {
    return 'scattered_clouds';
  } else if (icon == '04d' | icon == '04n') {
    return 'broken_clouds';
  } else if (icon == '09d' | icon == '09n') {
    return 'shower_rain';
  } else if (icon == '10d' | icon == '10n') {
    return 'rain';
  } else if (icon == '11d' | icon == '11n') {
    return 'thunderstorm';
  } else if (icon == '13d' | icon == '13n') {
    return 'snow';
  } else if (icon == '50d' | icon == '50n') {
    return 'mist';
  } else {
    return '';
  }
}
function changeMain(data) {
  const choosen = document.getElementsByClassName('choosen')[0];
  const dwnld = document.getElementsByClassName('dwnld')[0];
  const title = document.getElementById('main_city');
  const tempTitle = document.querySelector('.choosen .degs');
  const list = document.querySelectorAll('.choosen .info li p');
  const icon = document.querySelector('.choosen .icon');
  title.innerText = data.name;
  tempTitle.innerText = Math.round(data.main.temp) + String.fromCharCode(176) + 'C';
  list[1].innerText = data.weather[0].description + ', ' + data.wind.speed + ' m/s, ' + checkDirection(data.wind.deg);
  list[3].innerText = data.weather[0].main;
  list[5].innerText = data.main.pressure + ' hpa';
  list[7].innerText = data.main.humidity + ' %';
  list[9].innerText = '[' + data.coord.lat.toFixed(2) + ', '+ data.coord.lon.toFixed(2) + ']';
  icon.classList.add(checkIcon(data.weather[0].icon));

  //замена загрузки на данные
  // setTimeout(()=> {
    
  // }, 1000000);
  dwnld.classList.add('hidden');
  choosen.className = 'choosen';

}


function getWeather(currentPos, city, main) {
  let urlLL;
  if(currentPos != 0) {
    urlLL = `https://api.openweathermap.org/data/2.5/weather?lat=${currentPos.latitude}&lon=${currentPos.longitude}&appid=${apiKey}&units=metric`;
  } else {
    urlLL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  }
  
  if(main) {
    fetch(urlLL)
      .then(response => response.json())
      .then(data => {
        changeMain(data);
      })
      .catch(() => {
        console.log("Please search for a valid city 😩");
      });
  } else {
    createEmptyVidget(city);
    // setTimeout(()=>{

    // }, 1000000);
    fetch(urlLL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        createCityVidget(data);

      })
      .catch(() => {
        console.log("Please search for a valid city 😩");
        alert("Please search for a valid city 😩");
      });
  }
  
}
function errorPos(err){
  console.log("Geolocation declined by user. " + err);
  getWeather(0, defaultCity, true);
}


function showPosition(position) {
    currentPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    getCity(currentPos);
    getWeather(currentPos, 0 , true);
}
function createCityVidget(data) {

  const fav = document.getElementsByClassName('fav')[0];
  const elToDel = document.getElementsByClassName('del')[0];
  console.log(elToDel);
  if(elToDel) {
    elToDel.remove();
  }

  let city = document.createElement('div');
  city.className = 'city';
  let h3 = document.createElement('h3');
  h3.innerHTML = data.name;
  city.append(h3);
  let span = document.createElement('span');
  span.className = 'degs small';
  span.innerHTML = Math.round(data.main.temp) + String.fromCharCode(176) + 'C';
  city.append(span);
  let img = document.createElement('img');
  img.className = 'icon small';
  img.classList.add(checkIcon(data.weather[0].icon));
  city.append(img);
  let btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerHTML = 'x';
  btn.addEventListener('click', deleteVidget);
  city.append(btn);

  let ul = document.createElement('ul');
  ul.className = 'info';
  let li0 = document.createElement('li');
  let p0 = document.createElement('p');
  p0.innerHTML = 'Ветер';
  li0.append(p0);
  let p1 = document.createElement('p');
  p1.innerHTML = data.weather[0].description + ', ' + data.wind.speed + ' m/s, ' + checkDirection(data.wind.deg);
  li0.append(p1);
  let li1 = document.createElement('li');
  let p2 = document.createElement('p');
  p2.innerHTML = 'Погода';
  li1.append(p2);
  let p3 = document.createElement('p');
  p3.innerHTML = data.weather[0].main;
  li1.append(p3);
  let li2 = document.createElement('li');
  let p4 = document.createElement('p');
  p4.innerHTML = 'Давление';
  li2.append(p4);
  let p5 = document.createElement('p');
  p5.innerHTML = data.main.pressure + ' hpa';
  li2.append(p5);
  let li3 = document.createElement('li');
  let p6 = document.createElement('p');
  p6.innerHTML = 'Влажность';
  li3.append(p6);
  let p7 = document.createElement('p');
  p7.innerHTML = data.main.humidity + ' %';
  li3.append(p7);
  let li4 = document.createElement('li');
  let p8 = document.createElement('p');
  p8.innerHTML = 'Координаты';
  li4.append(p8);
  let p9 = document.createElement('p');
  p9.innerHTML = '[' + data.coord.lat.toFixed(2) + ', '+ data.coord.lon.toFixed(2) + ']';
  li4.append(p9);

  ul.append(li0);
  ul.append(li1);
  ul.append(li2);
  ul.append(li3);
  ul.append(li4);
  city.append(ul);
  fav.append(city);
  localStorage.setItem(data.name, '');
  
}

function createEmptyVidget(name) {
  const fav = document.getElementsByClassName('fav')[0];
  let city = document.createElement('div');
  city.className = 'city del';
  let h3 = document.createElement('h3');
  h3.innerHTML = name;
  city.append(h3);
  let btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerHTML = 'x';
  btn.addEventListener('click', deleteVidget);
  city.append(btn);
  let div = document.createElement('div');
  div.className = 'dwnld';
  let p = document.createElement('p');
  p.innerText = 'Погода загружается'
  let img = document.createElement('img');
  img.src = 'refresh.png';
  div.append(p);
  div.append(img);
  city.append(div);
  fav.append(city);

}
function addCity(e) {
  if(e.target.parentNode.childNodes[1].value != '') {
    const cities = document.getElementsByClassName('city');
    let city;
    for (let i=0; i < cities.length; i++) {
      if(cities[i].childNodes[0].innerHTML.toLowerCase() == e.target.parentNode.childNodes[1].value.toLowerCase()) {
        city = true;
      }
    }
    if(!city) {
      getWeather(0, e.target.parentNode.childNodes[1].value, false);
    }
    
  }
}
function deleteVidget(e) {
  console.log(e.target.parentNode.childNodes[0].innerText);
  localStorage.removeItem(e.target.parentNode.childNodes[0].innerText);
  e.target.parentNode.remove();

}




// start of the script
getLocation();
refresh_btn.addEventListener('click', getLocation);
for (let i = 0; i < del_btn.length; i++) {
  del_btn[i].addEventListener('click', deleteVidget);
}
plus_btn.addEventListener('click', addCity);
input.addEventListener('keydown', (e) => {
  if(e.keyCode == 13) {
    addCity(e);
  }
});
// localStorage.setItem('Moscow', '');
// localStorage.setItem('Helsinki', '');
let keys = Object.keys(localStorage);
for(let key of keys) {
  getWeather(0, key, false);
}

