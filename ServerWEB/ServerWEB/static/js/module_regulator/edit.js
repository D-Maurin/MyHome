function LoadRoomsRegulators(gid, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_available_regulators/' + gid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			
			RoomEdit(gid).regulators.innerHTML = "<div class='Edit_header'>Radiateurs</div>";

			for (var i = 0; i < response.length; i++) {
				var n_regulator = TEMPLATE_REGULATOR_SELECT
					.replace(/{{{GID}}}/g, gid)
					.replace(/{{{RID}}}/g, response[i][0])
					.replace(/{{{init_state}}}/g, response[i][1])
					.replace(/{{{selected}}}/g, (response[i][1])?"checked":"");
				RoomEdit(gid).regulators.insertAdjacentHTML("beforeend", n_regulator);
			}

			if(callback){callback()}
		}	
	});
}

function SaveRoomsRegulators(gid)
{
	var inputs_regulators = document.querySelectorAll("[id^='G" + gid + "R']");

	for (var i = 0; i < inputs_regulators.length; i++) {
		var input_r = inputs_regulators[i];

		if(input_r.checked != input_r.getAttribute("init_state"))
		{
			if(input_r.checked == true)
			{
				console.log("Add Regulator (" + input_r.getAttribute("RID") + ") to Room (" + gid + ")");
				action_add_regulator(gid, input_r.getAttribute("RID"));
			}
			else
			{
				console.log("Pop Regulator (" + input_r.getAttribute("RID") + ") from Room (" + gid + ")");
				action_pop_regulator(gid, input_r.getAttribute("RID"));
			}
		}
	}
}

function action_add_regulator(gid, rid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/action_add_regulator/' + gid + "/" + rid);
	xhr.send(null);
}

function action_pop_regulator(gid, rid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/action_pop_regulator/' + gid + "/" + rid);
	xhr.send(null);
}