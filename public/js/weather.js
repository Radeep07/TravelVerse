/* $(document).ready(function () {

  $("#pac-input").change(function (e) {
    e.preventDefault();
    var apikey = "&appid=c63725fc3433c437d23d3a51038313a5";
    //forecast for the next 5 days
    var url = "https://api.openweathermap.org/data/2.5/forecast?";
    $.ajax({
      url: url + "lat=" + latitude + "&lon=" + longitude + units + apikey,
      method: "GET"
    }).then(function (response) {
      getForecast(response);
    });

  });

  //get weather forecast of the next 5 days
  function getForecast(response) {
    console.log(response);
    var meanTimeWeatherList = [];
    var today = moment().format("YYYY-MM-DD");
    for (var i = 0; i < response.list.length; i++) {
      //splitting the date and time to get weather forecast after 12:00PM of the next day
      var arr = response.list[i].dt_txt.split(" ");
      if (arr[1] === "12:00:00") {
        meanTimeWeatherList.push(response.list[i]);
      }
    }
    //shifting is to go for the forecast of next 5 days and no to include the current day
    meanTimeWeatherList.shift();
    //adding the last noted weather of the 5th day 
    meanTimeWeatherList.push(response.list[response.list.length - 1]);
    //displaying the forecast using the forecast class to crate blocks for each of the day's forecast
    var forecastList = document.querySelectorAll("#weatherForecast");
    //$("h4").attr("style", "display:block;");
    for (var i = 0; i < meanTimeWeatherList.length; i++) {
      for (var j = 0; j < forecastList.length; j++) {
        //to fill the forecast details (using the attribute next-day) of the next 5 days
        if (parseInt(forecastList[j].getAttribute("next-day")) === i) {
          forecastList[j].setAttribute("style", "display:block;");
          //creating date, icon, temperature and humidity tags to save the forecast details
          var dateTag = document.createElement('p');
          var iconTag = document.createElement('img');
          var tempTag = document.createElement('p');
          var humidityTag = document.createElement('p');
          //unix timestamp for the forecast record
          var dateString = moment.unix(meanTimeWeatherList[i].dt).format("MM/DD/YYYY");
          dateTag.innerHTML = dateString;
          dateTag.setAttribute("style", "font-size: 20px; font-weight: bold;");
          var iconurl = "http://openweathermap.org/img/w/" + meanTimeWeatherList[i].weather[0].icon + ".png";
          iconTag.setAttribute("src", iconurl);
          iconTag.setAttribute("height", "60px");
          iconTag.setAttribute("style", "padding-bottom: 5px;");
          var tempF = meanTimeWeatherList[i].main.temp;
          tempTag.innerHTML = "Temp: " + tempF + " \u2109";
          humidityTag.innerHTML = "Humidity: " + meanTimeWeatherList[i].main.humidity + "%";
          //clear off the previous forecast contents
          forecastList[j].innerHTML = "";
          forecastList[j].appendChild(dateTag);
          forecastList[j].appendChild(iconTag);
          forecastList[j].appendChild(tempTag);
          forecastList[j].appendChild(humidityTag);
        }
      }
    }
  }
});

 */