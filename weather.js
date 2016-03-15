'use strict';

var myApp = angular.module('myApp', ['ngAnimate', 'ui.bootstrap']);
myApp.controller('TypeaheadCtrl', function($scope, $http) {
  $scope.btnText = "get weather";
  //$scope.test = "false";
  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(val) {
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };

  $scope.getWeather = function(val) {
    var weather = { temp: {}, clouds: null };
    var city = $scope.asyncSelected;
    //$scope.test = "true";
    $scope.btnText = "getting";

    $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=63fbbe238d2e01a8afb88b52eaeeb5aa'
    ).then(function(response) {
      if (response.data) {
        if (response.data.main) {
          weather.temp.current = response.data.main.temp;
          weather.temp.min = response.data.main.temp_min;
          weather.temp.max = response.data.main.temp_max;
          weather.humidity = response.data.main.humidity;
          weather.pressure = response.data.main.pressure;
        }
        if (response.data.weather) {
          weather.condition_code = response.data.weather[0].id;
          weather.condition_desc = response.data.weather[0].description;
        }
        if (response.data.coord) {
          weather.lat = response.data.coord.lat;
          weather.lon = response.data.coord.lon;
        }
        if (response.data.sys) {
          weather.country = response.data.sys.country;
          //weather.sunrise = response.data.sunrise;
          //weather.sunset = response.data.sunset;
        }
        if (response.data.clouds) {
          weather.clouds = response.data.clouds ? response.data.clouds.all : undefined;
        }
        if (response.data.dt) {
          weather.dt = response.data.dt;
        }
      }

      $scope.getTime(weather.lat, weather.lon).then (function(t) {
        weather.current_time = t.current.split(" ")[1];
        weather.sunrise = t.sunrise.split(" ")[1];
        weather.sunset = t.sunset.split(" ")[1];
        
        $scope.btnText = "get weather";
        $scope.weather = weather;
      });
      //return weather;
    });
  };
  $scope.getTime = function(lat,lon) {
    var time = { current:null, sunrise:null, sunset:null };
    return $http.get('http://api.geonames.org/timezoneJSON?lat=' + lat + '&lng=' + lon + '&username=dmo2019'
    ).then(function(response) {
      if (response.data) {
        time.current = response.data.time;
        time.sunrise = response.data.sunrise;
        time.sunset = response.data.sunset;
      }
      return time;
    });
    
  };
});

myApp.directive('weatherIcon', function() {
    return {
        restrict: 'E', 
        replace: true,
        scope: {
            cloudiness: '@',
            time: '@',
            sunrise: '@',
            sunset: '@'
        },
        controller: function($scope) {
            $scope.imgurl = function() {
                var classes = [];
                var timeStr = $scope.time;
                var sunriseStr = $scope.sunrise;
                var sunsetStr = $scope.sunset;
                var daytime = false;
                if (timeStr > sunriseStr && timeStr < sunsetStr) {
                  daytime = true;
                }
                switch ($scope.cloudiness) {
                  case '200': // thunderstorm with light rain
                  case '201': // thunderstorm with rain
                  case '202': // thunderstorm with heavy rain
                  case '210': // light thunderstorm
                  case '211': // thunderstorm
                  case '212': // heavy thunderstorm
                  case '221': // ragged thunderstorm
                  case '230': // thunderstorm with light drizzle
                  case '231': // thunderstorm with drizzle
                  case '232': // thunderstorm with heavy drizzle
                    classes[0] = 'basecloud';
                    if (daytime)
                      classes[1] = 'icon-thunder icon-sunny';
                    else
                      classes[1] = 'icon-thunder icon-night';
                    break;
                  case '300': // light intensity drizzle
                  case '301': // drizzle
                  case '302': // heavy intensity drizzle
                  case '310': // light intensity drizzle rain
                  case '311': // drizzle rain 
                  case '312': // heavy intensity drizzle
                  case '313': // shower rain and drizzle
                  case '314': // heavy shower rain and drizzle
                  case '321': // shower drizzle
                    classes[0] = 'basecloud';
                    if (daytime)
                      classes[1] = 'icon-drizzle icon-sunny';
                    else
                      classes[1] = 'icon-drizzle icon-night';
                    break;
                  case '500': // light rain
                  case '501': // moderate rain
                  case '502': // heavy intensity rain
                  case '503': // very heavy rain
                  case '504': // extreme rain
                  case '511': // freezing rain
                  case '520': // light intensity shower rain
                  case '521': // shower rain
                  case '522': // heavy intensity shower rain
                  case '531': // ragged shower rain
                    classes[0] = 'basecloud';
                    if (daytime)
                      classes[1] = 'icon-rainy icon-sunny';
                    else
                      classes[1] = 'icon-rainy icon-night';
                    break;
                  case '600': // light snow
                  case '601': // snow
                  case '602': // heavy snow
                  case '611': // sleet
                  case '612': // shower sleet
                  case '615': // light rain and snow
                  case '616': // rain and snow
                  case '620': // light shower snow
                  case '621': // shower snow
                  case '622': // heavy shower snow
                    classes[0] = 'basecloud';
                    if (daytime)
                      classes[1] = 'icon-snowy icon-sunny';
                    else
                      classes[1] = 'icon-snowy icon-night';
                    break;
                  case '701': // mist
                    classes[0] = '';
                    classes[1] = 'icon-mist';
                    break;
                  case '711': // smoke
                    break;
                  case '721': // haze
                    break;
                  case '731': // sand, dust whirls
                    break;
                  case '741': // fog
                    break;
                  case '751': // sand
                    break;
                  case '761': // dust
                    break;
                  case '762': // volcanic ash
                    break;
                  case '771': // squalls
                    break;
                  case '781': // tornado
                    break;
                  case '800': // clear 
                    classes[0] = '';
                    if (daytime)
                      classes[1] = 'icon-sun';
                    else
                      classes[1] = 'icon-moon';
                    break;
                  case '801': // few clouds
                  case '802': // scattered clouds
                  case '803': // broken clouds
                  case '804': // overcast clouds
                    classes[0] = 'basecloudwhole';
                    if (daytime)
                      classes[1] = 'icon-sunny';
                    else
                      classes[1] = 'icon-night';
                    break;

                }
                return classes;
            };
        },
        //template: '<div style="float:left"><img ng-src="{{ imgurl() }}"></div>'
        //template: '<div>{{ imgurl() }}</div>'
        template: '<div><div class="{{ imgurl()[0] }}"></div><div class="{{ imgurl()[1] }}"></div></div>'
    };
});

myApp.filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0F';
    };
});

myApp.filter('time', function($filter) {
    return function(input) {
        var date = new Date(input * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
        return formattedTime;
    };
});

