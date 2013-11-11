<?php
class Webdev {
	public function Webdev() { 
	}
	
	public static function getDomobj() {
		$domobj = new DOMDocument('1.0','utf-8');
		$domobj->load('http://webdev.ru.nl/index.html');
		return $domobj;
	}
	
	public static function getGebruiker() {
		($_SERVER['PHP_AUTH_USER']) ? $gebruiker = 'Je bent ingelogd als: '.$_SERVER['PHP_AUTH_USER'].'.' : $gebruiker = 'Je bent niet ingelogd.';
		return $gebruiker;
	}
	
	public static function sendMIME() {
		(strpos($_SERVER['HTTP_ACCEPT'],'application/xml+xhtml')) ? header('Content-type: application/xml+xhtml') : header('Content-type: text/html;charset=utf-8');
	}
	
	public static function getMIME() {
		(strpos($_SERVER['HTTP_ACCEPT'],'application/xml+xhtml')) ? $header = 'Content-type: application/xml+xhtml' : $header = 'Content-type: text/html;charset=utf-8'; return $header;
	}
	
	public static function Redirect($uri) {
		header('Location: '.$uri);
	}
	
	public static function createTextNodeAndAppend($domobj, $appendToId, $textNode) {
		$Element = $domobj->getElementById($appendToId);
		$ElementChildToBe = $domobj->createTextNode($textNode);
		$Element->appendChild($ElementChildToBe);
	}
	
	public static function createAttributeAndAppend($domobj, $appendToId, $giveName, $Value) {
		$Element = $domobj->getElementById($appendToId);
		$Attribute = new DOMAttr($giveName, $Value);
		$Element->setAttributeNode($Attribute);
	}
	
	public static function createElementAndAppend($domobj, $appendToId, $giveId, $nodeType) {
		$Element = $domobj->getElementById($appendToId);
		$ElementChild = $Element->appendChild(new DOMElement($nodeType));
		$Attribute = new DOMAttr('id', $giveId);
		$ElementChild->setAttributeNode($Attribute);
		$ElementChild->setIdAttributeNode($Attribute,true);
	}
	
	public static function createElementWithIdAndOneOtherAttr($domobj, $nodeType, $appendToId, $giveId, $TextNode, $Attribute, $Value) {
		self::createElementAndAppend($domobj, $appendToId, $giveId, $nodeType);
		self::createTextNodeAndAppend($domobj, $giveId, $TextNode);
		self::createAttributeAndAppend($domobj, $giveId, $Attribute, $Value);
	}
	
	public static function createLink($domobj, $appendToId, $giveId, $TextNode, $Value) {
		self::createElementWithIdAndOneOtherAttr($domobj, 'a', $appendToId, $giveId, $TextNode, 'href', $Value);
	}
	
	public static function breakLine($domobj, $appendToId) {
		$Element = $domobj->getElementById($appendToId);
		$ElementChild = $Element->appendChild(new DOMElement('br'));
	}
}
?>