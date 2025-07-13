import { supabase } from "./supabase.js";

const tableBody = document.querySelector("#competitionsTable tbody");

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

async function loadCompetitions() {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error loading competitions:", error.message);
    tableBody.innerHTML = `<tr><td colspan="2">Error loading data</td></tr>`;
    return;
  }

  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="2">No competitions available</td></tr>`;
    return;
  }

  data.forEach(comp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="competition-details.html?id=${comp.id}">${comp.name}</a></td>
      <td>${formatDate(comp.start_date)} – ${formatDate(comp.end_date)}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadCompetitions();
