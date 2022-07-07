const getLocation = document.getElementById("getLocation");
const result = document.querySelector(".result");
const loc = document.querySelector(".location");
const status = document.querySelector(".status");
const temp = document.querySelector(".temp");
const gust = document.querySelector(".gust");
const humidity = document.querySelector(".humidity");
const lastUpdated = document.querySelector(".lastUpdated");
const chooseLocation = document.querySelector("#cityId");
const sevenDayForecast = document.querySelector('.sevenDays')

defaultLocation();

async function fetchWeatherInfo(lat, long, selectedLocation) {
    let res;

    const locationToFetch = lat?`${lat},${long}`:selectedLocation;
    const KEY = 'db58337b401b449eba4155053210506'
    const URL = `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${locationToFetch}`

    await fetch(URL).then(res => res.json()).then(data => {
        res=data;
    })

    loc.innerHTML = `Location: ${res.location.name}, ${res.location.region}, ${res.location.country}`
    status.innerHTML = ` ${res.current.condition.text}`
    let IMG = document.createElement('img');
    IMG.src = res.current.condition.icon;
    IMG.style.height = '150px';
    IMG.alt = 'weather';
    IMG.style.display = 'block';
    status.prepend(IMG);
    temp.innerHTML = `Temperature: ${res.current.temp_c} &#8451;`
    gust.innerHTML = ` Gust: ${res.current.gust_kph} Km/h`
    humidity.innerHTML = `Humidity: ${res.current.humidity}`
    lastUpdated.innerHTML = `Last updated: ${res.current.last_updated}`
    fetchSevenDayForecast(lat, long);
}

function getPosition(pos){
    const LATITUDE = pos.coords.latitude
    const LONGITUDE = pos.coords.longitude
    fetchWeatherInfo(LATITUDE, LONGITUDE);
}

const fetchLocation = () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition);
    }
    else {
        result.innerHTML = "Location can't be found.";
    }
}

async function defaultLocation(){
    const DEFAULT_LOCATION = 'delhi';
    fetchWeatherInfo(null, null, DEFAULT_LOCATION);
}

async function manualFetch() {
    let selectedLocation = chooseLocation.value;
    if(selectedLocation){
        selectedLocation = selectedLocation.toLowerCase();
        fetchWeatherInfo(null, null, selectedLocation);
    }
}

async function fetchSevenDayForecast(lat, long){
    let res;

    sevenDayForecast.innerHTML = "";

    if(!lat){
        lat = 28.7041;
        long = 77.1025;
    }
    const KEY = 'e6e44faceae3c29b6fcc22ba3d8f6af9'
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${KEY}`

    await fetch(URL).then(res => res.json()).then(data => {
        const { daily } = data;
        res = daily;
    })

    for(i=0;i<res.length;++i){
        let div = document.createElement('div');
        div.classList.add('card');
        const dateObj = new Date(res[i].dt * 1000)
        const orgDate = dateObj.toLocaleString("en-US", {dateStyle: "medium" })
        div.innerHTML = `
            <div>${orgDate}</div>
            <div>Max Temp. : ${res[i].temp.max} &#8451;</div>
            <div>Min Temp. : ${res[i].temp.min} &#8451;</div>
            <div>${res[i].weather[0].description}</div>
        `
        let IMG = document.createElement('img');
        IMG.src = `http://openweathermap.org/img/wn/${res[i].weather[0].icon}@2x.png`;
        IMG.style.height = '100px';
        IMG.alt = 'weather';
        IMG.style.display = 'block';
        div.prepend(IMG);
        sevenDayForecast.appendChild(div)
    }

}
