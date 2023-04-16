let searchButton = $("#search-button");
let searchInput = $("#search-input");
let cityBtn = [$("#city-1"), $("#city-2"), $("#city-3"), $("#city-4"), $("#city-5"), $("#city-6")];
let locationBtn = $(".location-btn");
let forecastDays =[$("#day-one"), $("#day-two"), $("#day-three"), $("#day-four"), $("#day-five")] ;
let dayTemp = [$("#temp-day-day1"), $("#temp-day-day2"), $("#temp-day-day3"), $("#temp-day-day4"), $("#temp-day-day5")];
let nightTemp = [$("#temp-night-day1"), $("#temp-night-day2"), $("#temp-night-day3"), $("#temp-night-day4"), $("#temp-night-day5")];
let windDays = [$("#wind-speed-day1"), $("#wind-speed-day2"), $("#wind-speed-day3"), $("#wind-speed-day4"), $("#wind-speed-day5")];
let humidityDays = [$("#humidity-day1"), $("#humidity-day2"), $("#humidity-day3"), $("#humidity-day4"), $("#humidity-day5")];
let forecast = $(".forecast")
let APIKey = "1f905548b7101976aa855eb9b92ca7ad";

let cities = [];
let locations = [];
let queryUrl = "";
let latitude; 
let longitude;
let forecastUrl;

let dateNow = moment().format('DD/MM/YYYY, h:mm a');

searchButton.click(function(event){
    event.preventDefault();
        userInput = searchInput.val();
        cities.push(userInput);
        forecast.removeClass("hide");
    
    
        // url for today weather api
        let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIKey + "&units=metric"
        console.log(queryUrl);
    
        //to get lat and lon from user input town
        let latUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&appid=" + APIKey;
     
        // definition - using geoplocation url, get latitude and longitude and add it to one call api endpoint 
        function getForecast(){
            return $.ajax({
                url: latUrl,
                method: "GET"
            }).then(function(response){
                let latitude = response[0].lat;
                let longitude = response[0].lon;
                // console.log(latitude);
                // console.log(longitude);
                //get forecast using lat and lon
                // let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey + "&units=metric";
                forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&appid=" + APIKey + "&units=metric";
                // console.log("forecasturl is: " + forecastUrl);
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
                    dayTemp[n].html(`Temp. day: ${Math.floor(response.daily[n].temp.day)}`);
                    nightTemp[n].html(`Temp.night: ${Math.floor(response.daily[n].temp.night)}`);
                    windDays[n].html(`Wind: ${Math.floor(response.daily[n].wind_speed)}`);
                    humidityDays[n].html(`Humidity: ${Math.floor(response.daily[n].humidity)}`);
                }
                for(let i = 0; i < forecastDays.length; i++){
                    let date = moment().add(i+1, 'days').format('DD/MM/YYYY');
                    forecastDays[i].html(date);
                }  
            })
        }
        
        });


    
    //definition - get todays weather information from current weather data api and display on the page 
        function getToday(){
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).then(function(response){
    
                $("#temp-today").html(`Temp: ${Math.floor(response.main.temp)}`);
                $("#wind-today").html(`Wind: ${Math.floor(response.wind.speed)}`);
                $("#humidity-today").html(`Humidity: ${Math.floor(response.main.humidity)}`);
                $("#current-town").html(`${userInput} ${dateNow}`);
            }
            )
        }
    
    getToday();  
    renderCities(); 

    $("#city-6").click(function(event){
        event.preventDefault();
        //localstorage.get(event.target(val))
        let cityName = $(this).text();
        console.log(cityName);

        let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=metric"
        console.log(`city btn, queryUrl: ${queryUrl}`);
    
        //to get lat and lon from user input town
        let latUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;
        console.log(`city btn, latUrl: ${latUrl}`);

        getForecast().then(function(forecastUrl){
            get5day(forecastUrl);
            console.log(forecastUrl);

        });

    
        })


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



    // function getTown(){
    //     let town = localStorage.getItem('city' + 2);
    //     userInput = town;
    //     return userInput;
    // }

    // getTown();


    
    

