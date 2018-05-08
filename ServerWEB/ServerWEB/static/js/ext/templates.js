/*###############################################################
templates.js - templates html utilisés en js inseres dans la page
###############################################################*/

// --- les triples crochets {{{}}} sont remplacés dynamiquement en js ---


const TEMPLATE_ROOM = `
<div class="PH_room" id="PH_room_{{{GID}}}" GID="{{{GID}}}" edit_mode="false">
	<input class="PH_history_bt" id="ck_{{{GID}}}" type="checkbox" style="display:none"
		onchange="if(this.checked){_GetHistory({{{GID}}})}">
	
	<div class="PH_room_name">
		<label for="ck_{{{GID}}}" class="PH_room_name_label"></label>
		<div href="#Settings" class="PH_edit_room" onclick="StartEdition({{{GID}}})"></div>
	</div>

	<div class="Edit_room_name">
		<input type="text" value="" class="Edit_room_name_input"/>
		<div class="Edit_room_action">
			<div class="Edit_room_validate" onclick="SaveEdition({{{GID}}})">Valider</div>
			<div class="Edit_room_annulate" onclick="CancelEdition({{{GID}}})">Annuler</div>
		</div>
	</div>
	<div class="Edit_room_modules">
		<div class="Edit_sensor_module"></div>
		<div class="Edit_regulator_module"></div>
		<div class="Edit_window_module"></div>
	</div>
	
	<div class="PH_room_values">
		<div class="sensor_module" warn_uptd="false">
			<div class="sm_title">Température de la pièce&nbsp;:</div>
			<div class="ext_temp_disp">
				<span class="etd_temp"></span>
				<img src="/static/img/badge_warning.svg" class="sm_warning etd_warning"
					draggable="false" ondragstart="return false">
			</div>
		</div>
		
		<div class="regulator_module" warn_has_reg="false" warn_uptd="false">
			<div class="rm_title">Température cible&nbsp;:</div>
			<div class="ext_temp_disp">
				<span class="etd_temp" locked="false"></span>
				<div class="rm_editor">
					<img src="/static/img/badge_more.svg" class="rm_edit_more"
						onclick="setTempTarget('+', {{{GID}}})" draggable="false" ondragstart="return false">
					<img src="/static/img/badge_less.svg" class="rm_edit_less"
						onclick="setTempTarget('-', {{{GID}}})" draggable="false" ondragstart="return false">
				</div>
				<img src="/static/img/badge_warning.svg" class="rm_warning etd_warning"
				 	draggable="false" ondragstart="return false">
			</div>
		</div>

		<div class="window_module" warn_uptd="false" open="0" hasw="0">
			<div class="wm_title">Fenêtre(s)&nbsp;:</div>
			<div class="wm_state">
				<img src="/static/img/badge_warning.svg" class="wm_warning etd_warning"
					draggable="false" ondragstart="return false">
			</div>
		</div>
	</div>
	
	<div class="PH_room_history">
		<div class="history_extremum">
			<span class="history_max">~</span>
			<span class="history_min">~</span>
		</div>
		<svg class="history_view" width="100%" height="100%" viewBox="0 0 2880 100" preserveAspectRatio="none"> 
		</svg>
	</div>

	<div class="delete_bt" onclick="DeleteRoom({{{GID}}})">
	</div>
</div>`

const TEMPLATE_ROOM_CREATE = `
<div class="PH_room" id="PH_room_0" GID="0" edit_mode="true"><div class="Edit_room_name">
		<input type="text" value="" class="Edit_room_name_input"/>
		<div class="Edit_room_action">
			<div class="Edit_room_validate" onclick="RoomCreation()">Créer</div>
			<div class="Edit_room_annulate" onclick="CancelCreation()">Annuler</div>
		</div>
	</div>
	<div class="Edit_room_modules">
		<div class="Edit_sensor_module"></div>
		<div class="Edit_regulator_module"></div>
		<div class="Edit_window_module"></div>
	</div>
</div>
`

const TEMPLATE_HISTORY_DATA_PART = `
<polygon points="{{{history_area}}}" 
	stroke="none" fill="rgb(176,255,178)"  vector-effect="non-scaling-stroke"/>
<path d="{{{history_points}}}" 
	stroke="rgb(0, 250, 0)" fill="none" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
`

const TEMPLATE_HISTORY_NODATA_PART = `
<path d="{{{history_points}}}" 
	stroke="rgb(176,255,178)" stroke-dasharray="5, 5" fill="none" stroke-linecap="round" stroke-width="1" vector-effect="non-scaling-stroke"/>
`

const TEMPLATE_SENSOR_INFO = `
<div class="PI_sensor_info" SID="{{{SID}}}" id="sensor_{{{SID}}}" deletable="{{{deletable}}}">
	<div class="PI_si_SID">
		<span class="PI_si_SID_sid">{{{SID}}}</span><span class="PI_si_SID_room">{{{sensor_room}}}</span>
	</div>
	<div class="PI_si_state">
		<div class="PI_si_state_uptd" uptd="{{{sensor_uptd}}}"></div>
		<div class="PI_si_state_used" used="{{{sensor_used}}}"></div>
	</div>
	<div class="PI_si_del" onclick="DeleteModuleSensor('{{{SID}}}')">
	</div>
</div>
`

const TEMPLATE_REGULATOR_INFO = `
<div class="PI_regulator_info" RID="{{{RID}}}" id="regulator_{{{RID}}}" deletable="{{{deletable}}}">
	<div class="PI_ri_RID">
		<span class="PI_ri_RID_rid">{{{RID}}}</span><span class="PI_ri_RID_room">{{{regulator_room}}}</span>
	</div>
	<div class="PI_ri_state">
		<div class="PI_ri_state_uptd" uptd="{{{regulator_uptd}}}"></div>
		<div class="PI_ri_state_used" used="{{{regulator_used}}}"></div>
	</div>
	<div class="PI_ri_del" onclick="DeleteModuleRegulator('{{{RID}}}')">
	</div>
</div>
`

const TEMPLATE_WINDOW_INFO = `
<div class="PI_window_info" WID="{{{WID}}}" id="window_{{{WID}}}" deletable="{{{deletable}}}">
	<div class="PI_wi_WID">
		<span class="PI_wi_WID_wid">{{{WID}}}</span><span class="PI_wi_WID_room">{{{window_room}}}</span>
	</div>
	<div class="PI_wi_state">
		<div class="PI_wi_state_uptd" uptd="{{{window_uptd}}}"></div>
		<div class="PI_wi_state_used" used="{{{window_used}}}"></div>
	</div>
	<div class="PI_wi_del" onclick="DeleteModuleWindow('{{{WID}}}')">
	</div>
</div>
`

const TEMPLATE_REGULATOR_SELECT = `
<div class="PE_regulator" RID="{{{RID}}}">
	<input type="checkbox" id="G{{{GID}}}R{{{RID}}}" RID="{{{RID}}}" 
		init_state="{{{init_state}}}" {{{selected}}} style="display:none"/>
	<label for="G{{{GID}}}R{{{RID}}}" class="PE_regulator_lbl">
		<div class="PE_regulator_name">{{{RID}}}</div>
		<div class="PE_regulator_select"></div>
	</label>
</div>
`

const TEMPLATE_SENSOR_SELECT = `
<div class="PE_sensor" SID="{{{SID}}}">
	<input type="radio" id="G{{{GID}}}S{{{SID}}}" name="G{{{GID}}}" SID="{{{SID}}}" 
		init_state="{{{init_state}}}" {{{selected}}} style="display:none"/>
	<label for="G{{{GID}}}S{{{SID}}}" class="PE_sensor_lbl">
		<div class="PE_sensor_name">{{{SID}}}</div>
		<div class="PE_sensor_select"></div>
	</label>
</div>
`

const TEMPLATE_WINDOW_SELECT = `
<div class="PE_window" WID="{{{WID}}}">
	<input type="checkbox" id="G{{{GID}}}W{{{WID}}}" WID="{{{WID}}}" 
		init_state="{{{init_state}}}" {{{selected}}} style="display:none"/>
	<label for="G{{{GID}}}W{{{WID}}}" class="PE_window_lbl">
		<div class="PE_window_name">{{{WID}}}</div>
		<div class="PE_window_select"></div>
	</label>
</div>
`