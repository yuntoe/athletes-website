// Simulated data for now – we'll later fetch this from Supabase
const competitionEvents = {
  0: [ // National Schools
    { event: "100m", ageGroup: "U18", round: "Preliminary" },
    { event: "200m", ageGroup: "U18", round: "Final" },
    { event: "4x100m Relay", ageGroup: "U20", round: "Final" }
  ],
  1: [ // IVP
    { event: "100m", ageGroup: "Senior", round: "Heats" },
    { event: "100m", ageGroup: "Senior", round: "Final" },
    { event: "400m", ageGroup: "Senior", round: "Final" }
  ],
  2: [ // Singapore Open
    { event: "Long Jump", ageGroup: "U20", round: "Final" },
    { event: "Triple Jump", ageGroup: "Senior", round: "Final" }
  ]
};

const compNames = {
  0: "National Schools Championships",
  1: "IVP Track & Field Series",
  2: "Singapore Open"
};

const urlParams = new URLSearchParams(window.location.search);
const compId = parseInt(urlParams.get("id"));
const eventList = competitionEvents[compId] || [];
const tableBody = document.querySelector("#eventsTable tbody");
const compNameHeading = document.getElementById("compName");

compNameHeading.textContent = compNames[compId] || "Competition Details";
renderEventList(eventList);

function renderEventList(events) {
  tableBody.innerHTML = "";
  if (events.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3">No events found.</td></tr>`;
    return;
  }

  events.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.event}</td>
      <td>${e.ageGroup}</td>
      <td>${e.round}</td>
    `;
    tableBody.appendChild(row);
  });
}
