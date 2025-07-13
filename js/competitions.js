// Temporary mock data
const competitions = [
  {
    id: 0,
    name: "National Schools Championships",
    startDate: "2024-03-12",
    endDate: "2024-04-01"
  },
  {
    id: 1,
    name: "IVP Track & Field Series",
    startDate: "2025-01-10",
    endDate: "2025-01-20"
  },
  {
    id: 2,
    name: "Singapore Open",
    startDate: "2023-07-01",
    endDate: "2023-07-02"
  }
];

const tableBody = document.querySelector("#competitionsTable tbody");

function renderCompetitions() {
  tableBody.innerHTML = "";
  competitions.forEach(comp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="competition-details.html?id=${comp.id}">${comp.name}</a></td>
      <td>${formatDate(comp.startDate)} – ${formatDate(comp.endDate)}</td>
    `;
    tableBody.appendChild(row);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

renderCompetitions();
