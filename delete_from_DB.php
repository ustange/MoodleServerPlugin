<?php
require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
$tablename = "local_eexcess_interests";
$id = $_POST['catid'];
$DB->delete_records($tablename,array("id"=>$id));

