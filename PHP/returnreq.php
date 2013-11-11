<?php
$request = apache_request_headers();

foreach($request as $header => $value)
	print("$header: $value<br/>");

print("<br/>");

$response = apache_response_headers();

foreach($response as $header => $value)
	print("$header: $value<br/>");
	

?>