<?php
global $PAGE;

//$PAGE->requires->js_call_amd('local_eexcess/APIconnector', 'initialise', $params);
//$PAGE->requires->js_call_amd('local_eexcess/iframes', 'initialise', $params);
$base_url = get_config('local_eexcess','base_url');
$params = array('base_url' => $CFG->wwwroot,'userid'=>$USER->id,'rec_base_url'=>$base_url);

$PAGE->requires->string_for_js('showicon', 'local_eexcess');
$PAGE->requires->js_call_amd('local_eexcess/EEXCESSResults','init',$params);

function local_eexcess_extends_navigation(global_navigation $navigation) {
$title = $navigation->add('Eexcess settings');
$url = new moodle_url('/local/eexcess/eexcess_options.php');
$subTitle = $title->add('Citation settings',$url);

}
function local_eexcess_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload) {
    global $CFG, $DB, $USER;

    $fullpath = "/{$context->id}/local_eexcess/$filearea/{$args[0]}/{$args[1]}";

    $fs = get_file_storage();
    if (!$file = $fs->get_file_by_hash(sha1($fullpath)) or $file->is_directory()) {
        return false;
    }

    send_stored_file($file);
}
