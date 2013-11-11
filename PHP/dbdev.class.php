<?
class DBdev {
	public function DBdev() { }
	
	public static function leesNaamUitDB($Student) {
		$Student = (int) substr($Student, 1);
		
		if(!$DBh = mysql_connect(':/tmp/mysql.sock', 'webdevrunl', 'webdevrunl'))
		exit;
		if(!mysql_select_db('webdevrunl', $DBh))
		exit;
		if(!$resultaat = mysql_query('SELECT s_voornaam FROM studenten WHERE s_id='.$Student, $DBh))
		exit;
		
		$selectie = mysql_fetch_assoc($resultaat);
		return $selectie['s_voornaam'];
	}
	
	public static function leesCommentaarUitDB($Student, $eis, $vak) {
		$Student = (int) substr($Student, 1);
		$eis = (int) $eis;
		
		if(!$DBh = mysql_connect(':/tmp/mysql.sock', 'webdevrunl', 'webdevrunl'))
		exit;
		if(!mysql_select_db('webdevrunl', $DBh))
		exit;
		if(!$resultaat = mysql_query('SELECT commentaar FROM commentaar WHERE s_id='.$Student.' AND eis='.$eis.' AND vak=\''.$vak.'\'', $DBh))
		exit;
		
		$selectie = mysql_fetch_assoc($resultaat);
		return $selectie['commentaar'];
	}
	
	public static function bewaarCommentaarInDB($Student, $eis, $commentaar, $vak) {
		$Student = (int) substr($Student, 1);
		$eis = (int) $eis;
		
		if(!$DBh = mysql_connect(':/tmp/mysql.sock', 'webdevrunl', 'webdevrunl'))
		exit;
		if(!mysql_select_db('webdevrunl', $DBh))
		exit;
		if(!$resultaat = mysql_query('UPDATE commentaar SET commentaar=\''.$commentaar.'\' WHERE s_id='.$Student.' AND eis='.$eis.' AND vak=\''.$vak.'\'', $DBh))
		exit;
		
	}


}
?>