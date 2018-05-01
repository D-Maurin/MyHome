function _GetHistory(gid, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_history/' + gid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			var history_target = Room(gid).sensor_history;
			history_target.view.innerHTML = "";
			
			var min_value = 100, max_value = -100;
			var breaked = true, firstdone = false;
			var temp_path = "";
			var temp_points = "";
			var last_time = 0;
			
			for(var i=0; i<response.length; i++)
			{
				var temp_row = response[i];
				
				if(temp_row[0] < min_value){
					min_value = temp_row[0];
				}
				if(temp_row[0] > max_value){
					max_value = temp_row[0];
				}
				
				if(i==response.length-1){var temp_next_row = temp_row;}
				else{var temp_next_row = response[i+1];}
				
				if(breaked)
				{
					if(firstdone)
					{
						var temp_last_row = response[i-1];
						var temp_link_path = "M " + temp_last_row[3] + " " + temp_last_row[2] + " L " + temp_row[3] + " " + temp_row[2];
						history_target.view.innerHTML += TEMPLATE_HISTORY_NODATA_PART
							.replace(/{{{path_data}}}/g, temp_link_path);
					}
					breaked = false;
					temp_path = "M " + temp_row[3] + " " + temp_row[2];
					temp_points = temp_row[3] + " 100";
					
					temp_points += ", " + temp_row[3] + " " + temp_row[2];
					last_time = temp_row[3];
				}
				else
				{
					var temp_last_row = response[i-1];
					if(i==response.length-1 || temp_next_row[3] - temp_row[3] > 30 || temp_last_row[0] !== temp_row[0])
					{
						temp_path += " L " + temp_row[3] + " " + temp_row[2];
						temp_points += ", " + temp_row[3] + " " + temp_row[2];
					}
				}
				
				
				if(i==response.length-1 || temp_next_row[3] - temp_row[3] > 30)
				{
					var temp_end_point = temp_row[3];
					if(temp_row[3] === last_time)
					{
						temp_end_point = temp_row[3] + 1;
						temp_path += " L " + temp_end_point + " " + temp_row[2];
						temp_points += ", " + temp_end_point + " " + temp_row[2];
					}
					
					temp_points += "," + temp_end_point + " 100";
					breaked = true;
					
					history_target.view.innerHTML += TEMPLATE_HISTORY_DATA_PART
						.replace(/{{{history_area}}}/g, temp_points)
						.replace(/{{{history_points}}}/g, temp_path);
				}
				firstdone = true;
			}
			
			if(response.length > 0)
			{
				history_target.min.innerHTML = (min_value).toFixed(1).toString();
				history_target.max.innerHTML = (max_value).toFixed(1).toString();
			}
			else
			{
				history_target.min.innerHTML = "~";
				history_target.max.innerHTML = "~";
			}
			
			if(callback){callback()}
		}
	});
}


