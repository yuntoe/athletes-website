// Sample dataset – eventually this will come from Supabase
const athleteData = [
  {
    name: "Alice Tan",
    yearOfBirth: 2006,
    gender: "Female",
    results: [
      { event: "100m", result: "12.00s", wind: "+1.9", competition: "National U18", year: 2025 },
      { event: "100m", result: "11.92s", wind: "+2.5", competition: "Singapore Open", year: 2025 },
      { event: "100m", result: "12.11s", wind: "+0.5", competition: "IVP", year: 2024 },
      { event: "200m", result: "25.50s", wind: "+1.8", competition: "IVP", year: 2025 },
      { event: "200m", result: "25.20s", wind: "+2.3", competition: "Singapore Open", year: 2025 },
      { event: "Long Jump", result: "5.45m", wind: "+1.5", competition: "Youth Games", year: 2023 }
    ]
  }
];

const windSensitiveEvents = ["100m", "200m", "100m Hurdles", "110m Hurdles", "Long Jump", "Triple Jump"];

const urlParams = new URLSearchParams(window.location.search);
const athleteId = parseInt(urlParams.get("id"));
const athlete = athleteData[athleteId];

if (athlete) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - athlete.yearOfBirth;
  const ageGroup = age < 18 ? "U18" : age < 20 ? "U20" : "Senior";

  document.getElementById("athleteName").textContent = athlete.name;
  document.getElementById("athleteAge").textContent = age;
  document.getElementById("athleteGender").textContent = athlete.gender;
  document.getElementById("athleteAgeGroup").textContent = ageGroup;

  renderResults("pbTable", getBestResults(athlete.results, true));
  renderResults("sbTable", getBestResults(athlete.results.filter(r => r.year === currentYear), true));
  renderResults("allResultsTable", athlete.results, false);
}

// Returns best legal result per event
function getBestResults(results, enforceWindLegal) {
  const bestByEvent = {};

  results.forEach(r => {
    const windVal = parseFloat(r.wind);
    const isLegal = !windSensitiveEvents.includes(r.event) || windVal <= 2.0;

    if (enforceWindLegal && !isLegal) return;

    if (!bestByEvent[r.event] || r.result < bestByEvent[r.event].result) {
      bestByEvent[r.event] = r;
    }
  });

  return Object.values(bestByEvent);
}

// Render a result table
function renderResults(tableId, results, enforceWind = false) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = "";

  if (!results.length) {
    tableBody.innerHTML = `<tr><td colspan="3">No results available.</td></tr>`;
    return;
  }

  results.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.event}</td>
      <td>${r.result} (${r.wind} m/s)</td>
      <td>${r.competition}</td>
    `;
    tableBody.appendChild(row);
  });
}
