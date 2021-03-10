const refresh_btn = document.getElementById("refresh");
const del_btn = document.getElementsByClassName("btn");
const plus_btn = document.getElementsByClassName("plus_btn")[0];
const input = document.querySelector(".form input");
const apiKey = "7dcbf87ae275b086af805e94f3395b91";
const inputVal = "Moscow";
const host = 'http://127.0.0.1:3000';
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
      getWeather(result['suggestions'][0]['data']['city'], 1)
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
    return 'sunny';
  } else if (icon == '02d' | icon == '02n') {
    return 'partly-cloudy';
  } else if (icon == '03d' | icon == '03n') {
    return 'cloudy';
  } else if (icon == '04d' | icon == '04n') {
    return 'mostly-cloudy';
  } else if (icon == '09d' | icon == '09n') {
    return 'showers';
  } else if (icon == '10d' | icon == '10n') {
    return 'drizzle';
  } else if (icon == '11d' | icon == '11n') {
    return 'thunderstorm';
  } else if (icon == '13d' | icon == '13n') {
    return 'snow';
  } else if (icon == '50d' | icon == '50n') {
    return 'foggy';
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
  tempTitle.innerText = data.temp + String.fromCharCode(176) + 'C';
  list[1].innerText = data.wind;
  list[3].innerText = data.desc;
  list[5].innerText = data.pres;
  list[7].innerText = data.hum;
  list[9].innerText = data.coords;
  // icon.classList.add(checkIcon(data.icon));
  console.log(icon);
  icon.src = `/lab3/client/assets/icons/${checkIcon(data.icon)}.png`;

  //замена загрузки на данные
  // setTimeout(()=> {
    
  // }, 1000000);
  dwnld.classList.add('hidden');
  choosen.className = 'choosen';

}


async  function getWeather(city, main, currentPos='') {
  let urlLL = host;
  if(currentPos.length != 0) {
     urlLL += `/weather/coordinates?lon=${currentPos.lon}&lat=${currentPos.lat}`;
  } else {
    urlLL += `/weather/city?q=${city}`;
  }
  // console.log(urlLL);
  if(main) {
    try {
      let resp =  await fetch(urlLL);
      let data = await resp.json();
      changeMain(data);
      // console.log(data);
    } catch(err) {
      console.log("Please search for a valid city 😩");
    }
    
  } else {
    try{
      createEmptyVidget(city);
      let resp =  await fetch(urlLL);
      let data = await resp.json();
      createCityVidget(data);
    } catch(err) {
      console.log("Please search for a valid city 😩");
      // alert("Please search for a valid city 😩");
    }

    // setTimeout(()=>{

    // }, 1000000);
  }
  
}
function errorPos(err){
  console.log("Geolocation declined by user. " + err);
  getWeather(defaultCity, true);
}

function showPosition(position) {
    currentPos = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    // getCity(currentPos);
    getWeather(0, true, currentPos);
}
function createCityVidget(data) {
  // console.log(data);
  const fav = document.getElementsByClassName('fav')[0];
  const elToDel = document.getElementsByClassName('del')[0];
  // console.log(elToDel);
  if(elToDel) {
    elToDel.remove();
  }

  let city = document.createElement('div');
  city.className = 'city';
  console.log(data.icon);
  let text = `<h3>${data.name}</h3>
              <span class="degs small">${data.temp}&degC</span>
              <img class="icon" src="/lab3/client/assets/icons/${checkIcon(data.icon)}.png">
              <button class="btn">x</button>
              <ul class="info">
                  <li>
                      <p>Ветер</p>
                      <p>${data.wind}</p>
                  </li>
                  <li>
                      <p>Облачность</p>
                      <p>${data.desc}</p>
                  </li>
                  <li>
                      <p>Давление</p>
                      <p>${data.pres}</p>
                  </li>
                  <li>
                      <p>Влажность</p>
                      <p>${data.hum + ' %'}</p>
                  </li>
                  <li>
                      <p>Координаты</p>
                      <p>${data.coords}</p>
                  </li>
              </ul>`
  city.innerHTML = text;
  fav.append(city);
  const cities = document.getElementsByClassName('city');
  if(cities.length != 0) {
    for(let i=0; i < cities.length; i++) {
      if(cities[i].childNodes[0].innerText == data.name) {
        cities[i].childNodes[6].addEventListener('click', deleteVidget);
        // console.log(cities[i].childNodes);
      }
    }
  }
  
}

function createEmptyVidget(name) {
  const fav = document.getElementsByClassName('fav')[0];
  let city = document.createElement('div');
  city.className = 'city del';
  let text = `<h3>${name}</h3>
              <button class="btn">x</button>
              <div class="dwnld">
                  <p>Подождите</p>
                  <img src="refresh.png" alt="">
              </div>`;
  city.innerHTML = text;
  fav.append(city);

}
function addCity(e) {
  if(e.target.parentNode.childNodes[1].value != '') {
    // const cities = document.getElementsByClassName('city');
    // let city;
    // for (let i=0; i < cities.length; i++) {
    //   if(cities[i].childNodes[0].innerHTML.toLowerCase() == e.target.parentNode.childNodes[1].value.toLowerCase()) {
    //     city = true;
    //   }
    // }
    // if(!city) {
    //   getWeather(e.target.parentNode.childNodes[1].value, false);
    // }
    addFav(e.target.parentNode.childNodes[1].value);
    
  }
}
async function deleteVidget(e) {
  let url = host + `/favourites?q=${e.target.parentNode.childNodes[0].innerText}`;
  try {
    let resp =  await fetch(url, {method: 'DELETE'});
    let data = await resp.json();
    console.log(data);
    if(data.mes == 'OK') {
      e.target.parentNode.remove();
    }
    
  } catch(err) {
    console.log("Please search for a valid city 😩");
  }

}
async function getFav(){
  let url = host + `/favourites`
  try {
    let resp =  await fetch(url);
    let data = await resp.json();
    if(data.length != 0) {
      data.forEach(el => {
        getWeather(el.name, false);
      });
    }
    console.log(data);
  } catch(err) {
    console.log("Please search for a valid city 😩");
  }
}
async function addFav(city){
  city = city.charAt(0).toUpperCase() + city.slice(1)
  let url = host + `/favourites?q=${city}`;
  console.log('here');
  try {
    let resp =  await fetch(url, {method: 'POST'});
    let data = await resp.json();
    console.log('here2');
    console.log(data);
    if(data.mes == 'OK') {
      getWeather(city, false);
    }
    // console.log(data);
  } catch(err) {
    console.log("Please search for a valid city 😩");
  }
}



// start of the script
getLocation();
getFav();
refresh_btn.addEventListener('click', getLocation);
plus_btn.addEventListener('click', addCity);
input.addEventListener('keydown', (e) => {
  if(e.keyCode == 13) {
    addCity(e);
  }
});



//запрос по городу
// fetch(`http://127.0.0.1:3000/weather/city?q=Moscow`)
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log("error", error));
// //запрос по координатам
// fetch(`http://127.0.0.1:3000/weather/coordinates?lon=30.2642&lat=59.8944`)
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log("error", error));



// fetch(`http://127.0.0.1:3000/favourites?q=Perm`, {
//   method: 'POST'
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log("error", error));

// fetch(`http://127.0.0.1:3000/favourites`)
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log("error", error));

// fetch(`http://127.0.0.1:3000/favourites?q=ewe`, {
//   method: 'DELETE'
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log("error", error));