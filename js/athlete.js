import { supabase } from "./supabase.js";

const tableBody = document.querySelector("#athletesTable tbody");

function getAge(year_of_birth) {
  const currentYear = new Date().getFullYear();
  return currentYear - year_of_birth;
}

async function loadAthletes() {
  const { data, error } = await supabase
    .from("athletes")
    .select("id, name, year_of_birth, gender")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading athletes:", error.message);
    return;
  }

  tableBody.innerHTML = "";

  data.forEach((athlete) => {
    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    row.onclick = () => {
      window.location.href = `athlete-profile.html?id=${athlete.id}`;
    };
    row.innerHTML = `
      <td>${athlete.name}</td>
      <td>${getAge(athlete.year_of_birth)}</td>
      <td>${athlete.gender}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadAthletes();
