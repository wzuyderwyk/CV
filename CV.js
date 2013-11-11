/** CV van Wietse Zuyderwyk
* 
@author: Wietse Zuyderwyk */

/* Te doen:
   20131028: Bij klik op CV naar meer gebruikelijke weergave (met ook meer tekst)

*/

/* Changelog:
   20131022: eerste prototype versie
   
   
*/

/* Testlog:
   20131028: Safari 5 heeft geen Event-constructor
   
   
   
*/
// Referenties: ecma-international.org/ecma-262/5.1/ & developer.mozilla.org/docs/Web/JavaScript/Reference

// Wzuyderwyk:
// Alle variabelen die ik gebruik geef ik een eigen lexical scope/"environment" / namespace om conflicten te voorkomen
var Wz, WzObject, Wzuyderwyk; // Allen referenten voor hetzelfde Object

(function (inGebruik) {
if(!inGebruik) return;

Wzuyderwyk = {
  hi: function () { },

// Gebeurtenissen. Referentie: w3.org/TR/DOM-Level-3-Events
// Gebeurtenissen kunnen op elk moment aan en uitgezet worden.
// Er is zoveel mogelijk 1 "master of the house"; 1 functiebeschrijving verantwoordelijk, per functionaliteit: gebeurtenissen leiden tot directe of indirecte actie, via andere gebeurtenissen.

  gebeurtenisBehandelaar: function (gebeurtenisNaam) {
    switch ( ((Object.getOwnPropertyDescriptor(this.instellingen,"gebruik" + gebeurtenisNaam).value.inGebruik)?gebeurtenisNaam:null) ) {
      case "MuisBewegingsKleurOvergang": return function (ev) { Wz.hi(ev); Wz.kleurCVTekst(ev); document.documentElement.childNodes[((!Wz.IEDOM)?2:1)].style.backgroundColor=WzObject.cursorBekenKleur(ev); };
      case "VensterDimensiesAanpassing": return function (ev) { if(document.getElementById("CV").style) { document.getElementById("CV").style.height = Math.floor(window.innerHeight/1.15)+"px"; document.getElementById("CV").style.width = Math.floor(window.innerWidth/((Wz.schermRatio()>1)?1.8:1.4))+"px"; }
          Wz.CVInhoud.style.height = Math.floor(window.innerHeight/1.15)+"px"; document.getElementById("CVInhoud").style.width = Math.floor(window.innerWidth/((Wz.schermRatio()>1)?1.8:1.4))+"px"; Wz.vergrootKolomEnScrollWanneerNodig(Math.floor(window.innerWidth/1.8)); Wz.herpositioneerInhoud(true); };
      case "MuisWielEenkolomsPaginaOmslag": return function (ev) { Wz.toonAndereKolomWanneerNodig(ev); };
      case "URLFragmentInhoudAanpassing": return function (ev) { if(!Wz.IEDOM)Wz.simuleerKlikOfHerlaad(); };
      case "PaginaGeladenDirecteAanpassing": return function (ev) { document.getElementById("CV").style.height = Math.floor(window.innerHeight/1.15)+"px"; document.getElementById("CV").style.width = Math.floor(window.innerWidth/((Wz.schermRatio()>1)?1.8:1.4))+"px";
          Wz.CVInhoud.style.height = Math.floor(window.innerHeight/1.15)+"px"; document.getElementById("CVInhoud").style.width = Math.floor(window.innerWidth/((Wz.schermRatio()>1)?1.8:1.4))+"px"; Wz.vergrootKolomEnScrollWanneerNodig(Math.floor(window.innerWidth/1.8)); Wz.herpositioneerInhoud(false);
          if(!Wz.IEDOM)window.dispatchEvent( new Event("hashchange") ); };
      case "MuisVerlaatViewPortAanpassing": return function (ev) { Wz.printStyleSheet.apply(Wz,[true,true]); };
      case "MuisKomtInViewPortAanpassing": return function (ev) { Wz.printStyleSheet.apply(Wz,[true,false]); };
      default: return function (ev) { };
    }
  },

  instellingen: {
    gebruikMuisBewegingsKleurOvergang: { inGebruik: false, gekoppeldAan: function () { return document.documentElement.childNodes[((!Wz.IEDOM)?2:1)]; }, type: "mousemove" },
    gebruikVensterDimensiesAanpassing: { inGebruik: false, gekoppeldAan: function () { return window; }, type: "resize" },
    gebruikMuisWielEenkolomsPaginaOmslag: { inGebruik: false, gekoppeldAan: function () { return window; }, type: "wheel" },
    gebruikURLFragmentInhoudAanpassing: { inGebruik: false, gekoppeldAan: function () { return window; }, type: "hashchange" },
    gebruikPaginaGeladenDirecteAanpassing: { inGebruik: false, gekoppeldAan: function () { return window; }, type: "load"  },
    gebruikMuisVerlaatViewPortAanpassing: { inGebruik: false, gekoppeldAan: function () { return document.querySelector("body"); }, type: "mouseleave"  },
    gebruikMuisKomtInViewPortAanpassing: { inGebruik: false, gekoppeldAan: function () { return document.querySelector("body"); }, type: "mouseenter"  }
  },

  pasInstellingenToe: function () {
    Object.keys(this.instellingen).forEach(function (property) {
      var instelling;
      (instelling = Object.getOwnPropertyDescriptor(Wz.instellingen,property).value)
      .gekoppeldAan().addEventListener(instelling.type,function (ev) {
          (Wz.gebeurtenisBehandelaar(property.substr(7)))(ev);
        },
        false);
    });
  },

  pasInstellingAan: function (instelling,waarde) {
    if(Wz.instellingen.hasOwnProperty(instelling)) Object.getOwnPropertyDescriptor(Wz.instellingen,instelling).value.inGebruik = waarde;
    return this.pasInstellingAan;
  },
  
  // childNodes is net zo efficient als firstNode en eigenlijk duidelijker/generieker, voor wie vanaf 0 kan tellen ;-)
  plaatsInfoInTekstElement: function (t) { document.getElementById("tekst").childNodes[0].nodeValue = t; },

  cursorBekenKleur: function (ev) { return "rgb("+((ev.screenX-(ev.screenX%4))/4)+","+((ev.screenY-(ev.screenY%4))/4)+","+((ev.screenX*ev.screenY)<80000?(160-((ev.screenX-(ev.screenX%4))/4)):((ev.screenX*ev.screenY)%64))+")"; },
  
  verkrijgHoek: function (coordinaten) {
    var reductieInBinair = [0,0];
    if(coordinaten[0] > Math.floor(window.innerWidth/2)) reductieInBinair[0] = 1;
    if(coordinaten[1] > Math.floor(window.innerHeight/2)) reductieInBinair[1] = 1;
 
    if ( reductieInBinair[0] == 1 && reductieInBinair[1] == 1 ) return 4;
    if ( reductieInBinair[0] == 0 && reductieInBinair[1] == 0 ) return 1;
    if ( reductieInBinair[0] == 1 && reductieInBinair[1] == 0 ) return 2;
    if ( reductieInBinair[0] == 0 && reductieInBinair[1] == 1 ) return 3;
  },
  
  // Maak de tekstkleur complementair aan de achtergrondkleur (naar benadering, met overgang)
  kleurCVTekst: function (ev) {
    var coordinaten = [ev.screenX, ev.screenY];
    var CVTekstVoorouderEnKnoppen = Wz.knoppen.concat([document.getElementById("CVInhoud")]);
    var veranderCVDoorzichtigheid = function(waarde) { try { document.getElementById("CV").style.opacity=waarde; } catch (ex) { document.getElementById("CV").style.WebkitOpacity=waarde; document.getElementById("CV").style.WebkitOpacity=waarde; } };
    var bronCodeAchtergrondStyles = document.getElementById("bronCodeAchtergrond").style;
    veranderCVDoorzichtigheid("0.8");
    switch(this.verkrijgHoek(coordinaten)) {
      case 1: CVTekstVoorouderEnKnoppen.forEach(function(item) { item.style.color = ((item.tagName==="LI")?"#f8d9e2":"#f8d9e2"); }); bronCodeAchtergrondStyles.opacity=((!Wz.IEDOM)?"0.1":"0.3"); veranderCVDoorzichtigheid("0.4"); break;
      case 2: CVTekstVoorouderEnKnoppen.forEach(function(item) { item.style.color = ((item.tagName==="LI")?"#dfe":"#497969"); }); bronCodeAchtergrondStyles.opacity=((!Wz.IEDOM)?"0.3":"0.6"); veranderCVDoorzichtigheid("0.9"); break;
      case 3: CVTekstVoorouderEnKnoppen.forEach(function(item) { item.style.color = ((item.tagName==="LI")?"#fef":"#794979"); }); bronCodeAchtergrondStyles.opacity=((!Wz.IEDOM)?"0.3":"0.6"); veranderCVDoorzichtigheid("0.9"); break;
      case 4: CVTekstVoorouderEnKnoppen.forEach(function(item) { item.style.color = ((item.tagName==="LI")?"#eef":"#4949a9"); }); bronCodeAchtergrondStyles.opacity=((!Wz.IEDOM)?"0.3":"0.8"); break;
    }
  },
  
  vergrootKolomEnScrollWanneerNodig: function (CVbreedte) {
    // Maak het CV eenkoloms wanneer het scherm breed (lees: scherm te plat) is
    // Zorg voor scrollfunctie en pagina-omsla-knoppen
    if(CVbreedte < 800 || (CVbreedte > 800 && Wz.schermRatio() > 1.5 && window.innerHeight < 800)) {
      this.eersteKolom.setAttribute("class","kolom eenKoloms");
      this.tweedeKolom.setAttribute("class","kolom eenKoloms");
      this.CVKop.setAttribute("class","klein");
      this.naamKop.setAttribute("class","klein");
      this.plaatsPaginaOmslaKnoppen();
      this.tweeKolommen = false;
    } else {
      this.eersteKolom.setAttribute("class","kolom");
      this.tweedeKolom.setAttribute("class","kolom");
      this.CVKop.setAttribute("class","");
      this.naamKop.setAttribute("class","");
      this.verbergPaginaOmslaKnoppen();
      this.tweeKolommen = true;
      this.CVInhoud.scrollTop = 0;
    }
  },

  toonAndereKolomWanneerNodig: function (ev) {
    if (ev.deltaY < 0 && !Wz.tweeKolommen && Wz.CVInhoud.scrollTop != 0) {
      Wz.CVInhoud.scrollTop=0;
    }
    if (ev.deltaY > 0 && !Wz.tweeKolommen && Wz.CVInhoud.scrollTop == 0) {
      Wz.CVInhoud.scrollTop=Wz.CVInhoud.clientHeight-38;
    }
  },

  reageerOpPaginaOmslaKnop: function (ev) {
    if(this.knoppen[2] == ev.target && !Wz.tweeKolommen && Wz.CVInhoud.scrollTop != 0) {
      Wz.CVInhoud.scrollTop=0;
    }
    if(this.knoppen[3] == ev.target && !Wz.tweeKolommen && Wz.CVInhoud.scrollTop == 0) {
      Wz.CVInhoud.scrollTop=Wz.CVInhoud.clientHeight-38;
    }
  }, 
  
  voegPersonaliaToe: function (kolom) {
    this.voegAlineaMetKopjeToe(kolom,"Personalia",["Geboortedatum: 28 februari 1985","Adres: Minstreelstraat 49, 2531 EB, Den Haag", "Telefoonnummer: +31 (0) 6 48888317", "Emailadres: wzuyderwyk@mac.com", "Burgerlijke staat: ongehuwd"]);
  },
  voegRegelToe: function (tekst, element) {
    var spanRef;
    if(tekst==="") { (spanRef = element.appendChild(document.createElement("span"))).appendChild(document.createTextNode(tekst)); Wz.naWitRegel = true; } else { if(!Wz.naWitRegel)element.appendChild(document.createElement("br")); element.appendChild(document.createTextNode(tekst)); Wz.naWitRegel = false; }
    if(spanRef) spanRef.setAttribute("class","witRegel");
    delete spanRef;
    // Geef terug wat je krijgt; maakt methodeketenen mogelijk
    return element;
  },

  voegAlineaMetKopjeToe: function(kolom,kopje,regels) {
    var n = this.alineas.push((kolom.appendChild(document.createElement("p"))));
    if(!this.ES3Browser) this.alineas[n-1].style.font = this.AlineaLetter();
    this.alineas[n-1].appendChild(document.createElement("b")).appendChild(document.createTextNode(kopje));
    regels.forEach(function (regel) { this.vrt(regel,this.alineas[n-1]); }, this);
    return kolom;
  },

  maakKolommen: function(ouder,aantal) {
    var kolommen = [];
    for(var i=0; i < aantal; i++) {
      kolommen[i] = ouder.appendChild(document.createElement("div"));
      kolommen[i].setAttribute("class","kolom");
    }
    return kolommen;
  },

  leegKolommen: function () {
    // Geen gebruik van this, omdat tekst mogelijk in andere env. zal worden geinterpreteerd (kan want geen argumenten)
    Wz.alineas.forEach(function(alinea) { alinea.parentNode.removeChild(alinea); });
    Wz.alineas = [];
  },

  vulKolommen: function (knopNaam,kolom1,kolom2) {
    this.voegPersonaliaToe(kolom1);
    this.haalGevuldeKolommenOp(knopNaam+".txt",kolom1,kolom2);
  },

  haalGevuldeKolommenOp: function (bestandsnaam,kolom1,kolom2) {
    var json; 
    if( (bestandsnaam === "kennisKnop.txt" && !Wz.cache[0]) || (bestandsnaam === "kundeKnop.txt" && !Wz.cache[1]) || !Wz.cacheInstellingen.gebruikCache ) {
      var xhr = new XMLHttpRequest();
      console.log("XHR: "+bestandsnaam);
      xhr.addEventListener("readystatechange",function () {
        if(xhr.readyState != 4) { return; }
        var gevuldeKolommen = JSON.parse((json = xhr.responseText));
        gevuldeKolommen[0].forEach(function (kopjeEnRegels) { Wz.voegAlineaMetKopjeToe(kolom1,kopjeEnRegels.kopje,kopjeEnRegels.regels); });
        gevuldeKolommen[1].forEach(function (kopjeEnRegels) { Wz.voegAlineaMetKopjeToe(kolom2,kopjeEnRegels.kopje,kopjeEnRegels.regels); });
        if(bestandsnaam === "kennisKnop.txt") Wz.vulCache("kennisKnop",xhr.responseText); else
        if(bestandsnaam === "kundeKnop.txt") Wz.vulCache("kundeKnop",xhr.responseText);
        try { (bestandsnaam === "kennisKnop.txt" && Wz.localStorageCache0 == false)?window.localStorage.setItem("cache0",json):(Wz.localStorageCache1 == false && window.localStorage.setItem("cache1",json)); } catch (ex) { console.log("localStorage-fout:"+ex.message); }
      });
      xhr.open("GET",bestandsnaam);
      xhr.send();
    } else {
      var gevuldeKolommen = JSON.parse((json = ((bestandsnaam === "kennisKnop.txt")?Wz.cache[0]:Wz.cache[1])));
      gevuldeKolommen[0].forEach(function (kopjeEnRegels) { Wz.voegAlineaMetKopjeToe(kolom1,kopjeEnRegels.kopje,kopjeEnRegels.regels); });
      gevuldeKolommen[1].forEach(function (kopjeEnRegels) { Wz.voegAlineaMetKopjeToe(kolom2,kopjeEnRegels.kopje,kopjeEnRegels.regels); });
    }
    return [json,kolom1,kolom2];
  },

  herpositioneerInhoud: function (isResize) {
    if(window.innerHeight > 705 || !isResize || true) {
      this.CVInhoud.style.marginTop = WzObject.floor(0.05*innerHeight)+"px";
      this.CVInhoud.style.top = "-"+(innerHeight-0.05*innerHeight-15+((Wz.tweeKolommen||Wz.schermRatio() < 0.9)?0:10))+"px";
    }
    // En verander lettergrootte wanneer van toepassing
    this.alineas.forEach(function (alinea) { alinea.style.font = Wz.AlineaLetter(); });

    // Oh ja, en zorg dat de knoppen opzij gaan bij portret-schermratio
    Wz.knoppen[0].style.left=(floor(((Wz.schermRatio()>1)?0.3:0.1)*innerHeight)-110)+"px";
    Wz.knoppen[1].style.right=(Math.floor(((Wz.schermRatio()>1)?0.3:0.1)*innerHeight)-110)+"px";
  },

  alineas: [],

  klikDiepte: 0,

  werkelijkeKlik: true,

  pasURLFragmentAan: function (knop) {
    if(knop.getAttribute("id") === "kennisKnop" && window.location.hash !== "#kennis") {
      window.location.hash = "#kennis";
      this.klikDiepte += 2;
    }
    if(knop.getAttribute("id") === "kundeKnop" && window.location.hash !== "#kennis") {
      window.location.hash = "#kunde";
      this.klikDiepte += 2;
    }
    return knop;
  },

  simuleerKlik: function () {
    if(document.createEvent && !Wz.IEDOM) { 
      if(window.location.hash === "#kennis") document.getElementById("kennisKnop").dispatchEvent(new Event("click"));
      if(window.location.hash === "#kunde") document.getElementById("kundeKnop").dispatchEvent(new Event("click"));
    } else if(document.createEventObject) {
      if(window.location.hash === "#kennis") try { console.log("Klik op kennis gesimuleerd."); document.getElementById("kennisKnop").fireEvent("onclick"); } catch (ex) { console.log(ex.message); }
      if(window.location.hash === "#kunde") try { console.log("Klik op kunde gesimuleerd."); document.getElementById("kundeKnop").fireEvent("onclick"); } catch (ex) { console.log(ex.message); }
    }
    this.werkelijkeKlik = true;
    this.aftellers[1] -= 1;
    document.getElementById("terugKnop").style.display = "block";
  },

/*************************************** Ontleder/parseerder. */
  WebKistParseer: {
    MinimaalTokenWoordgroepKlassenEnTokens: ["(-|[^-]*)",[],"","-.*",".+"],
    tokeniseerder: function(tekst, terugkoppelFunctie, expressieObject) { }
  },

  aftellers: [1,0],

  cache: [null,null],

  cacheInstellingen: { gebruikCache: false },

  vulCache: function(knopNaam,json) {
    if(knopNaam === "kennisKnop") { this.cache[0] = json; }
    if(knopNaam === "kundeKnop") { this.cache[1] = json; }
    return this.cache;
  },

  kopieerUitCache: function (knopNaam) {
      if(!Wz.CVGeladen) {
        this.cacheInstellingen.gebruikCache = false; throw { message: "Gebruiker herlaadt zelfde pagina: nieuw AJAX-verzoek; cache verversen." };
      } else {
        this.cacheInstellingen.gebruikCache = true; throw { message: "Cache, wanneer aanwezig, niet ververst."};
      }
  },

  simuleerKlikOfHerlaad: function () {
    this.klikDiepte -= 1;
    if(((window.location.hash !== "#" && window.location.hash !== "") && !(Wz.IEDOM && !Wz.werkelijkeKlik)) ) { this.aftellers[1] = 1; this.werkelijkeKlik = false; this.simuleerKlik(); }
    else { if(!Wz.IEDOM) { window.location.hash = "#"; this.aftellers[0] -= 1; if(this.aftellers[0]) window.location.reload(); } else { window.location.hash = "#"; window.location.reload(); } }
  },

  klikOpNavigatieKnop: function (knop) {
    console.log("Navigatie-knop geklikt.");
    if(!Wz.IEDOM)Wz.knoppen[2].dispatchEvent(new Event("click")); else Wz.CVInhoud.scrollTop = 0;
    if(((window.location.hash!=="#kennis" && knop.getAttribute("id") === "kennisKnop") || 
      (window.location.hash!=="#kunde" && knop.getAttribute("id") === "kundeKnop") || 
      !Wz.werkelijkeKlik ) && Wz.aftellers[1]) {
          Wz.aftellers[1] = 1; Wz.leegKolommen(); try{
          Wz.kopieerUitCache(knop.getAttribute("id"));
        } catch(ex) {
          console.log(ex.message); Wz.vulKolommen(knop.getAttribute("id"),Wz.eersteKolom,Wz.tweedeKolom);
        }
    } if(Wz.werkelijkeKlik) { Wz.aftellers[1] -= 1; if(knop.getAttribute("id") === "kennisKnop") window.location.hash = "#kennis";
    if(knop.getAttribute("id") === "kundeKnop") window.location.hash = "#kunde"; } else Wz.werkelijkeKlik = true;
  }
    
}


// Verwijzing naar Wzuyderwyk
Wz = Wzuyderwyk;

// Kopie
WzObject = function() {};
WzObject.prototype = Wzuyderwyk;
WzObject = new WzObject();

// Zulke "macro's" als hieronder horen eigenlijk niet in uiteindelijke code thuis; gebruik van een echte preprocessor is beter/efficienter/duidelijker
// while(mogelijkheden(C) < mogelijkheden(JavaScript)) wietse = teleurgesteld; ;-)
Wz.vrt = Wz.voegRegelToe;


Wz.nietLatenteFuncties = {};

try { document.documentElement.childNodes[2].style.backgroundColor="#cb4"; } catch(e) { Wz.IEDOM = true; document.documentElement.childNodes[1].style.backgroundColor="#cb4"; }

}).apply(Wz,[true]);


(function (inGebruik) {
if(!inGebruik) return;


// Laat zien dat ik wat weet over DOM-traversal, de standaard DOM interface/API en #text-nodes tussen de elementen
// Referentie: w3.org/TR/DOM-Level-3-Core
// getElementsByTagName had gebruikt kunnen worden in plaats van de ID tekst, maar maakt onderhoud alleen maar lastiger
// Expliciete IDs zou in meer gevallen robuuster zijn, maar ter illustratie van DOM-traversal is dit goed zo
// En bij JS-gegenereerde nodes natuurlijk ook overbodig; programma's hebben variabelen! Die hier expres ook niet zijn gebruikt.
/* for(var i=0; i<document.documentElement.childNodes[2].childNodes.length; i++) { document.getElementById("tekst").childNodes[0].nodeValue+=document.documentElement.childNodes[2].childNodes[i].nodeName; }
document.getElementById("tekst").childNodes[0].nodeValue = document.documentElement.childNodes[2].childNodes[3].childNodes[0].nodeValue; */

// Werkt niet; logische fout! Pagina wordt in 1x geparseerd in de DOM en de JS in objecten; wijzigingen in de tekst maken geen verschil.
// document.documentElement.childNodes[2].childNodes[3].childNodes[0].nodeValue = "Wzuyderwyk.hi = function() { alert(\"Hi!\"); }";

// Werkt ook niet! WzObject is een kopie van, niet een verwijzing naar, Wzuyderwyk.
WzObject.hi = function(ev) { WzObject.plaatsInfoInTekstElement("Alt ingedrukt?"+((ev.altKey)?" JA!":" Mis!")); };

// Efficienter zou eigenlijk zijn om een Boolean variabele te gebruiken om te testen of er wel iets is veranderd sinds te laatste MouseEvent dispatch, maar functie is klein
Wzuyderwyk.hi = function (ev) { Wzuyderwyk.plaatsInfoInTekstElement("Control ingedrukt?"+((ev.ctrlKey)?" JA!":" Mis!")); };

}).apply(Wz,[]);

(Wz.nietLatenteFuncties.positioneerCVNavigatieKnoppenEnURLFragmentGebeurtenisBehandelAttribuut = function (inGebruik) {
if(!inGebruik) return;

// Of met de with statement, maar beter van niet; mag niet gebruikt worden bij "use strict"
with (Wz) { hi = function(ev) { plaatsInfoInTekstElement("Welkom. Klik op Kennis of Kunde. Wanneer u slechts een enkele kolom ziet dan kunt u een pagina verder met de knoppen 1/2 en 2/2. Veel leesplezier."); }; }

// Snel al is die "Control ingedrukt?" tekst een beetje teveel
window.setTimeout(function() { Wz.hi = function() {}; document.getElementById("tekst").style.height = "0px"; setTimeout(function() { document.getElementById("tekst").removeChild(document.getElementById("tekst").childNodes[0]); },2000); },12000,[]);
// Of gewoon: setTimeout; window is global environment

WzObject.floor = Math.floor;
window.floor = WzObject.floor;
document.getElementById("CV").style.marginTop = WzObject.floor(0.05*innerHeight)+"px";

// Baseer font-size mede op schermratio, zodat lettertypes niet te groot zijn op breedbeeldschermen; daar zijn picapunten relatief groot
Wz.schermRatio = function () { return window.innerWidth / window.innerHeight; };

// Bij 800x600 past 1 kolom (gaat automatisch) er net op (met, automatische, verkleinde letter)
Wz.AlineaLetter = function () { return ((Wz.schermRatio() > 1.5 && window.innerHeight < 800) || (Wz.schermRatio() < 1 && Wz.schermRatio() > 0.87) || (window.innerHeight < 600 && Wz.schermRatio < 1.3))?"normal 10pt/13pt adobeSourceSansLight, Helvetica, Arial, sans serif":((Wz.tweeKolommen)?"normal 11.5pt/14pt adobeSourceSansLight, Helvetica, Arial, sans serif":"normal 10.5pt/12pt adobeSourceSansLight, Helvetica, Arial, sans serif"); };
Wz.alineas.forEach(function (alinea) { alinea.style.font = Wz.AlineaLetter(); });

// Positioneer knoppen aan zijden CV

Wzuyderwyk.knoppen = [document.getElementById("kennisKnop"),document.getElementById("kundeKnop")];
for(var knop in Wz.knoppen) {
Wz.knoppen[knop].style.top=(Math.floor(0.5*innerHeight)-100)+"px";
}

Wz.knoppen[0].style.left=(floor(((Wz.schermRatio()<1)?0.3:0.1)*innerHeight)-110)+"px";
Wz.knoppen[1].style.right=(Math.floor(((Wz.schermRatio()<1)?0.3:0.1)*innerHeight)-110)+"px";



// NAVIGATIE
Wz.knoppen.forEach(function (knop) { knop.addEventListener("click",function (ev) { if(!Wz.IEDOM)Wz.klikOpNavigatieKnop(knop); },false); });

if(Wz.IEDOM)Wz.knoppen.forEach(function (knop) { knop.setAttribute("onclick","if(Wz.IEDOM) { Wz.klikOpNavigatieKnop(document.getElementById('"+knop.getAttribute("id")+"')); }"); });

if(Wz.IEDOM)document.querySelector("body").setAttribute("onhashchange","Wz.simuleerKlikOfHerlaad();");

}).apply(Wz,[]);


(Wz.nietLatenteFuncties.maakTweeKolommen = function (inGebruik) {
if(!inGebruik) return;

Wz.CVInhoud = document.getElementById("CVInhoud");
if(!this.ES3Browser)Wz.herpositioneerInhoud(false);
(Wz.CVKop = Wz.CVInhoud.appendChild(document.createElement("h1"))).appendChild(document.createTextNode("Curriculum Vitae"));
(Wz.naamKop = Wz.CVInhoud.appendChild(document.createElement("h2"))).appendChild(document.createTextNode("Wietse Zuyderwyk"));

Wz.kolommen = Wz.maakKolommen(Wz.CVInhoud,2);

Wz.eersteKolom = Wz.kolommen[0];

Wz.tweedeKolom = Wz.kolommen[1];


}).apply(Wz,[]);


(Wz.nietLatenteFuncties.plaatsMotivatie = function (inGebruik) {
if(!inGebruik) return;

// Eerste tekst (rest gaat via AJAX)



// Mijn grenzeloze motivatie!
Wz.voegAlineaMetKopjeToe(Wz.eersteKolom,"Motivatie",["Sinds zeker tien jaar ben ik bezig met het bijhouden van de standaarden en het testen van de UA/browser (en server) implementaties van, het WWW.",
"Ik was dan ook verheugd met de komst van de WHATWG en WebKit (vandaar: webkist.nl) en ben benieuwd naar de levensvatbaarheid van Firefox OS.",
"Ik ben in die jaren nooit zo gemotiveerd geweest om voor het Web te ontwikkelen nu het post-PC tijdperk, en de (tot voor kort) gedeelde layout engine van de twee grootste spelers daarin, zorgt \
voor een betere standaardisering van alle browsers en het vuurtje achter innovatie en implementatie van huidige bijna-standaarden flink opstookt.","",
"Mijn voornaamste motivatie om helemaal te gaan voor Web-ontwikkeling is om te kunnen laten zien dat een gratis en open (vrije) dienst voor net zo een goede gebruikservaring (voor gebruikers maar\
 ook ontwikkelaars) garant kan staan als het meest gecontroleerde, \"native\" platform.","","Kunt u mij, en ik u, met zoiets helpen?"]);


// Meer persoonlijk...
Wz.voegPersonaliaToe(Wz.tweedeKolom);
Wz.voegAlineaMetKopjeToe(Wz.tweedeKolom,"Karakterkenmerken en algemene competenties",["Mijn meest voorname positieve eigenschappen zijn:","creativiteit, doorzettingsvermogen,\
 nieuwsgierigheid / interesse / motiveerbaarheid, oprechtheid en relativeringsvermogen / pragmatisme / bescheidenheid m.b.t. de eigen zienswijze maar ook kritische blik op die van anderen, met gepaste bescheidenheid."]);

Wz.voegAlineaMetKopjeToe(Wz.tweedeKolom,"Wietse_Zuyderwyk =",["function ( goed_advies , voorwaarden , beperkingen ) { try { this.leer( goed_advies ); perfectie( voorwaarden , beperkingen ); } catch ( ex ) { this.wees_creatief(); this.try_again(); } };"]);


// Een bescheiden ideaal...
Wz.voegAlineaMetKopjeToe(Wz.eersteKolom,"Mijn ideale werkgever",["Een team dat mij deel maakt van een interessante missie, een goed doel; dat iets waardevols wil toevoegen. Een team waarin ieder hoopt terug te kijken op de werkzame jaren en ziet dat hun werk voor mensen een positief verschil heeft gemaakt in hun ervaring van de wereld, \
hoe bescheiden misschien ook.","","Ik hoop dat bij u te kunnen vinden."]);

})();

(Wz.nietLatenteFuncties.plaatsOmslaKnoppenEnLaadLokaleOpslag = function (inGebruik) {
if(!inGebruik) return;

Wz.knoppen = Wz.knoppen.concat([document.getElementById("scrollNaarBovenKnop"),document.getElementById("scrollNaarBenedenKnop")]);
Wz.knoppen[2].addEventListener("click", function(ev) { Wz.reageerOpPaginaOmslaKnop(ev); });
Wz.knoppen[3].addEventListener("click", function(ev) { Wz.reageerOpPaginaOmslaKnop(ev); });

// positioneer knoppen
Wz.plaatsPaginaOmslaKnoppen = function () {
  Wz.knoppen[2].style.display = "block"; Wz.knoppen[2].style.top = "-15px"; Wz.knoppen[2].style.left = (Math.floor(Wz.knoppen[3].parentNode.offsetWidth*0.5)-30)+"px";
  Wz.knoppen[3].style.display = "block"; Wz.knoppen[3].style.bottom = "5px"; Wz.knoppen[3].style.left = (Math.floor(Wz.knoppen[3].parentNode.offsetWidth*0.5)-30)+"px"; 
  return [this.knoppen[2],this.knoppen[3]];
}

Wz.verbergPaginaOmslaKnoppen = function () {
    Wz.knoppen[2].style.display = "none";
    Wz.knoppen[3].style.display = "none";
}

// Door overgang moet de eerste kolom worden rechtgezet na overgang (in sommige gevallen)
// Had ook met .transitioned gekund, maar dit werkt minstens net zo goed
window.setTimeout(function() { if(!Wz.IEDOM)Wz.knoppen[2].dispatchEvent(new Event("click")); },1000);


// Vul het "live"-cache met het offline cache, wanneer aanwezig

try {
  if(!(window.localStorage.getItem("cache0"))) Wz.localStorageCache0 = false; else { Wz.cache[0] = window.localStorage.getItem("cache0"); Wz.localStorageCache0 = true; console.log("Kennis uit offline cache."); }
  if(!(window.localStorage.getItem("cache1"))) Wz.localStorageCache1 = false; else { Wz.cache[1] = window.localStorage.getItem("cache1"); Wz.localStorageCache1 = true; console.log("Kunde uit offline cache."); }
} catch (ex) {
  console.log(ex.message);
}

Wz.cacheInstellingen.gebruikCache = true;

window.setTimeout(function(){ Wz.CVGeladen = true; },2000);

})();

(Wz.nietLatenteFuncties.zetInstellingenAan = function (inGebruik) {
if(!inGebruik) return;

// Pas instelling aan. Closures && functie instanceof object!
(Wz.pasInstellingAan("gebruikMuisBewegingsKleurOvergang", true))("gebruikVensterDimensiesAanpassing", true);
(Wz.pasInstellingAan("gebruikMuisWielEenkolomsPaginaOmslag", true))("gebruikURLFragmentInhoudAanpassing", true);
Wz.pasInstellingAan("gebruikPaginaGeladenDirecteAanpassing",true);

// Pas instellingen toe; koppel gebeurtenisbehandelaars. Eenmalig; wijzigingen in instellingen zijn direct.
Wz.pasInstellingenToe();

}).apply(Wz,[]);

(Wz.nietLatenteFuncties.kopieerScreenCSS = function (inGebruik) {
if(!inGebruik) return;

Wz.screenCSSTekst = document.styleSheets[0].ownerNode.textContent;

}).apply(Wz,[]);

// Stylesheet voor print.

(Wz.nietLatenteFuncties.printStyleSheet = Wz.printStyleSheet = function (inGebruik,moetWordenToegepast) {
if(!inGebruik) return;


if(!this.ES3Browser)this.pasInstellingAan("gebruikMuisBewegingsKleurOvergang",!moetWordenToegepast);
if(!this.ES3Browser)this.pasInstellingAan("gebruikPaginaGeladenDirecteAanpassing",!moetWordenToegepast);

var printCSS = function(alleenPrint) { return "\
@media "+((alleenPrint)?"print":"print, screen")+" {\
" + ((this.IE!=7)?"@font-face {\
  font-family: api;\
  font-weight: bold;\
  src: url(apibold.ttf);\
}\
":"")+"\
* { background-color: white; color: black !important; }\
body { width: 200mm; margin-left: auto; margin-right: auto; background-color: white !important; }\
.startVerborgen, li, #terugKnop, #CV, #tekst, #bronCodeAchtergrond { display: none !important; }\
#CV, #CVInhoud, p { font: normal 11pt/15pt Palatino, Garamond, serif !important; letter-spacing: 0.4pt; }\
b { font: bold 12.5pt/10pt Helvetica, Arial, sans serif; opacity: 0.7; letter-spacing: -0.2pt; }\
p > .witRegel { display: block; height: 2mm; }\
p { margin: 4mm; margin-left: 1.25cm; }\
h1 { font: bold 46pt" + ((this.IE!=7)?"/50pt api, ":"/60pt ") + "Garamond, serif; margin-left: 0; margin-top: " + ((Wz.IE === 7)?"-2mm;":"-4mm;") + " text-align: center; }\
h2 { font: 100 32pt/18pt Helvetica, Arial, sans serif; margin-left: 0; margin-top: -10mm; text-align: center; " + ((Wz.IE === 7)?"margin-top: -5mm;":"") + "}\
}\
"; };

if(moetWordenToegepast) {

  try{ 
    document.styleSheets[0].ownerNode.textContent = "";
    document.styleSheets[1].ownerNode.textContent += printCSS(false);
  } catch (ex) {
    if(document.styleSheets[0].owningElement)document.styleSheets[0].owningElement.parentNode.removeChild(document.styleSheets[0].owningElement);
    if(this.ES3Browser)document.styleSheets[0].cssText += printCSS(false);
  }

  this.print = true;
} else {
  document.styleSheets[1].ownerNode.textContent = printCSS(true);
  document.styleSheets[0].ownerNode.textContent = this.screenCSSTekst;
  this.print = false;
}

}).apply(Wz,[]);

(Wz.nietLatenteFuncties.plaatsTerugKnop = function(inGebruik) {
  if(!inGebruik) return;

  var terugKnop;
  var dimensiesMetKleineLetter;
  var kleuren = ["rgba(255,255,255,0.2)","rgba(255,255,255,0.4)","white","white"];
  (terugKnop = document.querySelector("#terugKnop")).style.position = "fixed";
  terugKnop.style.bottom = Math.floor(0.008 * window.innerHeight) + "px"; terugKnop.style.right = Math.floor(0.005 * window.innerWidth) + "px";
  // Ervan uitgaande dat de kleine letter ongeveer 5 pixels breed was, en 2 pixels voor de beleving/het oog
  dimensiesMetKleineLetter = terugKnop.clientHeight - (5 + 2);
  terugKnop.style.height = "auto";
  terugKnop.style.fontSize = "24pt"; terugKnop.style.lineHeight = "30pt"; terugKnop.style.fontWeight = "bold";
  terugKnop.style.paddingLeft = Math.floor(((terugKnop.clientHeight - dimensiesMetKleineLetter) / 2) - (dimensiesMetKleineLetter / 2))+"px";
  terugKnop.style.width = (terugKnop.clientHeight - (((terugKnop.clientHeight - dimensiesMetKleineLetter) / 2) - (dimensiesMetKleineLetter / 2)) )+"px";
  terugKnop.style.paddingLeft = parseInt(terugKnop.style.paddingRight = Math.floor(parseInt(terugKnop.style.paddingLeft) / 2) - 5 + "px") + 10 + "px";
  terugKnop.style.display = "none";
  terugKnop.style.border = "4px solid " + kleuren[0];
  terugKnop.style.borderRadius = "50%";
  terugKnop.style.color = kleuren[1];
  terugKnop.style.transition = "border 300ms, color 500ms";
  terugKnop.style.MozTransition = "border 300ms, color 500ms";
  terugKnop.style.webkitTransition = "border 300ms, color 500ms";

  terugKnop.addEventListener("mouseover",function (ev) { ev.target.style.cursor = "pointer"; ev.target.style.color = kleuren[2]; ev.target.style.border = "7px solid " + kleuren[3]; },true);
  terugKnop.addEventListener("mouseout",function (ev) { ev.target.style.cursor = "auto"; ev.target.style.color; ev.target.style.color = kleuren[1]; ev.target.style.border = "4px solid " + kleuren[0]; },true);

  terugKnop.addEventListener("click",function (ev) { window.history.go(-1); }, true);
  

}).apply(Wz,[]);


(Wz.nietLatenteFuncties.pasBrowserSpecifiekeCodeToe = function (inGebruik) {
if(!inGebruik) return;

/*************************************** Veel wat browserspecifiek is. */


// IE<10 doet niks met de gradienten (zou wel kunnen met IE-specifieke transformaties), dus mag broncode-achergrond wat ondoorzichtiger achtergrond hebben
// Zelfde voor oudere browsers

var appVersie = parseInt(((Wz.navigatorObject = window.navigator).userAgent).split("/")[3]);

if(!this.IEDOM && appVersie<=5 /* Zet versie op Safari versie 5, want Firefox begon bij versie 3 */) document.getElementById("bronCodeAchtergrond").style.backgroundColor="#555"; else

if(this.IEDOM) {
  var bca;
  (bca = document.getElementById("bronCodeAchtergrond").style).backgroundColor="#666"; bca.color="#777"; bca.top="-80px"; bca.left="-40px"; bca.paddingRight="10px"; delete bca;  // Toepasselijke achtergrondkleur voor een MSIE-tweak
}

// IE-specifiek, door logica in kliksimuleer-functie: IE vuurt eenmaal, de rest tweemaal, bij hashchange-event en een klik
if(this.IEDOM) this.aftellers[1] = 1;


}).apply(Wz,[]);

try{
  var CV = Object.defineProperties(function(gebruikDirectKleurOvergang) { console.log("CV-constructor aangeroepen."); if(gebruikDirectKleurOvergang) console.log("Gebruik van muisgestuurde kleurovergang."); var nietLatenteFuncties; var nieuwObject; Object.keys((nietLatenteFuncties = (nieuwObject = this).nietLatenteFuncties)).forEach(function(property) { Object.getOwnPropertyDescriptor(nietLatenteFuncties, property).value.apply(nieuwObject,[true]); }); this.pasInstellingAan("gebruikMuisBewegingsKleurOvergang", gebruikDirectKleurOvergang); }, { prototype: { value: Wz } });
} catch (ex) {
  var CV = function() {
    Array.prototype.forEach = function (behandelFunctie,thisArgument) { for(var i = 0; i < this.length; i++) { behandelFunctie.apply(thisArgument,[(this[i])]); } };
    
    console.log("Oude browser."); Wz.ES3Browser = true;
    Wzuyderwyk.printStyleSheet.apply(Wz,[true,true]);
    Wz.nietLatenteFuncties.maakTweeKolommen.apply(Wz,[true]);
    Wz.nietLatenteFuncties.plaatsMotivatie.apply(Wz,[true]);
  };
};


