// Sample athlete data — using yearOfBirth now
const athletes = [
  { name: "Alice Tan", yearOfBirth: 2006, gender: "Female" },
  { name: "Benjamin Lee", yearOfBirth: 2003, gender: "Male" },
  { name: "Cassandra Ng", yearOfBirth: 2007, gender: "Female" },
  { name: "Daniel Wong", yearOfBirth: 2004, gender: "Male" },
  { name: "Evelyn Koh", yearOfBirth: 2002, gender: "Female" }
];

const tableBody = document.querySelector("#athleteTable tbody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function calculateAge(yearOfBirth) {
  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
}

function renderTable(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3">No athletes found.</td></tr>`;
    return;
  }
  data.forEach((athlete, index) => {
    const age = calculateAge(athlete.yearOfBirth);
    const row = document.createElement("tr");

    // Add clickable link (simulate ID with index for now)
    row.innerHTML = `
      <td><a href="athlete-profile.html?id=${index}">${athlete.name}</a></td>
      <td>${age}</td>
      <td>${athlete.gender}</td>
    `;
    tableBody.appendChild(row);
  });
}


// Initial render
renderTable(athletes);

// Search logic
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = athletes.filter(a =>
    a.name.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});
