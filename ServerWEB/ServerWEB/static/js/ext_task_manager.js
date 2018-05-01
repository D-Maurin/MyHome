INTERVALS = {};
TIMEOUTS = {};

/* EVENT TASK */

ONLOADTASK = [];
ONHASHCHANGETASK = [];

bodyonload = () => {
	for (var i = 0; i < ONLOADTASK.length; i++) {
		ONLOADTASK[i]();
	}
}

window.onhashchange = () => {
	for (var i = 0; i < ONHASHCHANGETASK.length; i++) {
		ONHASHCHANGETASK[i]();
	}
}

/* --- */

function StartIntervals()
{
	_GetRooms();
	INTERVALS['GetRooms'] = window.setInterval(_GetRooms, 2000);
}


function LoadSensorsAndRegulatorsInfos()
{
	if(window.location.hash == "#Infos")
	{
		_GetSensors();
		_GetRegulators();
	}
}


ONLOADTASK.push(() => {
	Home_Message = new DispManager(
		document.getElementById("PH_head_txt_title"), 
		document.getElementById("PH_head_txt_sub")
	)
	Home_Message.add("Gardez un oeil sur la température de votre maison", "où que vous soyez !", false, true)
;})
ONLOADTASK.push(StartIntervals);
ONLOADTASK.push(LoadSensorsAndRegulatorsInfos);
ONHASHCHANGETASK.push(LoadSensorsAndRegulatorsInfos);



class DispManager
{
	constructor(title_ct, sub_ct){
		this._title = title_ct;
		this._sub = sub_ct;
		this._last = [[title_ct.innerHTML, sub_ct.innerHTML, true]];
		this._Queue = [[title_ct.innerHTML, sub_ct.innerHTML, true]];
		setTimeout(this._anticipate.bind(this), 6500);
		setTimeout(this._manage.bind(this), 8000);
	}

	add(title, sub, loop, first){
		if(first){
			this._Queue = [[title, sub, loop]].concat(this._Queue);
		}
		else{
			this._Queue.push([title, sub, loop]);
		}
		
	}

	_manage(){
		var new_disp = this._Queue[0];

		this._title.classList.replace("DispManagerAnticipate", "DispManager");
		this._sub.classList.replace("DispManagerAnticipate", "DispManager");

		this._Queue = this._Queue.slice(1);
		if(new_disp[2]){
			this._Queue.push(new_disp);
		}
		this._title.innerHTML = new_disp[0];
		this._sub.innerHTML = new_disp[1];

		setTimeout(this._anticipate.bind(this), 6500);
		setTimeout(this._manage.bind(this), 8000);
	}

	_anticipate(){
		this._title.classList.replace("DispManager", "DispManagerAnticipate");
		this._sub.classList.replace("DispManager", "DispManagerAnticipate");
	}
}

DOMTokenList.prototype.replace = function(toremove, toadd){
	this.remove(toremove);
	this.add(toadd);
}


