let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-btn");
let locationSearch = document.getElementById("location-search");
let weatherData;
let result = document.getElementById("result");

searchBtn.addEventListener("click", () => {
    if(searchInput.value !="")
    {  fetchData(searchInput.value)
    }
    else{
      alert("Wrong input!")
    }
  });
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
locationSearch.addEventListener("click",()=>{
  console.log("working");
  
})

function renderCard()
{
 result.innerHTML=`<div class="w-full">
        <div class="w-full mx-auto p-5 bg-green-700 flex justify-between gap-1 rounded-xl" id="today-Card">
            
        </div>
ks      </div>` 
}