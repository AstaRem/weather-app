let searchButton = $("#search-button");
let searchInput = $("#search-input");
let cityBtn = [$("#city-1"), $("#city-2"), $("#city-3"), $("#city-4"), $("#city-5"), $("#city-6")];
let locationBtn = $(".location-btn");
let forecastDays =[$("#day-one"), $("#day-two"), $("#day-three"), $("#day-four"), $("#day-five")] ;
let dayTemp = [$("#temp-day-day1"), $("#temp-day-day2"), $("#temp-day-day3"), $("#temp-day-day4"), $("#temp-day-day5")];
let nightTemp = [$("#temp-night-day1"), $("#temp-night-day2"), $("#temp-night-day3"), $("#temp-night-day4"), $("#temp-night-day5")];
let windDays = [$("#wind-speed-day1"), $("#wind-speed-day2"), $("#wind-speed-day3"), $("#wind-speed-day4"), $("#wind-speed-day5")];
let humidityDays = [$("#humidity-day1"), $("#humidity-day2"), $("#humidity-day3"), $("#humidity-day4"), $("#humidity-day5")];
let forecast = $(".forecast");
let images = [$("#day1-img"), $("#day2-img"), $("#day3-img"), $("#day4-img"), $("#day5-img") ]
let APIKey = "1f905548b7101976aa855eb9b92ca7ad";

let cities = [];
let locations = [];
let queryUrl = "";
let latitude; 
let longitude;

//to get current date:
let dateNow = moment().format('DD/MM/YYYY, h:mm a');

searchButton.click(function(event){
    event.preventDefault();
    let userInput = searchInput.val();
    cities.push(userInput);
    forecast.removeClass("hide");

    // url for today weather api
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIKey + "&units=metric"
    console.log(queryUrl);

    //to get lat and lon from user input town
    let latUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&appid=" + APIKey;
 
    // definition - using geolocation url, get latitude and longitude and add it to one call api endpoint 
    function getForecast(){
        return $.ajax({
            url: latUrl,
            method: "GET"
        }).then(function(response){
            let latitude = response[0].lat;
            let longitude = response[0].lon;

            let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&appid=" + APIKey + "&units=metric";
            return forecastUrl;
        })
    }

    
    //definition -using forecastUrl, make call to one call api and get the forecast for 7 days(but i will be using only first 5). then display forecast information on page.
    function get5day(forecastUrl){
        return $.ajax({
            url: forecastUrl,
            method:"GET"
        }).then(function(response){
            for(let n = 0; n < forecastDays.length; n++){
                //displays weather image
                let iconCode = response.daily[n].weather[0].icon;
                let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                images[n].attr("src", iconUrl );
                //displays weather details
                dayTemp[n].html(`Temp. day: ${Math.floor(response.daily[n].temp.day)}C`);
                nightTemp[n].html(`Temp.night: ${Math.floor(response.daily[n].temp.night)}C`);
                windDays[n].html(`Wind: ${Math.floor(response.daily[n].wind_speed)}m/s`);
                humidityDays[n].html(`Humidity: ${Math.floor(response.daily[n].humidity)}%`);
            }
            for(let i = 0; i < forecastDays.length; i++){
                let date = moment().add(i+1, 'days').format('DD/MM/YYYY');
                forecastDays[i].html(date);
            }  
        })
    }
    
    getForecast().then(function(forecastUrl){
        get5day(forecastUrl);
    });

//definition - get todays weather information from current weather data api and display on the page 
    function getToday(){
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            let iconCodeToday = response.weather[0].icon;
            let iconUrlToday = "https://openweathermap.org/img/w/" + iconCodeToday + ".png";
            $("#today-img").attr("src", iconUrlToday );


            $("#temp-today").html(`Temp: ${Math.floor(response.main.temp)}C`);
            $("#wind-today").html(`Wind: ${Math.floor(response.wind.speed)}m/s`);
            $("#humidity-today").html(`Humidity: ${Math.floor(response.main.humidity)}%`);
            $("#current-town").html(`${userInput} ${dateNow}`);
        }
        )
    }


    getToday();

   renderCities(); 

})

function renderCities(){
    if(cities.length > 6){
        cities.shift();
    }
    
    for(let i = 0; i < cities.length; i++){
        localStorage.setItem(`city${i}`, cities[i] )
    }
    
    for ( let b = 0; b < locationBtn.length; b++){
        console.log(locationBtn[b]);
        locationBtn[b].textContent = localStorage.getItem('city' + b);
        locationBtn.removeClass('hide');
    }
    
}

renderCities();


