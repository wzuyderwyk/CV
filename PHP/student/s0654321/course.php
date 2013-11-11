<?php

if(!$vak = $_SERVER['QUERY_STRING'])
{ header('Location: http://webdev.ru.nl/student');
exit; }

$domobj = new DOMDocument('1.0', 'utf-8');
$domobj->load('http://webdev.ru.nl/courses/'.$vak.'.xml');
($domobj->validate()) ? null : print('Valideert niet');

$site = new DOMDocument('1.0', 'utf-8');
$site->load('http://webdev.ru.nl/coursetemp.html');
($site->validate()) ? null : print('Valideert niet');

include '/pub/webdev.ru.nl/webdev.class.php';
include '/pub/webdev.ru.nl/dbdev.class.php';

// Verwelkom student
Webdev::createTextNodeAndAppend($site, 'gebruiker', 'Welkom '.DBdev::leesNaamUitDB($_SERVER['PHP_AUTH_USER']));
Webdev::breakLine($site, 'gebruiker');

// Voeg inlognaam toe.
Webdev::createTextNodeAndAppend($site, 'gebruiker', Webdev::getGebruiker());
Webdev::breakLine($site, 'gebruiker');

Webdev::createTextNodeAndAppend($site, 'rooster_vak_placeh', $vak);

// Doe hetzelfde in div-element lbalk
Webdev::createElementAndAppend($site, 'lbalk', 'lbalk_vakken', 'div');
Webdev::createElementAndAppend($site, 'lbalk_vakken', 'lbalk_vakken_header', 'h1');
Webdev::createTextNodeAndAppend($site, 'lbalk_vakken_header', 'Vakken:');

// Initieer een array met alle mogelijke vakken
$vakken = array('cs001','cs002','cs003','cs004','cs005');

// Bekijk welke vakken de student volgt; welke bestanden in de students directory 'courses' staat
foreach($vakken as $i => $val) {
	if(!is_dir('./courses/'.$val))
	unset($vakken[$i]);
}

if(sizeof($vakken)) {
	Webdev::createElementAndAppend($site, 'lbalk_vakken', 'lbalk_vakken_lijst', 'ul');
	Webdev::createAttributeAndAppend($site, 'lbalk_vakken_lijst', 'class', 'sub');
}

foreach($vakken as $vak) {
Webdev::createElementAndAppend($site, 'lbalk_vakken_lijst', $vak.'_lbalk_lijstitem', 'li');
Webdev::createLink($site, $vak.'_lbalk_lijstitem', $vak.'_lbalk_link', $vak, 'courses/'.$vak.'/?'.$vak);
}

for($i=0;$i<$domobj->getElementsByTagName('event')->length;$i++)
	{ 	
		$index = $i + 1;
		
		$event = $domobj->getElementsByTagName('event')->item($i);
		$description = $event->childNodes->item(1)->nodeValue;
		$location = $event->childNodes->item(3)->nodeValue;
		$type = $event->attributes->getNamedItem('type')->nodeValue;
		switch($type)
		{ case 'lecture': $type = 'Hoorcollege'; break;
		case 'workshop': $type = 'Werkcollege'; break;
		case 'free': $type = '-'; break; }
		
		$site->getElementById('_'.$index.'u_omschr')->appendChild($site->createTextNode($description));
		$site->getElementById('_'.$index.'u_locatie')->appendChild($site->createTextNode($location));
		$site->getElementById('_'.$index.'u_werkvorm')->appendChild($site->createTextNode($type));
	}
	
Webdev::createTextNodeAndAppend($site, 'eisen_vak_placeh', $vak);

for($i=0;$i<$domobj->getElementsByTagName('req')->length;$i++)
	{ 	
		$index = $i + 1;
		
		$req = $domobj->getElementsByTagName('req')->item($i);
		$description = $req->childNodes->item(1)->nodeValue;
		$details = $req->childNodes->item(3)->nodeValue;
		
		Webdev::createElementAndAppend($site, 'eisen', 'eis'.$index, 'div');
		
		Webdev::createElementAndAppend($site, 'eis'.$index, 'beschr_'.$index, 'h2');
		Webdev::createTextNodeAndAppend($site, 'beschr_'.$index, $description);
		Webdev::createElementAndAppend($site, 'eis'.$index, 'details_'.$index, 'p');
		Webdev::createTextNodeAndAppend($site, 'details_'.$index, $details);
		
		$JSfunctie = 'voegCommentaarToe(\'commentaar_'.$index."', '".$_SERVER['PHP_AUTH_USER'].'\', \''.$vak.'\')';
		
		Webdev::createElementAndAppend($site, 'eis'.$index, 'commentaar_'.$index, 'textarea');
		Webdev::createAttributeAndAppend($site, 'commentaar_'.$index, 'onblur', $JSfunctie);
		
		$commentaar = DBdev::leesCommentaarUitDB($_SERVER['PHP_AUTH_USER'], $index, $vak);
		
		Webdev::createTextNodeAndAppend($site, 'commentaar_'.$index, $commentaar);
		
	}

print($site->saveXML());
?>