/*##########################################################
weather.js - recupere les informations de météo et l'affiche
##########################################################*/

function loadWeather()
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/weather');
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			var weather_temp = response.main.temp.toFixed(0);
			var weather_icon = "/static/img/weather/" + response.weather[0].icon + ".svg";

			document.getElementById("PH_head_weather").src = weather_icon;
			document.getElementById("PH_head_temp_value").innerHTML = weather_temp;
		}
	});
}