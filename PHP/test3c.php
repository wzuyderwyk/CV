<?php
// error_reporting(0);
$domobj = new DOMDocument('1.0','utf-8');
$domobj->load('http://webdev.ru.nl/cilinders.xml');
($domobj->validate()) ? print('XHTML+MathML+SVG valideert') : die('XHTML+MathML+SVG valideert niet!');

?>