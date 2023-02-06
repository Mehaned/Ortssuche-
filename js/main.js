"use strict";

// console.log("main.js wurde geladen");

const API_PATH = "http://api.geonames.org/postalCodeLookupJSON";
const API_PARAMS = "?country=AT&username=wifiwien&postalcode="; // Reihenfolge der Parameter ist egal

const API_URL = API_PATH + API_PARAMS;

window.onload = function() {
    const   input = document.getElementById("inp_plz");
    const   select = document.getElementById("sel_stadt");
    
    input.oninput = function() {
        // Einlesen
        const plz = input.value.trim();

        // Validieren (österr. PLZ haben exakt 4 Ziffern)
        if(plz.length !== 4) {
            return;
        }

        // Validiere auf Konvertierbarkeit in numerischen Wert
        // Falls nicht: User Feedback und Ausstieg aus der Funktion

        const plzInt = parseInt(plz);
        if (isNaN(plzInt) && !Number.isInteger(plzInt)) {
            prompt("Bitte geben Sie eine gültige Postleitzahl mit 4 Ziffern ein");
            return;
        }
       
        // Verarbeiten
        // Sende XHR-Request an die Web API
        
        const xhr = new XMLHttpRequest();

        xhr.onload = function() {
            const response = JSON.parse(xhr.response);
            let option = "";
            response.postalcodes.forEach(function(e) {
                option += `<option value="${e.placeName}">${e.placeName}</option>`;
            })
            select.innerHTML = option;
        }

        xhr.open("GET", API_URL + plz);
        xhr.send();

        // Ausgabe
        // Erfolgt bei Einlangen des HTTP Response von der Web API -> Eventhandler onload
        // Dann: 
        // Parsen des JSON-Strings (response)
        // Zugriff auf das Array (Objekteigenschaft "postalCode")
        // Auslesen der einzelnen Objekte des Arrays
        // Zuweisung eines neuen <option>-Tags als Kindelement von <select> (siehe Vorlage in HTML)
        // Zuweisung der Objekteigenschaft "placeName" als value-Attribut UND als Tag-Inhalt des <option>-Elements
    }

    ////////////////////////////////////////////////////
    //////// Wikipedia Einträge anzeigen lassen ////////
    ////////////////////////////////////////////////////

    let btnWiki = document.getElementById("btnWiki");
    const WIKI_API_PATH = "http://api.geonames.org/findNearbyWikipediaJSON?";
    const WIKI_API_PARAMS ="radius=20&lang=de&username=wifiwien&&maxRows=20&postalcode=";

    const WIKI_API_URL = WIKI_API_PATH + WIKI_API_PARAMS;

    btnWiki.onclick = function() {
        const xhr = new XMLHttpRequest;
        const plz = input.value.trim();
        let anzeigeWikiEintraege = document.getElementById("wikiEintraege");
        
        xhr.onload = function() {
            const response = JSON.parse(xhr.response);
            console.log(response);
            let entries ="";
            response.geonames.forEach(function(e) {
                entries += `<h3>${e.title}</h3><p>${e.summary}</p>`+
                `<a target="_blank" href="https://${e.wikipediaUrl}">Wikipedia-Eintrag zu ${e.title}</a>`;
                anzeigeWikiEintraege.innerHTML = entries;
            })
        }
        xhr.open("GET", WIKI_API_URL + plz);
        xhr.send();
    }
}
