function StartCreation(first)
{

	for (var i = 0; i < GID_LIST.length; i++) {
		CancelEdition(GID_LIST[i]);
	}
	StopDeletion();

	if(RoomEdit().newroot.getAttribute("running") == "false")
	{
		RoomEdit().newroot.setAttribute("running", "true");
		RoomEdit().newroot.innerHTML = TEMPLATE_ROOM_CREATE;
		if(first){
			Home_Message.add("Configurez votre première piéce", "en choisissant vos modules ci dessous", false, true);
			HelpInvite("Besoin d'aide ?", "Créons la première pièce ensemble", CHAIN_HELP_CREATE);
			var annulate_bt = document.querySelector("#PH_room_0 .Edit_room_annulate");
			annulate_bt.parentNode.removeChild(annulate_bt);
		}

		callback_creation = () => {
			document.querySelector("#PH_room_0").scrollIntoView({behavior: "smooth"});
			var first_el = document.querySelector("[name='G0']");
			if(first_el){first_el.checked=true}
		}
		LoadRoomsRegulators(0, callback_creation);
		LoadRoomsSensors(0, callback_creation);
		LoadRoomsWindows(0, callback_creation);

	}
}

function CancelCreation()
{
	RoomEdit().newroot.setAttribute("running", "false");
	RoomEdit().newroot.innerHTML = "";
}

function RoomCreation()
{
	CloseHelpInvite();
	var new_room_name = RoomEdit(0).name.value;
	var new_room_sid = document.querySelector("[name='G0']:checked").getAttribute("sid");

	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/add_room/' + new_room_name + '/' + new_room_sid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var GID = JSON.parse(xhr.responseText);
			console.log("Room (" + GID + ") created");

			var inputs_regulators = document.querySelectorAll("[id^='G0R']");
			for (var i = 0; i < inputs_regulators.length; i++) {
				var input_r = inputs_regulators[i];

				if(input_r.checked)
				{
					console.log("Affecting Regulator (" + input_r.getAttribute("RID") + ")");
					action_add_regulator(GID, input_r.getAttribute("RID"));
				}
			}

			var inputs_windows = document.querySelectorAll("[id^='G0W']");
			for (var i = 0; i < inputs_windows.length; i++) {
				var input_w = inputs_windows[i];

				if(input_w.checked)
				{
					console.log("Affecting Window (" + input_w.getAttribute("WID") + ")");
					action_add_window(GID, input_w.getAttribute("WID"));
				}
			}

			CancelCreation();
			_GetRooms();
		}	
	});

}

