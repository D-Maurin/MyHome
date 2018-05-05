function HelpTargetElement(target)
{
	var pos = target.getBoundingClientRect();

	var mooving = (
		pos.x != target.OldRect.x || 
		pos.y != target.OldRect.y || 
		pos.width != target.OldRect.width ||
		pos.height != target.OldRect.height);

	if(target.First || (!mooving && !target.Update))
	{
		var center_x = pos.x + pos.width/2;
		var center_y = pos.y + pos.height/2;
		var radius_in = Math.sqrt((pos.width/2)**2 + (pos.height/2)**2) + 10;
		var radius_out = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);

		var stroke_width = (radius_out - radius_in);
		var radius = radius_in + stroke_width/2;

		var _circle = document.getElementById("help_circle");
		_circle.setAttribute("cx", center_x);
		_circle.setAttribute("cy", center_y);
		_circle.setAttribute("r", radius);
		_circle.setAttribute("stroke-width", stroke_width);

		//Curve and text

		var space_top = center_y - radius_in;
		var space_bottom = window.innerHeight - center_y - radius_in;
		var space_left = center_x - radius_in;
		var space_right = window.innerWidth - center_x - radius_in;
		var anchor_size = (radius_in + 5)*Math.sqrt(2)*0.5;

		if(space_top > space_bottom && space_top > space_left && space_top > space_right){
			var text_pos="top";
			var anchor = [center_x + anchor_size, center_y - anchor_size]; 
			var end = [center_x + radius_in, center_y - radius_in - 50];
			var guide = [(anchor[0] + end[0])/2 + 20, (anchor[1] + end[1])/2];
			var text_style = "bottom:" + (window.innerHeight - end[1]).toString() + "px; right:" + (window.innerWidth - end[0]).toString() + "px";
		}
		else if(space_bottom > space_top && space_bottom > space_left && space_bottom > space_right){
			var text_pos="bottom";
			var anchor = [center_x - anchor_size, center_y + anchor_size];
			var end = [center_x - radius_in, center_y + radius_in + 50];
			var guide = [(anchor[0] + end[0])/2 - 20, (anchor[1] + end[1])/2];
			var text_style = "top:" + end[1].toString() + "px; left:" + end[0].toString() +"px";
		}
		else if(space_right > space_top && space_right > space_left && space_right > space_bottom){
			var text_pos="right";
			var anchor = [center_x + anchor_size, center_y + anchor_size];
			var end = [center_x + radius_in + 50, center_y + radius_in/2];
			var guide = [(anchor[0] + end[0])/2, (anchor[1] + end[1])/2 + 20];
			var text_style = "left:" + end[0].toString() + "px; bottom:" + (window.innerHeight - end[1]).toString() + "px";
		}
		else{
			var text_pos="left";
			var anchor = [center_x - anchor_size, center_y - anchor_size];
			var end = [center_x - radius_in - 50, center_y - radius_in/2];
			var guide = [(anchor[0] + end[0])/2, (anchor[1] + end[1])/2 - 20];
			var text_style = "right:" + (window.innerWidth - end[0]).toString() + "px; top:" + end[1].toString() + "px";
		}

		var path = "M" + anchor.toString() + " " + 
			"C" + guide.toString() + " " + guide.toString() + " " + end.toString();

		var _text_ct = document.getElementById("help_text_ct");
		var _curve = document.getElementById("help_curve");

		_curve.setAttribute("d", path);
		_text_ct.setAttribute("position", text_pos);
		_text_ct.style = text_style;

		var text_pos = _text_ct.getBoundingClientRect();
		var new_text_style = "top:" + text_pos.top + "px; left:" + text_pos.left + "px;";
		if(text_pos.left == 0){new_text_style += "width:" + text_pos.width + "px"}
		_text_ct.style = new_text_style;

		target.Update = true;
		document.getElementById("help_circle").setAttribute("mooving", "false");
	}
	else if(mooving)
	{
		target.Update = false;
		document.getElementById("help_circle").setAttribute("mooving", "true");
	}
	target.First = false;
	target.OldRect = pos;

}

function Help(target, msg)
{
	document.getElementById("help_main").setAttribute("help_active", "true");
	document.getElementById("help_text").innerHTML = msg;

	target.OldRect = new DOMRect();
	target.Update = false;
	target.First = true;
	HelpTargetElement(target);
	target.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
	if(INTERVALS["Help"] != undefined){clearInterval(INTERVALS["Help"])}
	INTERVALS["Help"] = setInterval(() => HelpTargetElement(target), 100);
}

function StopHelp()
{
	if(INTERVALS["Help"] != undefined){clearInterval(INTERVALS["Help"])}
	document.getElementById("help_main").setAttribute("help_active", "false");
}

$div = cmd => document.querySelector(cmd);
$alldiv = cmd => document.querySelectorAll(cmd);

async function HelpChain(chain_help)
{
	chain_help.pre_func.map(x => x());
	if(chain_help.conditions.every(x => x()))
	{
		var chain = chain_help.chain;
		for (var i = 0; i < chain.length; i++) {
			Help(chain[i][1], chain[i][0]);

			if(chain[i][2]){
				$div("#help_next").style.display = "inline-block";
			}
			else{
				$div("#help_next").style.display = "none";
			}

			do
			{
				try{ await chain[i][3](); }
				catch(e){ return StopHelp() }
			} while( !chain[i][4]() );
			
		}
		StopHelp();
	}
	chain_help.post_func.map(x => x());
}

//[string:message, dom:target, bool:btnext, func:promise, condition]

function help_wait_next(msg)
{
	$div("#help_next").innerHTML = msg;
	return new Promise((resolve, reject) => {
		$div("#help_next").addEventListener("click", () => resolve(true));
		$div("#help_stop").addEventListener("click", () => reject(false));
	})
}

function nocondition()
{
	return true;
}



function HelpInvite(msg_1, msg_2, chain_help)
{
	$div("#PH_help_invite").setAttribute("show", "true");
	$div("#PH_help_invite_msg").innerHTML = msg_1;
	$div("#PH_help_invite_link").innerHTML = msg_2;
	$div("#PH_help_invite_link").addEventListener("click", () => HelpChain(chain_help()));
}

function CloseHelpInvite()
{
	$div("#PH_help_invite").setAttribute("show", "false");
}