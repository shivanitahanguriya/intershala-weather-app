let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-btn");
let locationSearch = document.getElementById("location-search");
let weatherData;
let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];

let result = document.getElementById("result");
searchRender()
searchBtn.addEventListener("click", () => {
  if (searchInput.value != "") {
    fetchData(searchInput.value);
    searchHistory.push(searchInput.value);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    searchRender()
  }
  else {
    alert("Wrong input!")
  }
});

function searchRender() {

  let searchComponent = document.getElementById("search-history");
  searchComponent.innerHTML = ``;

  if (searchHistory.length > 0) {
    let dropdown = `<select id="search-dropdown" class="cursor-pointer px-4 py-2 my-4 bg-white border border-gray-300 rounded-lg shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select a city</option>`;
    searchHistory.forEach((item) => {
      dropdown += `<option value="${item}" class="text-gray-900">${item}</option>`;
    });
    dropdown += `</select>`;
    searchComponent.innerHTML = dropdown;

    document.getElementById("search-dropdown").addEventListener("change", function () {
      if (this.value) {
        fetchData(this.value);
      }
    });
  }
}



// Event listener for location search button click
locationSearch.addEventListener("click", () => {
  getLocation()
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  // Function to handle the position data
  function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
      "Longitude: " + position.coords.longitude);
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&apiKey=91e87dcafbff4f3aa8b90ab6c977a07b`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        fetchData(data.results[0].city)
      })
  }
})
function fetchData(location) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=622b8bb056e542c6a7865159251302&q=${location}&days=6&aqi=no&alerts=no`
  ) // fetching weather data using location variable
    .then((res) => res.json())
    .then((data) => {
      weatherData = data;
      console.log(weatherData);
      renderCard()
      return 1;
    })
    .catch((e) => {
      alert(e);
      return 0;
    });
}
// Event listener for location search button click
locationSearch.addEventListener("click", () => {
  console.log("working");

})

function renderCard() {
  result.innerHTML = `<div class="w-full">
      <div class="w-full mx-auto p-5 bg-green-700 flex justify-between gap-1 rounded-xl text-white shadow-lg" id="today-Card">
      </div>
      <p class="text-3xl my-5 font-semibold text-center">5-Day Forecast</p>
      <div class="overflow-x-auto">
          <ul class="flex gap-5 px-3" id="forecast">
          </ul>
      </div>
    </div>`;

  let todayCard = document.getElementById("today-Card");
  let forecast = document.getElementById("forecast");
  forecast.innerHTML = ``;
  todayCard.innerHTML = ``;

  // Today's Weather Card
  todayCard.innerHTML = `
      <div class="w-2/3 flex flex-col gap-3">
          <div>
             <p class="text-2xl font-semibold">${weatherData.location.name} (${weatherData.forecast.forecastday[0].date})</p>
             <p>${weatherData.location.region}, ${weatherData.location.country}.</p>
          </div>
          <p class="mt-3">🌡️ Temperature: ${weatherData.current.temp_c} °C</p>
          <p>💧 Humidity: ${weatherData.current.humidity}%</p>
          <p>🌬️ Wind: ${weatherData.current.wind_mph} Mph</p>
      </div>
      <div class="w-1/3 flex flex-col items-center justify-end">
          <img src="https:${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}">
          <p>${weatherData.current.condition.text}</p>
      </div>`;

  // 5-Day Forecast with Green Background
  weatherData.forecast.forecastday.forEach((day, idx) => {
      forecast.innerHTML += `
          <li class="bg-green-700  text-white rounded-2xl shadow-lg p-5 w-64 flex flex-col items-center justify-between transform hover:scale-105 transition duration-300">
              <p class="font-semibold text-lg">${formatDate(day.date)}</p>
              <img class="mx-auto my-3 w-20 h-20" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
              <p class="text-sm italic">${day.day.condition.text}</p>
              <div class="mt-3 w-full text-center space-y-2">
                  <p class="text-lg bg-white/20 px-3 py-1 rounded-lg">🌡️ <span class="font-bold">${day.day.avgtemp_c}°C</span></p>
                  <p class="bg-white/20 px-3 py-1 rounded-lg">💧 <span class="font-bold">${day.day.avghumidity}%</span></p>
                  <p class="bg-white/20 px-3 py-1 rounded-lg">🌬️ <span class="font-bold">${day.day.maxwind_mph} Mph</span></p>
              </div>
          </li>`;
  });
}

// Helper function to format the date
function formatDate(dateStr) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
