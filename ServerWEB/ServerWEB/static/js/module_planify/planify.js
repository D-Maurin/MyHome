current_edited_room = 0;
current_temp_table = [];

//Loading Rooms Planify Infos
function LoadPlanifyRoomsInfos(){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function(){
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var Rec = JSON.parse(xhr.responseText);
			createPlanifyRoomsInputs(Rec);
		}
	});
	var URL = "/get_planify_rooms";
	xhr.open('GET',URL);
	xhr.send();
}

function createPlanifyRoomsInputs(rec)
{
	document.getElementById("PP_RoomSelectors").innerHTML = "";
	for(var i=0; i<rec.length; i++ )
	{
		var input_room = TEMPLATE_ROOM_INPUT
			.replace(/{{{name}}}/g, rec[i][1])
			.replace(/{{{id}}}/g, rec[i][0])
			.replace(/{{{p_enable}}}/g, rec[i][2])
			.replace(/{{{selected}}}/g, (i==0)?" room_selected":"");
		document.getElementById("PP_RoomSelectors").insertAdjacentHTML('beforeend',input_room);

		if(i==0) {
			SelectPlanifyRoom(document.querySelector("#PP_RoomSelectors > input"));
		}
	}
}

//Loading Room Plan

function LoadPlanifyRoom(gid){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function(){
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var Temp = JSON.parse(xhr.responseText);
			createTableTemp(Temp);
			document.getElementById("Page_Planify").setAttribute("loading", "true");
		}
	});
	var URL = "/get_planify_room_plan/" + gid.toString();
	xhr.open('GET',URL);
	xhr.send();
}


function createTableTemp(Temp){
	current_temp_table = Temp.copyWithin();
	var targetCells = document.querySelectorAll("tr:nth-child(n+1) > td:nth-child(n+1) > input");
	targetCells.forEach(function(element){
		element.value = 20;
	});
	
	for(var i=0; i<Temp.length; i++)
	{
		var Tr = (Temp[i][0] + 1).toString();
		var Td = (Temp[i][1] - 3).toString();
		var TempValue = Temp[i][2];
		
		var targetCells = document.querySelectorAll("#PP_CentralTable tr:nth-child(" + Tr + ") > td:nth-child(n+" + Td + ") > input");
		targetCells.forEach(function(element){
			element.value = TempValue;
		});
	}
}

//Get Planify Changes

function GetTableTemp(){
	var newTable = [];
	for (var i = 0; i < 7; i++) {
		var LastTemp = 20 ;
		for (var j = 0; j < 19; j++) {
			var Tr = i+2 //Sélectionner la case de notre ligne ( i commence à 0 ).
			var Td = j+2
			var targetCell = document.querySelector("#PP_CentralTable tr:nth-child(" + Tr + ") > td:nth-child(" + Td + ") > input");
			if(targetCell.validity.valid == false){return null}
			if (LastTemp != parseFloat(targetCell.value) ){
				newTable.push([Tr-1, Td+3 , parseFloat(targetCell.value)]);
				LastTemp = parseFloat(targetCell.value);
			} 
		}
	}
	var toAdd = differenceBetween(newTable, current_temp_table);
	var toPop = differenceBetween(current_temp_table, newTable);

	return {toAdd:toAdd, toPop:toPop};
}


function differenceBetween(arrayA, arrayB)
{
	return arrayA.filter(
		x => !arrayB.map(
			y => y[1].toString() + ","+  y[2].toString() + "," + y[0].toString
		).includes(x[1].toString() + ","+  x[2].toString() + "," + x[0].toString));
}



//Select functions

function SelectPlanifyRoom(el)
{
	document.getElementById("Page_Planify").setAttribute("loading", "false");
	var gid = parseInt(el.getAttribute("gid"));
	var p_enable = (parseInt(el.getAttribute("progenable")) != 0);
	RoomInputStyleChange(gid);
	document.getElementById("PP_OnOffCheck").checked = p_enable;
	document.getElementById("PP_InputSave").gid_callback = gid;
	document.getElementById("PP_OnOffCheck").gid_callback = gid;
	current_edited_room = gid;
	LoadPlanifyRoom(gid);
}

function RoomInputStyleChange(id)
{
	document.querySelectorAll(".PP_Input").forEach(function(element){
		element.classList.remove("room_selected");
	});
	document.getElementById("PP_RoomInput_" + id.toString()).classList.add("room_selected");
}

//Change Functions

function SavePlanifyChanges(input)
{
	var gid = input.gid_callback.toString();
	var changes = GetTableTemp();
	if(changes === false){
		console.log("Invalid data in");
		return false;
	}

	var xhr = new XMLHttpRequest();   
	xhr.open("POST", "/planify_update_change/" + gid);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(changes));

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			console.log("Planification updated for room (" + gid + ")")
		}
	});
}

function SavePlanifyState(input)
{
	var gid = input.gid_callback.toString();
	var nstate = (input.checked?"1":"0");
	document.getElementById("PP_RoomInput_" + gid).setAttribute("progenable", nstate);

	var xhr = new XMLHttpRequest();   
	xhr.open("GET", "/planify_set_state/" + gid + "/" + nstate);
	xhr.send(null);

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			console.log("Planification " + (nstate=="0"?"disabled":"enabled") + " for room (" + gid + ")")
		}
	});
}