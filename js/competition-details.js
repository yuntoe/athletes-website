import { supabase } from "./supabase.js";

const params = new URLSearchParams(window.location.search);
const competitionId = params.get("id");
const compTitle = document.querySelector("#competitionTitle");
const tableBody = document.querySelector("#eventRoundsTable tbody");

async function loadCompetitionDetails() {
  const { data: competition, error: compErr } = await supabase
    .from("competitions")
    .select("name")
    .eq("id", competitionId)
    .single();

  if (compErr) {
    compTitle.textContent = "Competition not found";
    return;
  }

  compTitle.textContent = competition.name;

  const { data: rounds, error } = await supabase
    .from("rounds")
    .select("id, round_name, event_id, events (name, age_group)")
    .eq("competition_id", competitionId)
    .order("round_name", { ascending: true });

  if (error || !rounds.length) {
    tableBody.innerHTML = `<tr><td colspan="3">No event rounds found.</td></tr>`;
    return;
  }

  rounds.forEach(r => {
    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    row.onclick = () => {
      window.location.href = `event-results.html?id=${r.id}`;
    };
    row.innerHTML = `
      <td>${r.events.name}</td>
      <td>${r.events.age_group}</td>
      <td>${r.round_name}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadCompetitionDetails();
