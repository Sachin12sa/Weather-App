// Name: Sachin Adhikari
// Uni Id: 2358849

const apiKey = "38ce8019fc89be349cb860f518d8b0bb";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".icons-image");
const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const pressureElement = document.querySelector(".pressure");
const dateElement = document.querySelector(".Date-Time");
const errorElement = document.querySelector(".error");

function handleCitySearch() {
  const searchedCity = searchBox.value.trim();
  if (searchedCity) {
    checkWeather(searchedCity);
    const errorMessage = document.querySelector(".error");
    errorMessage.textContent = ""; // Reset error message
  } else {
    const errorMessage = document.querySelector(".error");
    errorMessage.textContent = "Please provide a city name to get the weather information.";
  }
}

searchBtn.addEventListener("click", handleCitySearch);

searchBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCitySearch();
  }
});

async function checkWeather(city) {
  if (navigator.onLine) {
    try {
      // Fetch weather data from the API
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=cde16a10e4f47f8d2eca8e973d6f52ed`);
      const data = await response.json();
  
      if (data.cod === "404") {
        const errorMessage = document.querySelector(".error");
        errorMessage.textContent = "The city you entered is not available. Please try again.";
        return;
      }
  
      // Update weather details on the page
      // Store the fetched weather data to localStorage
      localStorage.setItem(city, JSON.stringify(data));
      displayWeather(data);
  
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  } else {
    const savedData = JSON.parse(localStorage.getItem(city));
    if (savedData) {
        displayWeather(savedData); // Display the saved data
    } else {
        const errorMessage = document.querySelector(".errors");
        errorMessage.textContent = "No data available for the selected city.";
    }
  }
  
  
}

// Show weather information for the default city (Kathmandu) on page load
window.addEventListener("DOMContentLoaded", () => {
  if (!navigator.onLine) {
    const errorMessage = document.querySelector(".errors");
    errorMessage.textContent = "You are currently offline. Please check your internet connection.";
    return;
  }
  checkWeather("Reigate");
});


function sendData(weatherData) {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "connects.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {
    // Check if the request is complete
    if (this.readyState == 4) {
      if (this.status == 200) {
        // Handle successful response
        console.log(this.responseText);
      } else {
        // Handle error
        console.error("Error in sending data to server:", this.statusText);
      }
    }
  };

  // Handle any errors that aren't the result of HTTP status codes (e.g., network errors)
  xhr.onerror = function() {
    console.error("There was an error making the request.");
  };

  xhr.send(JSON.stringify(weatherData));
}

function convertToSQLDatetime(apiDatetime) {
    // If it's a UNIX timestamp (i.e., a number or a string that only contains digits)
    if (typeof apiDatetime === 'number' || /^\d+$/.test(apiDatetime)) {
        return new Date(apiDatetime * 1000).toISOString().slice(0, 19).replace('T', ' ');
    }

    // If it's already in a string format (e.g., ISO format)
    const dateObj = new Date(apiDatetime);
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
}

function viewData(cityname){
  console.log("VIEWDATA: Running")
  var form = document.createElement('form');
  form.method = 'POST';
  form.action = 'weather.php';

  var hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = 'city';
  hiddenField.value = cityname;

  form.appendChild(hiddenField);
  document.body.appendChild(form);

  form.submit();

  document.body.removeChild(form);
}

function displayWeather(data){
  document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".pressure").textContent =
      data.main.pressure + "hPa";
    document.querySelector(".humidity").textContent =
      data.main.humidity + "%";
    document.querySelector(".wind").textContent =
      data.wind.speed + " km/h";
    document.querySelector(".Date-Time").textContent = convertToSQLDatetime(data.dt);

    // Get and display weather description
    const weatherDescription = data.weather[0].description;
    
    // Update weather icon based on weather condition using OpenWeatherMap API
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    weatherIcon.src = iconUrl;

    // Format and display the current date and time
    const currentDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };


    formattedDate= convertToSQLDatetime(data.dt);

    // Prepare weather data for sending to PHP script
    const weatherData = {
      city: data.name,
      date_accessed: formattedDate, // Send the formatted date here
      temperature: Math.round(data.main.temp),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
    };
    
    sendData(weatherData);
    document.getElementById('viewdata').addEventListener('click',()=>{
      viewData(data.name);
    })
}