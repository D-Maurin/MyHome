function ChangePasswd(form)
{
	var oldpasswd = form.oldpasswd.value;
	var newpasswd = form.newpasswd.value;

	var xhr = new XMLHttpRequest();
	xhr.timeout = 4000;
	xhr.open('POST', '/change_passwd');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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

function samePasswdCheck(form)
{
	var fisrt_input = form.newpasswd;
	var confirm_input = form.cnfpasswd;

	if(fisrt_input.value != confirm_input.value && confirm_input.value != ""){
		confirm_input.setCustomValidity("Les mots de passe sont différents");
	}
	else{
		confirm_input.setCustomValidity("");
	}
}

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


function ChangeName(form)
{
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

function ChangeLoc(form)
{
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

function tryLocalisation(el)
{
	if("geolocation" in navigator)
	{
		if(el.parentNode.latitude.value == "" && el.parentNode.longitude.value == ""){
			navigator.geolocation.getCurrentPosition(position => {
			  	if(el.parentNode.latitude.value == "" && el.parentNode.longitude.value == ""){
				  	el.parentNode.latitude.value = position.coords.latitude;
				  	el.parentNode.longitude.value = position.coords.longitude;
				}
			});
		}
	}
}