for (let  c = 0; c < cityBtn.length; c++){


cityBtn[c].click(function(event){
    event.preventDefault();
    forecast.removeClass("hide");

    console.log(`You have clicked ${cityBtn[c].attr("id")}`);
    let townName = $(this). text();
    console.log(townName);
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + townName + "&appid=" + APIKey + "&units=metric"
    console.log(queryUrl);

    let latUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + townName + "&appid=" + APIKey;
    console.log(latUrl)

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
            let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&appid=" + APIKey + "&units=metric";
            console.log("forecasturl is: " + forecastUrl);

            return forecastUrl;
        })
    }

    function get5day(forecastUrl){
        return $.ajax({
            url: forecastUrl,
            method:"GET"
        }).then(function(response){
            for(let n = 0; n < forecastDays.length; n++){
                console.log(`here is response: ${response.daily[n].pressure}`)

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
    
    getForecast().then(function(forecastUrl){
        get5day(forecastUrl);
    });

    function getToday(){
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){

            $("#temp-today").html(`Temp: ${Math.floor(response.main.temp)}`);
            $("#wind-today").html(`Wind: ${Math.floor(response.wind.speed)}`);
            $("#humidity-today").html(`Humidity: ${Math.floor(response.main.humidity)}`);
            $("#current-town").html(`${townName} ${dateNow}`);
        }
        )
    }


    getToday();

})

}