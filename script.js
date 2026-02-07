const form = document.getElementById("plannerForm");
const lijst = document.getElementById("planningLijst");
const capaciteitOverzicht = document.getElementById("capaciteitOverzicht");

// Dit zal alle ingevoerde gegevens opslaan
let medewerkersData = JSON.parse(localStorage.getItem("medewerkersData")) || [];

// Functie om de lijst met medewerkers en taken weer te geven, per afdeling
function toonLijst() {
  lijst.innerHTML = ''; // Maak de lijst leeg

  // Groepeer medewerkers per afdeling
  const afdelingen = medewerkersData.reduce((acc, item) => {
    if (!acc[item.afdeling]) {
      acc[item.afdeling] = [];
    }
    acc[item.afdeling].push(item);
    return acc;
  }, {});

  // Toon per afdeling
  Object.keys(afdelingen).forEach(afdeling => {
    const afdelingHeader = document.createElement("h3");
    afdelingHeader.textContent = afdeling;
    lijst.appendChild(afdelingHeader);

    afdelingen[afdeling].forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.naam} werkt ${item.uren} uur aan ${item.taak}`;

      // Verwijder-knop toevoegen
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Verwijderen";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => verwijderMedewerker(item));
      
      li.appendChild(deleteButton);
      lijst.appendChild(li);
    });
  });

  // Bereken de capaciteit
  berekenCapaciteit();
}

// Capaciteit berekenen en tonen
function berekenCapaciteit() {
  const beschikbareUrenPerDag = 8;
  let totaalUren = 0;

  medewerkersData.forEach(item => {
    totaalUren += item.uren;
  });

  const capaciteit = beschikbareUrenPerDag * medewerkersData.length;
  const verschil = capaciteit - totaalUren;

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

// Functie om medewerker te verwijderen
function verwijderMedewerker(medewerker) {
  medewerkersData = medewerkersData.filter(item => item !== medewerker);
  localStorage.setItem("medewerkersData", JSON.stringify(medewerkersData));
  toonLijst(); // Bijwerken van de lijst
}

// Wanneer het formulier wordt verzonden
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const naam = document.getElementById("naam").value;
  const afdeling = document.getElementById("afdeling").value;
  const taak = document.getElementById("taak").value;
  const uren = parseInt(document.getElementById("uren").value);

  if (naam && afdeling && taak && uren) {
    medewerkersData.push({ naam, afdeling, taak, uren });

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
