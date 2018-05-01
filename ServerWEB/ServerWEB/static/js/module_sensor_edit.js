function LoadRoomsSensors(gid, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_available_sensors/' + gid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			
			RoomEdit(gid).sensors.innerHTML = "<div class='Edit_header'>Capteurs</div>";

			for (var i = 0; i < response.length; i++) {
				var n_sensor = TEMPLATE_SENSOR_SELECT
					.replace(/{{{GID}}}/g, gid)
					.replace(/{{{SID}}}/g, response[i][0])
					.replace(/{{{init_state}}}/g, response[i][1])
					.replace(/{{{selected}}}/g, (response[i][1])?"checked":"");
				RoomEdit(gid).sensors.insertAdjacentHTML("beforeend", n_sensor);
			}

			if(callback){callback()}
		}	
	});
}

function SaveRoomsSensor(gid)
{
	var inputs_sensors = document.querySelectorAll("[id^='G" + gid + "S']");

	for (var i = 0; i < inputs_sensors.length; i++) {
		var input_s = inputs_sensors[i];
		if(input_s.checked != input_s.getAttribute("init_state") && input_s.checked == true)
		{
			console.log("Change Sensor of Room (" + gid + ") : New is (" + input_s.getAttribute("SID") + ")");
			action_change_sensor(gid, input_s.getAttribute("SID"));
		}
	}
}

function action_change_sensor(gid, sid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/action_change_sensor/' + gid + "/" + sid);
	xhr.send(null);
}