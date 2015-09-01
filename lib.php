<?php
global $PAGE;
//$PAGE->requires->js_call_amd('local_eexcess/APIconnector', 'initialise', $params);
//$PAGE->requires->js_call_amd('local_eexcess/iframes', 'initialise', $params);
$params = array('base_url' => $CFG->wwwroot);
$PAGE->requires->string_for_js('showicon', 'local_eexcess');
$PAGE->requires->js_call_amd('local_eexcess/EEXCESSResults','init',$params);
