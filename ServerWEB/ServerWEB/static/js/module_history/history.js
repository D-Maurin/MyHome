/*#############################################################
history.js - Charge l'historique des température pour une pièce
#############################################################*/

function _GetHistory(gid, callback)
{

	//Requete
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/get_history/' + gid);
	xhr.timeout = 4000;
	xhr.send(null);
	
	//Recuperation data
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);

			//On efface l'ancienne courbe
			var history_target = Room(gid).sensor_history;
			history_target.view.innerHTML = "";
			
			//on définit des variables
			var min_value = 100, max_value = -100;
			var breaked = true, firstdone = false;
			var temp_path = ""; //contient les points de la courbe svg
			var temp_points = ""; //contient le polygone d'aire sous la courbe
			var last_time = 0;
			
			//On parcours les couples (temps, valeur) dans la réponse
			for(var i=0; i<response.length; i++)
			{
				//On recupere le couple courant dans une variable
				var temp_row = response[i];
				
				//On verifie si c'est un extremum
				if(temp_row[0] < min_value){
					min_value = temp_row[0];
				}
				if(temp_row[0] > max_value){
					max_value = temp_row[0];
				}
				
				//On recupere le couple suivant
				if(i==response.length-1){var temp_next_row = temp_row;}
				else{var temp_next_row = response[i+1];}
				
				//Si la courbe est cassé (trop de temps entre 2 couples de valeurs)
				if(breaked)
				{

					//Si le premier couple a été traité 
					if(firstdone)
					{
						//on insere un trai pointié reliant la cassure
						var temp_last_row = response[i-1];
						var temp_link_path = "M " + temp_last_row[3] + " " + temp_last_row[2] + " L " + temp_row[3] + " " + temp_row[2];
						history_target.view.innerHTML += TEMPLATE_HISTORY_NODATA_PART
							.replace(/{{{path_data}}}/g, temp_link_path);
					}
					breaked = false;
					//On ajoute un point 
					temp_path = "M " + temp_row[3] + " " + temp_row[2];
					temp_points = temp_row[3] + " 100";
					
					temp_points += ", " + temp_row[3] + " " + temp_row[2];
					last_time = temp_row[3];
				}
				else
				{
					//On ajoute un point si la temperature a changé par rapport a la precedente (evite les paliers)
					var temp_last_row = response[i-1];
					if(i==response.length-1 || temp_next_row[3] - temp_row[3] > 30 || temp_last_row[0] !== temp_row[0])
					{
						temp_path += " L " + temp_row[3] + " " + temp_row[2];
						temp_points += ", " + temp_row[3] + " " + temp_row[2];
					}
				}
				
				//Si il y a une coupure
				if(i==response.length-1 || temp_next_row[3] - temp_row[3] > 30)
				{
					//on termine le chemin et l'aire
					var temp_end_point = temp_row[3];
					if(temp_row[3] === last_time)
					{
						temp_end_point = temp_row[3] + 1;
						temp_path += " L " + temp_end_point + " " + temp_row[2];
						temp_points += ", " + temp_end_point + " " + temp_row[2];
					}
					
					temp_points += "," + temp_end_point + " 100";
					//on déclare la courbe coupée
					breaked = true;
					
					//on ajoute la courbe et l'aire au svg
					history_target.view.innerHTML += TEMPLATE_HISTORY_DATA_PART
						.replace(/{{{history_area}}}/g, temp_points)
						.replace(/{{{history_points}}}/g, temp_path);
				}
				firstdone = true;
			}
			
			//Si historique est valide
			if(response.length > 0)
			{
				history_target.min.innerHTML = (min_value).toFixed(1).toString();
				history_target.max.innerHTML = (max_value).toFixed(1).toString();
			}
			//sinon on affiche pas les extremum
			else
			{
				history_target.min.innerHTML = "~";
				history_target.max.innerHTML = "~";
			}
			
			//On appelle le callback si un callback est passé en parametre
			if(callback){callback()}
		}
	});
}


