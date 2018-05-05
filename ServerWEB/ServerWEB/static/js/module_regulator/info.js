RID_LIST = [];

function _GetRegulators(callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_regulators');
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			RID_LIST = [];
			RegulatorsRoot().innerHTML = "";

			for(var i=0; i<response.length; i++)
			{
				item = response[i];
				RID_LIST.push(item[0]);

				var new_regulator = TEMPLATE_REGULATOR_INFO
					.replace(/{{{RID}}}/g, item[0])
					.replace(/{{{regulator_used}}}/g, item[1])
					.replace(/{{{regulator_uptd}}}/g, item[2])
					.replace(/{{{deletable}}}/g, item[1])
					.replace(/{{{regulator_room}}}/g, item[3]?item[3]:"");

				RegulatorsRoot().insertAdjacentHTML("beforeend", new_regulator);
			}

			if(callback){callback()}
		}
	});
}


function StartOrStopDeletionRegulator()
{
	if(document.querySelector("#PI_regulators").getAttribute("edit_mode") == "false")
	{
		document.querySelector("#PI_regulators").setAttribute("edit_mode", "true");
	}
	else
	{
		document.querySelector("#PI_regulators").setAttribute("edit_mode", "false");
	}
}

function StopDeletionRegulator()
{
	document.querySelector("#PI_regulators").setAttribute("edit_mode", "false");
}

function DeleteModuleRegulator(rid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/del_module_regulator/' + rid);
	xhr.send(null);

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			_GetRegulators();
		}
	});
	StopDeletionRegulator();
}