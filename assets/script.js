var apiKey = "f2292634fb2199963fd126ef10138c32";
var numberOfResult = 1;
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");


// make an event listener when search is clicked
searchButton.addEventListener("click", () => {
  //get value input by user and stores it as a constatant. lastly it pass it to functions that need this conastant. 
  const cityName = cityInput.value;
  if (cityName) {
    getCity(cityName);
    saveCityToLocalStorage(cityName);
    addCityToSearchHistory(cityName);
    cityInput.value = ""; // Clear the search input after a successful search
  }
});

//gets the city name input by the user. It is than seach by using an API. It is than gets the longitute and lattitude 
//and city name and pass it to a funtion that gets the weather. 
function getCity(cityName) {
  var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${numberOfResult}&appid=${apiKey}`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeather(lat, lon, cityName);
      }
    });
    
}


//gets a five day forcast of the city searched by using an API and getting it by using the lat and lon of the city. 
function getWeather(lat, lon, cityName) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const weatherList = data.list;
      const forcastWeather = weatherList.filter((weatherData) =>
        weatherData.dt_txt.includes("12:00:00") // this is to filter the data so we can easily get a 5 day forcast rather than every 3 hours
      );
      console.log("5-day forecast:", forcastWeather);
      displayCurrentWeather(cityName, data.list[0]); // Display current weather data
      displayForecastData(forcastWeather);
    });
}

//this is to display the current weather. 
function displayCurrentWeather(cityName, weatherData) {

  // this is be able to clear previouse elements in this part of the html
  const currentContainer = document.getElementById("currentWeather");
  currentContainer.innerHTML = ""; // Clear previous forecast data
  const cityPicked = cityName;

  //create a div
  const forecastItem = document.createElement("div");
  //add the div to the html
  forecastItem.classList.add("currentWeatherEl");
  //calculate the wind speed in Km per hour.
  const windSpeedKmph = (weatherData.wind.speed * 3.6).toFixed(1);
//gets the date
  const date = new Date(weatherData.dt * 1000);
  //get the date and store as a string
  const dateString = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  //sets and format what is need 
  forecastItem.innerHTML = `
    <h1>${cityPicked}</h1>
    <h4>${dateString}</h4>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">
    <p>Temp: ${weatherData.main.temp.toFixed(1)}°C</p>
    <p>Wind Speed: ${windSpeedKmph} km/h</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
  `;
  //feeds the data and sends it to the html
  currentContainer.appendChild(forecastItem);
}

function displayForecastData(forecastData) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast data
  
    forecastData.forEach((weatherData) => {
      const forecastItem = document.createElement("div");
      //adds a class
      forecastItem.classList.add("row");
      //gets wind speed
      const windSpeedKmph = (weatherData.wind.speed * 3.6).toFixed(1);
 
  //gets the date
      const date = new Date(weatherData.dt * 1000);
       //get the date and store as a string
      const dateString = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        //sets and format what is need 
      forecastItem.innerHTML = `
        <h2>${dateString}</h2>
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">
        <p>Temp: ${weatherData.main.temp.toFixed(1)}°C</p>
        <p>Wind Speed: ${windSpeedKmph} km/h</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
      `;
    //feeds the data and sends it to the html
      forecastContainer.appendChild(forecastItem);
    });
  }
  
  
  
  //saves the city
  function saveCityToLocalStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    if (!cities.includes(cityName)) {
      cities.push(cityName);
      localStorage.setItem("searchedCities", JSON.stringify(cities));
    }
  }
  
  //loads city searched 
  function loadAllCitiesFromLocalStorage() {
    const cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    cities.forEach((cityName) => {
      addCityToSearchHistory(cityName);
    });
  }
  
  //loads the fucntion 
  loadAllCitiesFromLocalStorage();
  
  //function to get the city name searched and creates a button and acts as a previourse search list
  function addCityToSearchHistory(cityName) {
    const searchHistory = document.getElementById("searchHistory");
    const cityButton = document.createElement("button");
    
    cityButton.textContent = cityName;
    cityButton.classList.add("history-button");
    cityButton.addEventListener("click", () => {
      getCity(cityName);
    });
    
  
    searchHistory.appendChild(cityButton);
  }
  