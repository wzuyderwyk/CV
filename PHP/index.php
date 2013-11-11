<?php
// Geen ongevraagde foutmeldingen!
// error_reporting(0);

// Gebruik de Webdev-klasse.
include '/pub/webdev.ru.nl/webdev.class.php';

// Laad statische XHTML/XML-bestand; maak DOMDocument-object.
$domobj = Webdev::getDomobj();

// Verzend als XHTML waar praktisch haalbaar.
Webdev::sendMIME();

// Valideer statische XHTML. Stop als het nu al niet valideert.
($domobj->validate()) ? null : die('XML valideert niet!');

// Maak hyperlink 'Log in' naar directory /student/ met id 'login_link' in het element met id 'gebruiker'
Webdev::createLink($domobj, 'gebruiker', 'login_link', 'Log in', '/student/');

// Stuur het XHTML-bestand naar het scherm als het document valideert, geef anders een foutmelding.
($domobj->validate()) ? print($domobj->saveXML()) : print('XML valideert niet!');
?>