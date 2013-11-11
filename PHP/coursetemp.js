function voegCommentaarToe(textareaId, student, vak) {
	
var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");

req.onreadystatechange = function()
{
if(req.readyState==4)
{
commentaar = req.responseText;

eis = document.getElementById(textareaId).parentNode;
tekstvak = document.getElementById(textareaId);

nieuwTekstvak = document.createElement('textarea');
nieuwTekstvak.appendChild(document.createTextNode(commentaar));

eis.removeChild(tekstvak);
eis.appendChild(nieuwTekstvak);
}
}

tekstInVak = document.getElementById(textareaId).value;

postdata = 'commentaar=';
postdata += tekstInVak;
posturl = 'http://webdev.ru.nl/student/' + student + '/insertComment.php?s_id=' + student + '&eis=' + textareaId.substr(-1) + '&vak=' + vak;

req.open('POST', posturl,true);
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
req.setRequestHeader("Content-length", postdata.length);
req.send(postdata);

}