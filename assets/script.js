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

        createRecentSearchButton(cityName);
    } else {
        console.error('Unexpected weather data structure:', data);
        weatherDataElement.textContent = 'Weather data not available';
    }
}

function displayForecastData(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');

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

function createRecentSearchButton(cityName) {
    var recentSearches = document.getElementById('recent-searches');
    var button = document.createElement('button');
    button.textContent = cityName;

    button.addEventListener('click', function () {
        getWeatherDataFromHistory(cityName);
    });
    recentSearches.appendChild(button);
}

function getWeatherDataFromHistory(cityName) {
    var storedWeatherData = JSON.parse(localStorage.getItem(cityName));
    if (storedWeatherData) {
        displayWeatherData(storedWeatherData);

        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=8a7a3bfd140630c61554fb2f7ec043d9`;
        fetch(forecastApiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network Error');
                }
                return response.json();
            })
            .then((forecastData) => {
                displayForecastData(forecastData);
            })
            .catch((error) => {
                console.error('Error with operation:', error);
            });
    }
}

function getWeatherData() {
    var cityName = document.getElementById('city-input').value;
    var apiKey = '8a7a3bfd140630c61554fb2f7ec043d9';
    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(currentWeatherApiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network Error');
            }
            return response.json();
        })
        .then((data) => {
            displayWeatherData(data);

            localStorage.setItem(cityName, JSON.stringify(data));

            const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
            return fetch(forecastApiUrl);
        })
        .then((response) => response.json())
        .then((forecastData) => {
            displayForecastData(forecastData);
        })
        .catch((error) => {
            console.error('Error with operation:', error);
            alert('City not found or data is incomplete. Please enter a valid city name.');
        });
}

document.getElementById('search-button').addEventListener('click', getWeatherData);