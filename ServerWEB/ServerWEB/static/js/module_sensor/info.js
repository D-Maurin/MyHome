SID_LIST = [];

function _GetSensors(callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_sensors');
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			SID_LIST = [];
			SensorsRoot().innerHTML = "";

			for(var i=0; i<response.length; i++)
			{
				item = response[i];
				SID_LIST.push(item[0]);

				var new_sensor = TEMPLATE_SENSOR_INFO
					.replace(/{{{SID}}}/g, item[0])
					.replace(/{{{sensor_used}}}/g, item[1])
					.replace(/{{{sensor_uptd}}}/g, item[2])
					.replace(/{{{deletable}}}/g, item[1])
					.replace(/{{{sensor_room}}}/g, item[3]?item[3]:"");

				SensorsRoot().insertAdjacentHTML("beforeend", new_sensor);
			}

			if(callback){callback()}
		}
	});
}

function StartOrStopDeletionSensor()
{
	if(document.querySelector("#PI_sensors").getAttribute("edit_mode") == "false")
	{
		document.querySelector("#PI_sensors").setAttribute("edit_mode", "true");
	}
	else
	{
		document.querySelector("#PI_sensors").setAttribute("edit_mode", "false");
	}
}


function StopDeletionSensor()
{
	document.querySelector("#PI_sensors").setAttribute("edit_mode", "false");
}

function DeleteModuleSensor(sid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/del_module_sensor/' + sid);
	xhr.send(null);

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			_GetSensors();
		}
	});
	StopDeletionSensor();
}