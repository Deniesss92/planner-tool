const form = document.getElementById("plannerForm");
const lijst = document.getElementById("planningLijst");
const capaciteitOverzicht = document.getElementById("capaciteitOverzicht");
const ctx = document.getElementById("capaciteitGrafiek").getContext("2d");

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

      // Kleurcodering: te veel uren in het rood, te weinig in het groen
      if (item.uren > 8) {
        li.style.backgroundColor = "#f44336"; // Rood
      } else if (item.uren < 8) {
        li.style.backgroundColor = "#8BC34A"; // Groen
      } else {
        li.style.backgroundColor = "#FFEB3B"; // Geel voor exact 8 uur
      }

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

  // Toon de grafiek
  toonGrafiek(afdelingen);
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

// Functie om de grafiek te tonen
function toonGrafiek(afdelingen) {
  const labels = Object.keys(afdelingen); // Afdelingen
  const data = labels.map(afdeling => {
    return afdelingen[afdeling].reduce((totaal, item) => totaal + item.uren, 0); // Totaal uren per afdeling
  });

  const grafiek = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, // Afdelingsnamen
      datasets: [{
        label: 'Totaal ingeplande uren per afdeling',
        data: data,
        backgroundColor: '#4CAF50', // Groene balken
        borderColor: '#388E3C',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
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
