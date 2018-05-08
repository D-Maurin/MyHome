/*####################################################################
temp_display.js - Gère l'affichage des temperatures et de leur couleur
####################################################################*/

//Fonction qui change la temperature et la couleur associée
function ChangeTemperature(ct, temp)
{
	ct.innerHTML = temp;
	ct.parentNode.style.background = 'radial-gradient(circle at 0 0,rgb(' + colorOf( temp + 0.8 ) +
											'),rgb(' + colorOf(temp) + ') 70%)';
}

//Calcul la couleur pour le degrade d'une temperature
function colorOf(value)
{
	var red = [255, 0, 0];
	var yellow = [255, 230, 0];
	var blue = [0, 174, 240];
	
	var color = [0,0,0];
	
	if(value > 25){
		color = [255, 0, 0];
	}
	else if(value < 15){
		color = [0, 174, 240];
	}
	else{
		if(value >= 20)
		{
			var per = 0.2*value - 4;
			color = [
				Math.round(per * red[0] + (1 - per) * yellow[0]),
				Math.round(per * red[1] + (1 - per) * yellow[1]),
				Math.round(per * red[2] + (1 - per) * yellow[2])
			];
		}
		else
		{
			var per = 0.2*value - 3;
			color = [
				Math.round(per * yellow[0] + (1 - per) * blue[0]),
				Math.round(per * yellow[1] + (1 - per) * blue[1]),
				Math.round(per * yellow[2] + (1 - per) * blue[2])
			];
		}
	}
	
	return String(color[0]) + "," + String(color[1]) + "," + String(color[2]);
}




