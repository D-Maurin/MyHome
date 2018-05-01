function setTempTarget(action, gid)
{
	
	if(TIMEOUTS[gid.toString()] !== undefined){
		clearTimeout(TIMEOUTS[gid.toString()]);
	}
	TIMEOUTS[gid.toString()] = setTimeout( () => callbackSetTempTarget(gid) , 1000);
	
	var print_target = Room(gid).regulators.val;
	
	print_target.setAttribute("locked", "true");
	
	var new_value = (action == "+")? 
		parseFloat(print_target.innerHTML) + 0.1:
		parseFloat(print_target.innerHTML) - 0.1;

	ChangeTemperature(print_target, parseFloat(new_value.toFixed(1)));
}

function callbackSetTempTarget(gid)
{
	var xhr = new XMLHttpRequest();
	var val = Room(gid).regulators.val.innerHTML;
	var url = '/set_target_temp/' + gid.toString() + '/' + val;
	
	xhr.open('GET', url);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = xhr.responseText;
			var print_target = Room(gid).regulators.val;
			print_target.setAttribute("locked", "false");
			
		}
	});
}