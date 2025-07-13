const windSensitiveEvents = ["100m", "200m", "110m Hurdles", "100m Hurdles", "Long Jump", "Triple Jump"];

const rankings = [
    {
        name: "Alice Tan",
        yearOfBirth: 2006,
        event: "100m",
        gender: "Female",
        ageGroup: "U20",
        year: 2025,
        result: "12.00s",
        wind: "+1.9",
        competition: "National U20 Finals"
    },
    {
        name: "Benjamin Lee",
        yearOfBirth: 2003,
        event: "100m",
        gender: "Male",
        ageGroup: "Senior",
        year: 2025,
        result: "10.72s",
        wind: "+0.8",
        competition: "IVP Series"
    },
    {
        name: "Cassandra Ng",
        yearOfBirth: 2007,
        event: "Long Jump",
        gender: "Female",
        ageGroup: "U18",
        year: 2024,
        result: "5.55m",
        wind: "+2.4", // ILLEGAL — will be filtered
        competition: "Youth Games"
    }
];

const eventSelect = document.getElementById("eventSelect");
const genderSelect = document.getElementById("genderSelect");
const ageGroupSelect = document.getElementById("ageGroupSelect");
const yearSelect = document.getElementById("yearSelect");
const filterBtn = document.getElementById("filterBtn");
const tableBody = document.querySelector("#rankingsTable tbody");

function calculateAge(yearOfBirth) {
    return new Date().getFullYear() - yearOfBirth;
}

function isWindLegal(event, windStr) {
    if (!windSensitiveEvents.includes(event)) return true;
    const windVal = parseFloat(windStr);
    return windVal <= 2.0;
}

filterBtn.addEventListener("click", () => {
    const event = eventSelect.value;
    const gender = genderSelect.value;
    const ageGroup = ageGroupSelect.value;
    const year = yearSelect.value;

    if (!event || !gender) {
        tableBody.innerHTML = `<tr><td colspan="7">Please select both Event and Gender to view rankings.</td></tr>`;
        return;
    }

    let filtered = rankings.filter(r =>
        r.event === event &&
        r.gender === gender &&
        (ageGroup === "All" || r.ageGroup === ageGroup) &&
        (year === "All" || r.year.toString() === year) &&
        isWindLegal(r.event, r.wind)
    );

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No legal results found for selected filters.</td></tr>`;
        return;
    }

    filtered.sort((a, b) => parseFloat(a.result) - parseFloat(b.result));

    tableBody.innerHTML = "";
    filtered.forEach((r, i) => {
        const age = calculateAge(r.yearOfBirth);
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.name}</td>
      <td>${r.result} (${r.wind} m/s)</td>
      <td>${r.gender}</td>
      <td>${r.event}</td>
      <td>${age}</td>
      <td>${r.competition}</td>
    `;
        tableBody.appendChild(row);
    });
});
