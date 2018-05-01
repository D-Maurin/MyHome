$select = (t) => document.querySelector(t);

Room = (ID) => ({
	name: $select('[GID="' + ID + '"] > .PH_room_name > .PH_room_name_label'),
	sensor: {
		root: $select('[GID="' + ID + '"] > .PH_room_values > .sensor_module'),
		val: $select('[GID="' + ID + '"] > .PH_room_values > .sensor_module > .ext_temp_disp > .etd_temp')
	},
	regulators: {
		root: $select('[GID="' + ID + '"] > .PH_room_values > .regulator_module'),
		val: $select('[GID="' + ID + '"] > .PH_room_values > .regulator_module > .ext_temp_disp > .etd_temp')
	},
	sensor_history: {
		min: $select('[GID="' + ID + '"] > .PH_room_history > .history_extremum > .history_min'),
		max: $select('[GID="' + ID + '"] > .PH_room_history > .history_extremum > .history_max'),
		view: $select('[GID="' + ID + '"] > .PH_room_history > .history_view')
	}
	
});

RoomEdit = (ID) => ({
	root: $select('[GID="' + ID + '"]'),
	newroot: $select("#PH_new_room"),
	name: $select('[GID="' + ID + '"] > .Edit_room_name > .Edit_room_name_input'),
	sensors: $select('[GID="' + ID + '"] > .Edit_room_modules > .Edit_sensor_module'),
	regulators: $select('[GID="' + ID + '"] > .Edit_room_modules > .Edit_regulator_module')
});

RoomExists = (ID) => ((document.getElementById("PH_room_" + ID) === null)?false:true)
RoomsRoot = () => document.getElementById("PH_rooms");

RegulatorsRoot = () => document.querySelector("#PI_regulators > .PI_group_list");
SensorsRoot = () => document.querySelector("#PI_sensors > .PI_group_list");