/*#########################################
settings.js - Fonctions de la page settings
#########################################*/

//Change le mot de passe
function ChangePasswd(form)
{
	//On recupere les donnés du formulaire (form)
	var oldpasswd = form.oldpasswd.value;
	var newpasswd = form.newpasswd.value;

	var xhr = new XMLHttpRequest();
	xhr.timeout = 4000;
	xhr.open('POST', '/change_passwd');
	//On indique que l'on envoie des données de formulaire
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//On paramètre les données à envoyer
 	xhr.send('oldpasswd=' + oldpasswd + '&newpasswd=' + newpasswd);

 	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var rcode = xhr.responseText;
			var ntarget = document.getElementById("PS_notify_passwd");
			ntarget.setAttribute("nrun", "true");
			if(rcode=="OK"){
				ntarget.setAttribute("ntype", "success");
				ntarget.innerHTML = "Mot de passe modifié avec succès";
			}
			else if(rcode=="BAD_PASSWORD"){
				ntarget.setAttribute("ntype", "error");
				ntarget.innerHTML = "Mot de passe incorrect";
			}
			else{
				ntarget.setAttribute("ntype", "error");
				ntarget.innerHTML = "Erreur inconnue";
			}
		}
		form.reset();
	});

	return false;
}

//Fonction de vérification validité champs newpasswd : vérifie s'ils sont identiques lorsquil sont changés
function samePasswdCheck(form)
{
	//On recupere les donnés du formulaire (form)
	var fisrt_input = form.newpasswd;
	var confirm_input = form.cnfpasswd;

	if(fisrt_input.value != confirm_input.value && confirm_input.value != ""){
		confirm_input.setCustomValidity("Les mots de passe sont différents");
	}
	else{
		confirm_input.setCustomValidity("");
	}
}

//Rapport de bug
function ReportBug(form)
{
	var bugmail = form.bugmail.value;
	var bugdesc = form.bugdesc.value;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/report_bug');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	xhr.send('bugdesc=' + bugdesc + '&bugmail=' + bugmail);

	var ntarget = document.getElementById("PS_notify_bug");
	ntarget.setAttribute("nrun", "true");
	ntarget.innerHTML = "Rapport en cours d'envoi ...";
	ntarget.setAttribute("ntype", "wait");

 	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var rcode = xhr.responseText;
			var ntarget = document.getElementById("PS_notify_bug");
			if(rcode=="OK"){
				ntarget.setAttribute("ntype", "success");
				ntarget.innerHTML = "Le bug a bien été rapporté";
			}
			else{
				ntarget.setAttribute("ntype", "error");
				ntarget.innerHTML = "Erreur inconnue";
			}
		}
		form.reset();
	});

	return false;
}

//change le nom
function ChangeName(form)
{
	//On recupere les donnés du formulaire (form)
	var username = form.username.value;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/update_info');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	xhr.send('username=' + username);


 	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var rcode = xhr.responseText;
			var ntarget = document.getElementById("PS_notify_infoloc");
			ntarget.setAttribute("nrun", "true");
			if(rcode=="OK"){
				ntarget.setAttribute("ntype", "success");
				ntarget.innerHTML = "Votre nom a été changé";
			}
			else{
				ntarget.setAttribute("ntype", "error");
				ntarget.innerHTML = "Erreur inconnue";
			}
		}
		form.reset();
		form.username.value = username;
	});

	return false;
}

//change la position (utilisée par meteo)
function ChangeLoc(form)
{
	//On recupere les donnés du formulaire (form)
	var lon = form.longitude.value;
	var lat = form.latitude.value;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/update_info');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	xhr.send('lat=' + lat + "&lon=" + lon);

 	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var rcode = xhr.responseText;
			var ntarget = document.getElementById("PS_notify_infoloc");
			ntarget.setAttribute("nrun", "true");
			if(rcode=="OK"){
				ntarget.setAttribute("ntype", "success");
				ntarget.innerHTML = "Votre localisation a été changé";
			}
			else{
				ntarget.setAttribute("ntype", "error");
				ntarget.innerHTML = "Erreur inconnue";
			}
		}
		form.reset();
	});

	return false;
}


//On geolocalise l'utilisateur pour l'aider a remplir les champs localisation
function tryLocalisation(el)
{
	//Si disponible
	if("geolocation" in navigator)
	{
		//Si les champs sont vides
		if(el.parentNode.latitude.value == "" && el.parentNode.longitude.value == ""){
			//On localise
			navigator.geolocation.getCurrentPosition(position => {
				//On reverifie que les champs sont vides
			  	if(el.parentNode.latitude.value == "" && el.parentNode.longitude.value == ""){
			  		//On rempli les champs
				  	el.parentNode.latitude.value = position.coords.latitude;
				  	el.parentNode.longitude.value = position.coords.longitude;
				}
			});
		}
	}
}