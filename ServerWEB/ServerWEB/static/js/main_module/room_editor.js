function StartEdition(gid)
{
	RoomEdit(gid).root.setAttribute("edit_mode", "true");
	RoomEdit(gid).regulators.innerHTML = "";
	RoomEdit(gid).sensors.innerHTML = "";
	RoomEdit(gid).windows.innerHTML = "";
	LoadRoomsRegulators(gid);
	LoadRoomsSensors(gid);
	LoadRoomsWindows(gid);

	for (var i = 0; i < GID_LIST.length; i++) {
		if(GID_LIST[i] != gid){
			CancelEdition(GID_LIST[i]);
		};
	}
	CancelCreation();
	StopDeletion();
}

function CancelEdition(gid)
{
	RoomEdit(gid).root.setAttribute("edit_mode", "false");
}

function SaveEdition(gid)
{
	SaveRoomsSensor(gid);
	SaveRoomsRegulators(gid);
	SaveRoomsWindows(gid);
	SaveRoomsName(gid);

	_GetRooms();

	RoomEdit(gid).root.setAttribute("edit_mode", "false");
}

function SaveRoomsName(gid)
{
	if(RoomEdit(gid).name.getAttribute("init_name") != RoomEdit(gid).name.value)
	{
		console.log("Change Name of Room (" + gid + ") : New is (" + RoomEdit(gid).name.value + ")");

		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/action_change_name/' + gid + "/" + RoomEdit(gid).name.value);
		xhr.timeout = 4000;
		xhr.send(null);
	}
}


function StartOrStopDeletion()
{
	if(RoomsRoot().getAttribute("delete_mode") == "false"){
		RoomsRoot().setAttribute("delete_mode", "true");
		for (var i = 0; i < GID_LIST.length; i++) {
			CancelEdition(GID_LIST[i]);
		}
		CancelCreation();
	}
	else{
		RoomsRoot().setAttribute("delete_mode", "false");
	}	
}

function StopDeletion()
{
	RoomsRoot().setAttribute("delete_mode", "false");
}

function DeleteRoom(gid)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/del_room/' + gid);
	xhr.send(null);

	GID_BLACKLISTED = gid;
	var el = document.querySelector("[gid='" + gid + "']");
	el.parentNode.removeChild(el);

	_GetRooms();
	StopDeletion();
}