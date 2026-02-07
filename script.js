const form = document.getElementById("plannerForm");
const lijst = document.getElementById("planningLijst");
const capaciteitOverzicht = document.getElementById("capaciteitOverzicht");

// Dit zal alle ingevoerde gegevens opslaan
let medewerkersData = JSON.parse(localStorage.getItem("medewerkersData")) || [];

// Functie om de lijst met medewerkers en taken weer te geven
function toonLijst() {
  lijst.innerHTML = ''; // Maak de lijst leeg
  medewerkersData.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.naam} werkt ${item.uren} uur aan ${item.taak}`;
    lijst.appendChild(li);
  });

  // Bereken de capaciteit
  berekenCapaciteit();
}

// Capaciteit berekenen en tonen
function berekenCapaciteit() {
  // Stel dat iedere medewerker 8 uur per dag werkt
  const beschikbareUrenPerDag = 8;
  let totaalUren = 0;

  // Loop door alle medewerkers en tel de uren op
  medewerkersData.forEach(item => {
    totaalUren += item.uren;
  });

  // Bereken hoeveel uur er te veel of te kort is
  const capaciteit = beschikbareUrenPerDag * medewerkersData.length;
  const verschil = capaciteit - totaalUren;

  // Toon het overzicht
  let status = '';
  if (verschil > 0) {
    status = `Er is nog ${verschil} uur beschikbaar.`;
  } else if (verschil < 0) {
    status = `Er is ${Math.abs(verschil)} uur te veel ingepland.`;
  } else {
    status = 'De uren zijn perfect verdeeld!';
  }

  capaciteitOverzicht.textContent = `Totaal ingeplande uren: ${totaalUren} uur. ${status}`;
}

// Wanneer het formulier wordt verzonden
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const naam = document.getElementById("naam").value;
  const taak = document.getElementById("taak").value;
  const uren = parseInt(document.getElementById("uren").value);

  if (naam && taak && uren) {
    // Voeg de nieuwe gegevens toe aan de array
    medewerkersData.push({ naam, taak, uren });

    // Sla de gegevens op in LocalStorage
    localStorage.setItem("medewerkersData", JSON.stringify(medewerkersData));

    // Toon de bijgewerkte lijst
    toonLijst();

    // Reset het formulier
    form.reset();
  } else {
    alert("Vul alle velden in!");
  }
});

// Toon de lijst bij het laden van de pagina
toonLijst();
