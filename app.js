let weather = {
    "apiKey":"a5c715fabb0b987da68f3b89d88c667e", //api key
    fetchWeather: function (city) {
        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=imperial&appid=" +
            this.apiKey
        )
        
        .then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
    },

    displayWeather: function(data){ //Making data useable 
        const { name } = data;
        const { icon, description } = data.weather[0]; 
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name; //replaces city name
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " MP/H";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/2448x3264/?"+ name +"')";
    },

    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);//gets text put in search bar
    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
      var apikey = "ca43f577504d4dab9a0470c7d1d8fee8";
  
      var api_url = "https://api.opencagedata.com/geocode/v1/json";
  
      var request_url =
        api_url +
        "?" +
        "key=" +
        apikey +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";
  
      var request = new XMLHttpRequest();
      request.open("GET", request_url, true);
  
      request.onload = function () {

  
        if (request.status == 200) {
          // Success!
          var data = JSON.parse(request.responseText);
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city)
        } else if (request.status <= 500) {
          // We reached our target server, but it returned an error
  
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log("error msg: " + data.status.message);
        } else {
          console.log("server error");
        }
      };
  
      request.onerror = function () {
        // There was a connection error of some sort
        console.log("unable to connect to server");
      };
  
      request.send(); // make the request
    },
    getLocation: function() {
      function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else {
        weather.fetchWeather("Huston");
      }
    }
  };

document.querySelector(".search button").addEventListener("click", function(){
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        weather.search();
    } 
 });

 geocode.getLocation();