function getWeatherData() {
    var cityName = document.getElementById('city-input').value;
    var apiKey = '6ad917cff07da33c01d8bf9fd231fa55';

    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    var storedWeatherData = localStorage.getItem(cityName);
    if (storedWeatherData) {

        displayWeatherData(JSON.parse(storedWeatherData));
    } else {

        var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network Error');
                }

                return response.json();
            })
            .then((data) => {

                displayWeatherData(data);
                localStorage.setItem(cityName, JSON.stringify(data));
            })

            .catch((error) => {
                console.error('Error with operation:', error);
            });
    }
}

function saveWeatherData(city, data) {
    var savedWeatherData = JSON.parse(localStorage.getItem('weatherData')) || {};
    savedWeatherData[city] = data;
    localStorage.setItem('weatherData', JSON.stringify(savedWeatherData));
}

function displayWeatherData(data) {
    var weatherDataElement = document.getElementById('weather-data');
    weatherDataElement.innerHTML = '';

    var cityName = data.name;
    var cityNameElement = document.createElement('p');
    cityNameElement.textContent = `City: ${cityName}`;

    var iconCode = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    var iconElement = document.createElement('img');
    iconElement.setAttribute('src', iconUrl);
    iconElement.alt = 'Weather Icon';

    var temperatureInCelsius = data.main.temp - 273.15;
    var temperatureElementCelsius = document.createElement('p');
    temperatureElementCelsius.textContent = `Temperature (Celsius): ${temperatureInCelsius.toFixed(2)} °C`;

    var temperatureInFahrenheit = (temperatureInCelsius * 9 / 5) + 32;
    var temperatureElementFahrenheit = document.createElement('p');
    temperatureElementFahrenheit.textContent = `Temperature (Fahrenheit): ${temperatureInFahrenheit.toFixed(2)} °F`;

    var windSpeed = data.wind.speed;
    var windElement = document.createElement('p');
    windElement.textContent = `Wind Speed: ${windSpeed} m/s`;

    var humidity = data.main.humidity;
    var humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${humidity}%`;

    weatherDataElement.appendChild(cityNameElement);
    weatherDataElement.appendChild(iconElement);
    weatherDataElement.appendChild(temperatureElementFahrenheit);
    weatherDataElement.appendChild(windElement);
    weatherDataElement.appendChild(humidityElement);
}



function displayRecent(){

    var recentSearches = JSON.parse(localStorage.getItem('weatherData')) || [];

    var recentSearchesEl = document.getElementById('recent-searches');
    recentSearchesEl.innerHTML = '';

        var header = document.createElement('h3');
        header.textContent = 'Recent searches: ';
        recentSearchesEl.appendChild(header);

        var ul = document.createElement('ul');

        for (var city in recentSearches){

            if (recentSearches.hasOwnProperty(city)){
                var li = document.createElement('li');
                li.textContent = city;
                ul.appendChild(li);
            }

        }    


        recentSearchesEl.appendChild(ul);
    
}

displayRecent();