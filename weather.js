// Name : Sachin Adhikari
// Uni Id:2348849

const apiKey = "38ce8019fc89be349cb860f518d8b0bb";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const pressureElement = document.querySelector(".pressure");
const errorElement = document.querySelector(".error");

async function checkWeather(city) {
  const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

  if (response.status === 404) {
    errorElement.style.display = "block";
    cityElement.innerHTML = "";
    tempElement.innerHTML = "";
    humidityElement.innerHTML = "";
    windElement.innerHTML = "";
    pressureElement.innerHTML = "";
    weatherIcon.src = "";
  } else {
    errorElement.style.display = "none";
    const data = await response.json();

    console.log(data);

    cityElement.innerHTML = data.name;
    tempElement.innerHTML = Math.round(data.main.temp) + "°C";
    humidityElement.innerHTML = data.main.humidity + "%";
    windElement.innerHTML = data.wind.speed + " km/h";
    pressureElement.innerHTML = data.main.pressure + "hPa";

    const weatherMain = data.weather[0].main;
    if (weatherMain === "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (weatherMain === "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (weatherMain === "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (weatherMain === "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (weatherMain === "Mist") {
      weatherIcon.src = "images/mist.png";
    }
  }
}

function getCurrentDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return now.toLocaleDateString("en-US", options);
}
const dateElement = document.querySelector(".date");
dateElement.innerHTML = "Date and Time: " + getCurrentDateTime();

const defaultCity = "Reigate & Banstead";
checkWeather(defaultCity);

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city !== "") {
    checkWeather(city);
  }
});
