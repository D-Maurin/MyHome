function LoadRoomsWindows(gid, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_available_windows/' + gid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			
			RoomEdit(gid).windows.innerHTML = "<div class='Edit_header'>Fenêtres</div>";

			for (var i = 0; i < response.length; i++) {
				var n_window = TEMPLATE_WINDOW_SELECT
					.replace(/{{{GID}}}/g, gid)
					.replace(/{{{WID}}}/g, response[i][0])
					.replace(/{{{init_state}}}/g, response[i][1])
					.replace(/{{{selected}}}/g, (response[i][1])?"checked":"");
				RoomEdit(gid).windows.insertAdjacentHTML("beforeend", n_window);
			}

			if(callback){callback()}
		}	
	});
}

function SaveRoomsWindows(gid)
{
	var inputs_windows = document.querySelectorAll("[id^='G" + gid + "W']");

	for (var i = 0; i < inputs_windows.length; i++) {
		var input_w = inputs_windows[i];

		if(input_w.checked != input_w.getAttribute("init_state"))
		{
			if(input_w.checked == true)
			{
				console.log("Add Window (" + input_w.getAttribute("WID") + ") to Room (" + gid + ")");
				action_add_window(gid, input_w.getAttribute("WID"));
			}
			else
			{
				console.log("Pop Window (" + input_w.getAttribute("WID") + ") from Room (" + gid + ")");
				action_pop_window(gid, input_w.getAttribute("WID"));
			}
		}
	}
}

function action_add_window(gid, wid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/action_add_window/' + gid + "/" + wid);
	xhr.send(null);
}

function action_pop_window(gid, wid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/action_pop_window/' + gid + "/" + wid);
	xhr.send(null);
}