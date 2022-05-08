const cityInput = document.querySelector('.city');
const checkWeatherBtn = document.querySelector('.check-weather');

const weatherSection = document.querySelector('.weather-info-section');
const backBtn = document.querySelector('.back');
const city = document.querySelector('.your-city');
const country = document.querySelector('.your-country');

const date = document.querySelector('.date');
const temperature = document.querySelector('.temperature .current');

const nextDays = document.querySelectorAll('.next-days .day');

const pressure = document.querySelector('.pressure .current');
const perceptible = document.querySelector('.perceptible .current');
const humidity = document.querySelector('.humidity .current');
const wind = document.querySelector('.wind .current');
const clouds = document.querySelector('.clouds .current');
const visibility = document.querySelector('.visibility .current');

const today = new Date();
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wednes', 'Thurs', 'Fri', 'Sat'];

const todayDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${
	monthNames[today.getMonth()]
}`;

date.textContent = todayDate;

const API_KEY = 'e8ee48ec429851f4d1460f31c8695c03';

const downloadWeather = () => {
	const yourCity = cityInput.value;
	city.textContent = yourCity;

	const nextDaysWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${yourCity}&lang=en&units=metric&appid=${API_KEY}`;
	const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${yourCity}&lang=en&units=metric&appid=${API_KEY}`;

	fetch(currentWeather)
		.then(res => res.json())
		.then(data => {
			const currentTemperature = data.main.temp;
			const currentPressure = data.main.pressure;
			const currentPerceptible = data.main.feels_like;
			const currentHumidity = data.main.humidity;
			const currentWind = data.wind.speed;
			const currentClouds = data.clouds.all;
			const currentVisibility = data.visibility;
			const regionNames = new Intl.DisplayNames(['en'], {
				type: 'region',
			});
			const fullCountryName = regionNames.of(data.sys.country);
			country.textContent = fullCountryName;

			temperature.textContent = Math.round(currentTemperature);
			pressure.textContent = currentPressure;
			perceptible.textContent = currentPerceptible;
			humidity.textContent = currentHumidity;
			wind.textContent = currentWind;
			clouds.textContent = currentClouds;
			visibility.textContent = currentVisibility;
		});

	fetch(nextDaysWeather)
		.then(res => res.json())
		.then(data => {
			let j = 3;
			for (let i = 1; i <= 4; i++) {
				const nextDay = data.list[j];
				const nextDayDate = new Date(nextDay.dt_txt);
				const nextDayTemperature = nextDay.main.temp;
				const nextDayContainer = nextDays[i - 1];
				const weatherId = nextDay.weather[0].id;

				if (weatherId > 200 && weatherId < 300) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-cloud-bolt');
				} else if (weatherId >= 300 && weatherId < 500) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-cloud-drizzle');
				} else if (weatherId >= 500 && weatherId < 600) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-cloud-showers-heavy');
				} else if (weatherId >= 600 && weatherId < 700) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-snowflake');
				} else if (weatherId >= 700 && weatherId < 800) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-cloud-fog');
				} else if (weatherId >= 800) {
					nextDayContainer
						.querySelector('.weather-icon')
						.classList.add('fa-sun');
				}

				const month =
					nextDayDate.getMonth() + 1 < 10
						? `0${nextDayDate.getMonth() + 1}`
						: nextDayDate.getMonth() + 1;
				nextDayContainer.querySelector(
					'.weather-date',
				).textContent = `${nextDayDate.getDate()}.${month}`;

				nextDayContainer.querySelector(
					'.day-temperature',
				).textContent = `${nextDayTemperature.toFixed(0)}°C`;
				j += 3;
			}
		});
	setTimeout(() => {
		weatherSection.style.display = 'block';
	}, 100);
};

checkWeatherBtn.addEventListener('click', downloadWeather);
backBtn.addEventListener('click', () => {
	weatherSection.style.display = 'none';
});

addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		downloadWeather();
	}
});

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(getUserLocation);
}

function getUserLocation(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;

	fetch(
		`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
	)
		.then(result => {
			result.json().then(data => {
				if (data.city === '') {
					cityInput.value = data.locality;
				} else {
					cityInput.value = data.city;
				}
			});
		})
		.catch(err => {
			console.log(err);
		});
}
