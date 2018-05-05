WID_LIST = [];

function _GetWindows(callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_windows');
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			WID_LIST = [];
			WindowsRoot().innerHTML = "";

			for(var i=0; i<response.length; i++)
			{
				item = response[i];
				WID_LIST.push(item[0]);

				var new_window = TEMPLATE_WINDOW_INFO
					.replace(/{{{WID}}}/g, item[0])
					.replace(/{{{window_used}}}/g, item[1])
					.replace(/{{{window_uptd}}}/g, item[2])
					.replace(/{{{deletable}}}/g, item[1])
					.replace(/{{{window_room}}}/g, item[3]?item[3]:"");

				WindowsRoot().insertAdjacentHTML("beforeend", new_window);
			}

			if(callback){callback()}
		}
	});
}


function StartOrStopDeletionWindow()
{
	if(document.querySelector("#PI_windows").getAttribute("edit_mode") == "false")
	{
		document.querySelector("#PI_windows").setAttribute("edit_mode", "true");
	}
	else
	{
		document.querySelector("#PI_windows").setAttribute("edit_mode", "false");
	}
}

function StopDeletionWindow()
{
	document.querySelector("#PI_windows").setAttribute("edit_mode", "false");
}

function DeleteModuleWindow(wid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/del_module_window/' + wid);
	xhr.send(null);

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			_GetWindows();
		}
	});
	StopDeletionWindow();
}