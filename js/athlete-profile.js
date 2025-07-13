import { supabase } from "./supabase.js";

const urlParams = new URLSearchParams(window.location.search);
const athleteId = urlParams.get("id");

const windSensitiveEvents = ["100m", "200m", "100m Hurdles", "110m Hurdles", "Long Jump", "Triple Jump"];

function calculateAge(yearOfBirth) {
  return new Date().getFullYear() - yearOfBirth;
}

function getAgeGroup(age) {
  if (age < 18) return "U18";
  if (age < 20) return "U20";
  return "Senior";
}

function isLegalWind(event, wind) {
  if (!windSensitiveEvents.includes(event)) return true;
  const val = parseFloat(wind);
  return !isNaN(val) && val <= 2.0;
}

function isNumericResult(result) {
  return /^\d+(\.\d+)?[sm]$/.test(result); // e.g. "12.00s", "5.44m"
}

function formatResultWithWind(result, wind) {
  return wind ? `${result} (${wind} m/s)` : result;
}

function renderResults(tableId, results, includeRound = false) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = "";

  if (!results.length) {
    tableBody.innerHTML = `<tr><td colspan="${includeRound ? 5 : 3}">No results available.</td></tr>`;
    return;
  }

  results.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = includeRound
      ? `
        <td>${r.event_name}</td>
        <td>${formatResultWithWind(r.result, r.wind)}</td>
        <td>${r.round}</td>
        <td>${r.competition_name}</td>
        <td>${r.year}</td>
      `
      : `
        <td>${r.event_name}</td>
        <td>${formatResultWithWind(r.result, r.wind)}</td>
        <td>${r.competition_name}</td>
      `;
    tableBody.appendChild(row);
  });
}


async function loadAthleteProfile() {
  // Load athlete
  const { data: athlete, error } = await supabase
    .from("athletes")
    .select("*")
    .eq("id", athleteId)
    .single();

  if (error || !athlete) {
    document.getElementById("athleteName").textContent = "Athlete not found";
    return;
  }

  const age = calculateAge(athlete.year_of_birth);
  const ageGroup = getAgeGroup(age);

  document.getElementById("athleteName").textContent = athlete.name;
  document.getElementById("athleteAge").textContent = age;
  document.getElementById("athleteGender").textContent = athlete.gender;
  document.getElementById("athleteAgeGroup").textContent = ageGroup;

  // Load results (joined with event + competition)
  const { data: results, error: resultsError } = await supabase
    .from("results")
    .select(`
      id,
      result,
      wind,
      year,
      rounds (
        round_name,
        events ( name ),
        competitions ( name )
      )
    `)
    .eq("athlete_id", athleteId);

  if (resultsError) {
    console.error("Error loading results:", resultsError.message);
    return;
  }

  // Format and flatten
  const formatted = results.map(r => ({
    result: r.result,
    wind: r.wind,
    year: r.year,
    round: r.rounds?.round_name,
    event_name: r.rounds?.events?.name || "-",
    competition_name: r.rounds?.competitions?.name || "-"
  }));

  const currentYear = new Date().getFullYear();

  // Personal Best: best numeric + legal per event
  const pbByEvent = {};
  formatted.forEach(r => {
    if (!isNumericResult(r.result)) return;
    if (!isLegalWind(r.event_name, r.wind)) return;
    if (!pbByEvent[r.event_name] || parseFloat(r.result) < parseFloat(pbByEvent[r.event_name].result)) {
      pbByEvent[r.event_name] = r;
    }
  });

  // Season Best: best this year, numeric + legal
  const sbByEvent = {};
  formatted.forEach(r => {
    if (r.year !== currentYear) return;
    if (!isNumericResult(r.result)) return;
    if (!isLegalWind(r.event_name, r.wind)) return;
    if (!sbByEvent[r.event_name] || parseFloat(r.result) < parseFloat(sbByEvent[r.event_name].result)) {
      sbByEvent[r.event_name] = r;
    }
  });

  // Render
  renderResults("pbTable", Object.values(pbByEvent));
  renderResults("sbTable", Object.values(sbByEvent));
  renderResults("allResultsTable", formatted, true);
}

loadAthleteProfile();
