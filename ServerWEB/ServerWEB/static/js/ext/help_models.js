CHAIN_HELP_CREATE = () => Object({
	pre_func:[
		() => {location.hash = "#Home"},
		CloseHelpInvite
	],
	conditions:[
		() => (document.getElementById("PH_room_0") != null)
	],
	post_func:[
		() => HelpInvite("Perdus ?", "Découvrons l'interface ensemble", CHAIN_HELP_DISCOVER)
	],
	chain:[
		[
			"Cliquez dans le cadre pour rentrer le nom de la pièce", $div("#PH_room_0 .Edit_room_name_input"), false,
			() => new Promise((resolve, reject) => {
				$div("#PH_room_0 .Edit_room_name_input").addEventListener("focus", () => resolve(true)),
				$div("#help_stop").addEventListener("click", () => reject(false));
			}),
			nocondition
		],
		[
			"Choississez un nom pour la pièce", $div("#PH_room_0 .Edit_room_name_input"), true,
			() => help_wait_next("C'est fait"),
			() => ($div("#PH_room_0 .Edit_room_name_input").value != "")
		],
		[
			"Selectionnez la sonde de température installée dans la pièce", $div("#PH_room_0 .Edit_sensor_module"), true,
			() => help_wait_next("C'est fait"),
			nocondition
		],
		[
			"Selectionnez le ou les radiateur(s) de cette pièce", $div("#PH_room_0 .Edit_regulator_module"), true,
			() => help_wait_next("C'est fait"),
			() => (!Array.from($alldiv("input[rid]")).every( (el) => el.checked==false))
		],
		[
			"Selectionnez le ou les fenêtre(s) de cette pièce", $div("#PH_room_0 .Edit_window_module"), true,
			() => help_wait_next("C'est fait"),
			nocondition
		],
		[
			"Appuyez sur créer et c'est fini !", $div("#PH_room_0 .Edit_room_validate"), false,
			() => new Promise((resolve, reject) => {
				$div("#PH_room_0 .Edit_room_validate").addEventListener("click", () => resolve(true))
				$div("#help_stop").addEventListener("click", () => reject(false));
			}),
			nocondition
		],
	]
});

CHAIN_HELP_DISCOVER = () => Object({
	pre_func:[
		() => {location.hash = "#Home"},
		CloseHelpInvite
	],
	conditions:[
		() => ($div(".PH_room:first-child") != null)
	],
	post_func:[
	],
	chain:[
		[
			"Commençons par la page principale. Vous y trouverez toute les informations sur vos pièces", $div("#mb_1"), true,
			() => help_wait_next("OK !"),
			nocondition
		],
		[
			"Prenons l'exemple de votre première pièce", $div(".PH_room:first-child .PH_room_name_label"), true,
			() => help_wait_next("Allons-y"),
			nocondition
		],
		[
			"Ici est indiqué la température de la pièce que votre capteur a mesuré", $div(".PH_room:first-child .sensor_module .ext_temp_disp"), true,
			() => help_wait_next("Compris"),
			nocondition
		],
		[
			"Et ici, la température que vous voulez dans la pièce", $div(".PH_room:first-child .regulator_module .ext_temp_disp"), true,
			() => help_wait_next("OK !"),
			nocondition
		],
		[
			"Vous pouvez l'augmenter ...", $div(".PH_room:first-child .regulator_module .rm_edit_more"), true,
			() => help_wait_next("..."),
			nocondition
		],
		[
			"... ou la diminuer", $div(".PH_room:first-child .regulator_module .rm_edit_less"), true,
			() => help_wait_next("Facile !"),
			nocondition
		],
	]
});