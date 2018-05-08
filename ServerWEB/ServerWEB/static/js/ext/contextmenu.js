/*##########################################################
contextmenu.js - Gère le clic droit et les actions asscociés
##########################################################*/

//Association d'une fonction à l'évenement clic droit
document.oncontextmenu = function(ev){
	var cm_div = document.getElementById("context_menu");
	//On empèche le menu contextuel par défaut
	ev.preventDefault();

	// On calcule la position du menu
	var cm_posx = ev.clientX - 20;
	var cm_posy = ev.clientY - 80;

	//On place l'élément et on l'affiche
	void cm_div.offsetWidth;
	cm_div.style.display = "block";
	cm_div.style.left = cm_posx.toString() + "px";
	cm_div.style.top = cm_posy.toString() + "px";
}

//Fonction de désactivation du meu contextuel
function StopCM(){
	cm_div = document.getElementById("context_menu");
	cm_div.style.display = "none";
}

//On associe certains évenement à l'arrêt du menu (StopCM)
document.addEventListener("click", StopCM);
window.addEventListener("resize", StopCM);
window.addEventListener("scroll", StopCM);
document.addEventListener("blur", StopCM);

// --- Définition des actions disponibles

//Impression
async function cmActionPrint(){
	//on créer une chaine de promesse qui charge tout les éléments de la page pour l'impression
	//Les promesses se résolvent avec le callback des fonctions de chargement
	var promise_chain = new Array();
	//Chargement des capteurs
	promise_chain.push(new Promise(resolve => {
		_GetSensors(() => resolve(true));
	}));
	//Chargement des régulateurs
	promise_chain.push(new Promise(resolve => {
		_GetRegulators(() => resolve(true));
	}));
	//Chargement des fenêtres
	promise_chain.push(new Promise(resolve => {
		_GetWindows(() => resolve(true));
	}));

	//Chargement des historiques
	for (var i = 0; i < GID_LIST.length; i++) {
		promise_chain.push(new Promise(resolve => {
			_GetHistory(GID_LIST[i], () => resolve(true));
		}));
	}

	//On attend que toute les promesses soient effectués
	await Promise.all(promise_chain);
	//On peut lancer l'impression
	window.print()
}

//Rechargement de la page
function cmActionReload(){
	location.reload(true);
}

//Rapport de bug (redirige vers les paramètres à la section bug)
function cmActionReportBug(){
	location.hash = "Settings";
	document.getElementById("PS_group_bug").scrollIntoView({behaviour:"smooth"});
}

//Lien vers le code de la page
function cmActionGetCode(){
	location.href = "https://github.com/D-Maurin/MyHome";
}