<?php
// Geen ongevraagde foutmeldingen!
// error_reporting(0);

// Gebruik de Webdev-klasse.
include '/pub/webdev.ru.nl/webdev.class.php';

// Stuur door naar $uri
Webdev::Redirect('http://'.$_SERVER['SERVER_NAME'].'/student/'.$_SERVER['PHP_AUTH_USER'].'/');
?>