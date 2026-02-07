const form = document.getElementById("plannerForm");
const lijst = document.getElementById("planningLijst");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const naam = document.getElementById("naam").value;
  const uren = document.getElementById("uren").value;

  const li = document.createElement("li");
  li.textContent = `${naam} - ${uren} uur`;
  lijst.appendChild(li);

  form.reset();
});
