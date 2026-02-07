const form = document.getElementById("plannerForm");
const lijst = document.getElementById("planningLijst");

// Haal opgeslagen planning op uit LocalStorage
let savedData = JSON.parse(localStorage.getItem("plannerData")) || [];

// Functie om de lijst weer te geven
function toonLijst() {
  lijst.innerHTML = ''; // Maak de lijst leeg
  savedData.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.naam} - ${item.uren} uur`;
    lijst.appendChild(li);
  });
}

// Wanneer het formulier wordt verzonden
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const naam = document.getElementById("naam").value;
  const uren = document.getElementById("uren").value;

  if (naam && uren) {
    // Voeg de nieuwe gegevens toe aan de array
    savedData.push({ naam, uren });

    // Sla de gegevens op in LocalStorage
    localStorage.setItem("plannerData", JSON.stringify(savedData));

    // Toon de bijgewerkte lijst
    toonLijst();

    // Reset het formulier
    form.reset();
  } else {
    alert("Vul zowel naam als uren in!");
  }
});

// Toon de lijst bij het laden van de pagina
toonLijst();
