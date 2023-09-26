function getWeatherData() {
    var cityName = document.getElementById('city-input').value;
    var apiKey = '6ad917cff07da33c01d8bf9fd231fa55';

    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    var currentWeatherData;
    var forecastData;

    var currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
    var forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;

    Promise.all([fetch(currentApiUrl), fetch(forecastApiUrl)])
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then(([currentResponse, forecastResponse]) => {
            if (!currentResponse || !forecastResponse) {
                throw new Error('API data missing');
            }

            if (currentResponse.cod !== 200 || forecastResponse.cod !== '200') {
                throw new Error('City not found or data is incomplete');
            }

            currentWeatherData = currentResponse;
            forecastData = forecastResponse;

            displayWeatherData(currentWeatherData);
            displayForecastData(forecastData);

            var searchData = {
                current: currentWeatherData,
                forecast: forecastData,
            };
            localStorage.setItem(cityName, JSON.stringify(searchData));
        })
        .catch((error) => {
            alert(error.message);
            console.error('Error with operation:', error);
        });
}

function displayForecastData(forecastData) {
    var forecastContainer = document.getElementById('forecast-container');

    if (forecastContainer) {
        forecastContainer.innerHTML = '';

        var titleElement = document.createElement('h2');
        titleElement.textContent = '5-Day Forecast:';
        forecastContainer.appendChild(titleElement);
        titleElement.classList.add('forecast-title');

        for (let i = 0; i < forecastData.list.length; i += 8) {
            var forecastDay = forecastData.list[i];
            var date = new Date(forecastDay.dt * 1000);
            var forecastDiv = document.createElement('div');
            forecastDiv.classList.add('forecast-item');
            
            var dateElement = document.createElement('p');
            dateElement.textContent = date.toLocaleDateString();

            var iconCode = forecastDay.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            var iconElement = document.createElement('img');
            iconElement.setAttribute('src', iconUrl);
            iconElement.alt = 'Weather Icon';

            var temperatureInCelsius = forecastDay.main.temp - 273.15;
            var temperatureInFahrenheit = (temperatureInCelsius * 9 / 5) + 32;

            var temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${temperatureInFahrenheit.toFixed(2)} °F`;

            var windSpeed = forecastDay.wind.speed;
            var windElement = document.createElement('p');
            windElement.textContent = `Wind Speed: ${windSpeed} m/s`;

            var humidity = forecastDay.main.humidity;
            var humidityElement = document.createElement('p');
            humidityElement.textContent = `Humidity: ${humidity}%`;

            forecastDiv.appendChild(dateElement);
            forecastDiv.appendChild(iconElement);
            forecastDiv.appendChild(temperatureElement);
            forecastDiv.appendChild(windElement);
            forecastDiv.appendChild(humidityElement);
            forecastContainer.appendChild(forecastDiv);
        }
    } else {
        console.error('Forecast container not found in the DOM.');
    }
}

document.getElementById('search-button').addEventListener('click', getWeatherData);

function saveWeatherData(city, data) {
    var savedWeatherData = JSON.parse(localStorage.getItem('weatherData')) || {};
    savedWeatherData[city] = data;
    localStorage.setItem('weatherData', JSON.stringify(savedWeatherData));
}

function displayWeatherData(data) {
    var weatherDataElement = document.getElementById('weather-data');
    weatherDataElement.innerHTML = '';

    if (data && data.name) {
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
    } else {
        console.error('Unexpected weather data structure:', data);
        weatherDataElement.textContent = 'Weather data not available';
    }
}