document.oncontextmenu = function(ev){
	var cm_div = document.getElementById("context_menu");
	ev.preventDefault();

	var cm_posx = ev.clientX - 20;
	var cm_posy = ev.clientY - 80;

	void cm_div.offsetWidth;
	cm_div.style.display = "block";
	cm_div.style.left = cm_posx.toString() + "px";
	cm_div.style.top = cm_posy.toString() + "px";
}


function StopCM(){
	cm_div = document.getElementById("context_menu");
	cm_div.style.display = "none";
}

document.addEventListener("click", StopCM);
window.addEventListener("resize", StopCM);
window.addEventListener("scroll", StopCM);
document.addEventListener("blur", StopCM);

async function cmActionPrint(){
	var promise_chain = new Array();
	promise_chain.push(new Promise(resolve => {
		_GetSensors(() => resolve(true));
	}));
	promise_chain.push(new Promise(resolve => {
		_GetRegulators(() => resolve(true));
	}));

	for (var i = 0; i < GID_LIST.length; i++) {
		promise_chain.push(new Promise(resolve => {
			_GetHistory(GID_LIST[i], () => resolve(true));
		}));
	}

	await Promise.all(promise_chain);
	window.print()
}

function cmActionReload(){
	location.reload(true);
}

function cmActionReportBug(){
	location.hash = "Settings";
	document.getElementById("PS_group_bug").scrollIntoView({behaviour:"smooth"});
}

function cmActionGetCode(){
	location.href = "https://github.com/D-Maurin/MyHome";
}