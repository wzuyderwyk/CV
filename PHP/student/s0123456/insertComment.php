<?php

include '/pub/webdev.ru.nl/dbdev.class.php';

DBdev::bewaarCommentaarInDB($_GET['s_id'], $_GET['eis'], $_POST['commentaar'], $_GET['vak']);
$commentaar = DBdev::leesCommentaarUitDB($_GET['s_id'], $_GET['eis'], $_GET['vak']);
print($commentaar);

?>