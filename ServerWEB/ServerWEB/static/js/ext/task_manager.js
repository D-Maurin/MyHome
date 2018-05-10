/*#########################################################
task_manager.js - gere les taches repetitives et evenements
#########################################################*/

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


//Fonction qui lance la maj continue des pièces 
function StartIntervals()
{
	_GetRooms();
	INTERVALS['GetRooms'] = window.setInterval(_GetRooms, 2000);
}

//Fonction qui charge les données de capteurs
function LoadSensorsAndRegulatorsAndWindowsInfos()
{
	if(window.location.hash == "#Infos")
	{
		_GetSensors();
		_GetRegulators();
		_GetWindows();
	}
}

//On ajoute des taches a executer au chargement complet du DOM
ONLOADTASK.push(() => {
	//On instancie le gestionnaire de message pour l'ecran d'accueil
	Home_Message = new DispManager(
		document.getElementById("PH_head_txt_title"), 
		document.getElementById("PH_head_txt_sub")
	)
	Home_Message.add("Gardez un oeil sur la température de votre maison", "où que vous soyez !", false, true)
;})
ONLOADTASK.push(StartIntervals);
ONLOADTASK.push(LoadPlanifyRoomsInfos);
ONLOADTASK.push(LoadSensorsAndRegulatorsAndWindowsInfos);
ONLOADTASK.push(loadWeather);
//On ajoute des taches a executer au changement de page (de hash)
ONHASHCHANGETASK.push(LoadSensorsAndRegulatorsAndWindowsInfos);


//Gere l'affichage de messages
class DispManager
{
	constructor(title_ct, sub_ct){
		this._title = title_ct;
		this._sub = sub_ct;
		this._last = [[title_ct.innerHTML, sub_ct.innerHTML, true]];
		//on creer une file d'attente
		this._Queue = [[title_ct.innerHTML, sub_ct.innerHTML, true]];
		//on change le message dans 8s
		setTimeout(this._anticipate.bind(this), 6500);
		setTimeout(this._manage.bind(this), 8000);
	}

	add(title, sub, loop, first){
		//Pour ajouter un message 
		//prioritaire
		if(first){
			this._Queue = [[title, sub, loop]].concat(this._Queue);
		}
		//ou pas
		else{
			this._Queue.push([title, sub, loop]);
		}
		
	}

	_manage(){
		//change et rend visible le message
		var new_disp = this._Queue[0];

		this._title.classList.replace("DispManagerAnticipate", "DispManager");
		this._sub.classList.replace("DispManagerAnticipate", "DispManager");

		this._Queue = this._Queue.slice(1);
		if(new_disp[2]){
			this._Queue.push(new_disp);
		}
		this._title.innerHTML = new_disp[0];
		this._sub.innerHTML = new_disp[1];

		//on change le message dans 8s
		setTimeout(this._anticipate.bind(this), 6500);
		setTimeout(this._manage.bind(this), 8000);
	}

	_anticipate(){
		//opacifie avant changement
		this._title.classList.replace("DispManager", "DispManagerAnticipate");
		this._sub.classList.replace("DispManager", "DispManagerAnticipate");
	}
}

//Reecriture d'une propriété pour des problèmes de compatibilité inter-navigateurs
DOMTokenList.prototype.replace = function(toremove, toadd){
	this.remove(toremove);
	this.add(toadd);
}


