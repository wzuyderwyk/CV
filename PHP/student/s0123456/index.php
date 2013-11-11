<?php
// Geen ongevraagde foutmeldingen!
// error_reporting(0);

// Gebruik de Webdev-klasse.
include '/pub/webdev.ru.nl/webdev.class.php';
include '/pub/webdev.ru.nl/dbdev.class.php';

// Laad statische XHTML/XML-bestand; maak DOMDocument-object.
$domobj = Webdev::getDomobj();

// Verzend als XHTML waar praktisch haalbaar.
Webdev::sendMIME();

// Valideer statische XHTML. Stop als het nu al niet valideert.
($domobj->validate()) ? null : die('XML valideert niet!');

// Verwelkom student
Webdev::createTextNodeAndAppend($domobj, 'gebruiker', 'Welkom '.DBdev::leesNaamUitDB($_SERVER['PHP_AUTH_USER']));
Webdev::breakLine($domobj, 'gebruiker');

// Voeg inlognaam toe.
Webdev::createTextNodeAndAppend($domobj, 'gebruiker', Webdev::getGebruiker());
Webdev::breakLine($domobj, 'gebruiker');

// Toon een ongeoordende lijst met alle vakken in het element met id 'dyn_inh'
Webdev::createTextNodeAndAppend($domobj, 'dyn_inh', 'Selecteer je vak:');
Webdev::breakLine($domobj, 'dyn_inh');
Webdev::createElementAndAppend($domobj, 'dyn_inh', 'vakken', 'div');

// Doe hetzelfde in div-element lbalk
Webdev::createElementAndAppend($domobj, 'lbalk', 'lbalk_vakken', 'div');
Webdev::createElementAndAppend($domobj, 'lbalk_vakken', 'lbalk_vakken_header', 'h1');
Webdev::createTextNodeAndAppend($domobj, 'lbalk_vakken_header', 'Vakken:');

// Initieer een array met alle mogelijke vakken
$vakken = array('cs001','cs002','cs003','cs004','cs005');

// Bekijk welke vakken de student volgt; welke bestanden in de students directory 'courses' staat
foreach($vakken as $i => $val) {
	if(!is_dir('./courses/'.$val))
	unset($vakken[$i]);
}

if(sizeof($vakken)) {
	Webdev::createElementAndAppend($domobj, 'vakken', 'vakken_lijst', 'ul');
	Webdev::createElementAndAppend($domobj, 'lbalk_vakken', 'lbalk_vakken_lijst', 'ul');
	Webdev::createAttributeAndAppend($domobj, 'lbalk_vakken_lijst', 'class', 'sub');
}

foreach($vakken as $vak) {
Webdev::createElementAndAppend($domobj, 'vakken_lijst', $vak.'_lijstitem', 'li');
Webdev::createLink($domobj, $vak.'_lijstitem', $vak.'_link', $vak, 'courses/'.$vak.'/?'.$vak);
Webdev::createElementAndAppend($domobj, 'lbalk_vakken_lijst', $vak.'_lbalk_lijstitem', 'li');
Webdev::createLink($domobj, $vak.'_lbalk_lijstitem', $vak.'_lbalk_link', $vak, 'courses/'.$vak.'/?'.$vak);
}


// Stuur het XHTML-bestand naar het scherm als het document valideert, geef anders een foutmelding.
($domobj->validate()) ? print($domobj->saveXML()) : print('XML valideert niet!');


?>