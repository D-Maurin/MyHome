GID_LIST = [];
GID_BLACKLISTED = -1;

function _GetRooms(callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_rooms?');
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			if(RoomsRoot().children.length != response.length){
				RoomsRoot().innerHTML = "";
			}
			
			GID_LIST = [];

			for(var i=0; i<response.length; i++)
			{
				var room_param = response[i];
				if(room_param[0] != GID_BLACKLISTED){
					GID_LIST.push(room_param[0]);
					
					if( !RoomExists(room_param[0]) )
					{
						CreateRoom.apply(this, room_param);
					}
					else
					{
						UpdateRoom.apply(this, room_param);
					}
				}
			}

			if(document.getElementById("PH_rooms").children.length === 0)
			{
				document.getElementById("PH_rooms").innerHTML = "";
				StartCreation(true);
			}

			else if(document.querySelector("#PH_room_0") != undefined
				&& document.querySelector("#PH_room_0 .Edit_room_annulate") == undefined) {
				CancelCreation();
			}

			if(callback){callback()}
		}
	});
}

function CreateRoom(GID, Name, Temp, TempTarget, S_UPTD, R_NUMBER, R_UPTD, W_NUMBER, W_UPTD, W_OPEN)
{
	var new_room = TEMPLATE_ROOM.replace(/{{{GID}}}/g, GID);
	RoomsRoot().insertAdjacentHTML("beforeend", new_room);
	
	UpdateRoom(GID, Name, Temp, TempTarget, S_UPTD, R_NUMBER, R_UPTD,  W_NUMBER, W_UPTD, W_OPEN);
}


function UpdateRoom(GID, Name, Temp, TempTarget, S_UPTD, R_NUMBER, R_UPTD, W_NUMBER, W_UPTD, W_OPEN)
{
	var room_to_update = Room(GID);
	
	room_to_update.name.innerHTML = Name;
	ChangeTemperature(room_to_update.sensor.val, Temp);

	if(room_to_update.regulators.val.getAttribute("locked") === "false")
	{
		ChangeTemperature(room_to_update.regulators.val, TempTarget);
	}

	if(RoomEdit(GID).root.getAttribute("edit_mode") == "false")
	{
		RoomEdit(GID).name.value = Name;
		RoomEdit(GID).name.setAttribute("init_name", Name);
	}

	room_to_update.windows.root.setAttribute("hasw", W_NUMBER);
	room_to_update.windows.root.setAttribute("open", W_OPEN);

	
	room_to_update.sensor.root.setAttribute("warn_uptd", !S_UPTD);
	room_to_update.regulators.root.setAttribute("warn_has_reg", !R_NUMBER);
	room_to_update.regulators.root.setAttribute("warn_uptd", !R_UPTD);
	room_to_update.windows.root.setAttribute("warn_uptd", !W_UPTD);
}




