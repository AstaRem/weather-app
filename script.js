let searchButton = $("#search-button");
let searchInput = $("#search-input");
let cityBtn = [$("#city-1"), $("#city-2"), $("#city-3"), $("#city-4"), $("#city-5"), $("#city-6")];
let locationBtn = $(".location-btn");
let forecastDays =[$("#day-one"), $("#day-two"), $("#day-three"), $("#day-four"), $("#day-five")] ;
let APIKey = "1f905548b7101976aa855eb9b92ca7ad";

let cities = [];
let locations = [];
let queryUrl = "";
let latitude; 
let longitude;

let dateNow = moment().format('DD/MM/YYYY, h:mm a');
// response.list["dt_txt"];

searchButton.click(function(event){
    event.preventDefault();
    let userInput = searchInput.val();
    cities.push(userInput);
    // url for today weather api
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIKey + "&units=metric"
    console.log(queryUrl);

    //to get lat and lon from user input town
    let latUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&appid=" + APIKey;

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
            for(let n = 0; n < response.daily.length; n++){
                console.log(response.daily[n].temp.day);
                console.log(response.daily[n].temp.night);
                console.log(response.daily[n].wind_speed);
                console.log(response.daily[n].humidity);
    
            }
            for(let i = 0; i < forecastDays.length; i++){
                let date = moment().add(i+1, 'days').format('DD/MM/YYYY');
                forecastDays[i].html(date);
                // let timestamp = date.unix();
                // console.log(`${date} - ${formattedDate} - ${timestamp}`)
                // if(response.list[i].dt == 1681462800){
                //     console.log('timestamp is matching!')
                // }
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
            $("#current-town").html(`${userInput} ${dateNow}`);
            // console.log(response.main.temp);
            // console.log(response.wind.speed);
            // console.log(response.main.humidity)
        }
        )
    }

    getToday();


    if(cities.length > 6){
        cities.shift();
    }
    
    for(let i = 0; i < cities.length; i++){
        // localStorage.setItem("city" + i, cities[i] )
        localStorage.setItem(`city${i}`, cities[i] )
    }

    for ( let b = 0; b < locationBtn.length; b++){
        console.log(locationBtn[b]);
        locationBtn[b].textContent = localStorage.getItem('city' + b);
        locationBtn.removeClass('hide');

        // if((locationBtn[b].textContent) != ""){
        //     console.log(locationBtn[b].textContent);
            
        //     // locationBtn.addClass('visible');
    
        // }

    }

})

