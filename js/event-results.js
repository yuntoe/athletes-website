import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://paphpyftojdcogbwtugv.supabase.co';
const supbasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcGhweWZ0b2pkY29nYnd0dWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDE1MTksImV4cCI6MjA2Nzk3NzUxOX0.MNg54k76IWcS_F-hw6ceD6LPwd4iKpg0A7z7Z9mdkUc";
const supabase = createClient(supabaseUrl, supabaseKey);

const roundId = new URLSearchParams(window.location.search).get('id');

const windSensitiveEvents = ['100m', '200m', '110m Hurdles', '100m Hurdles', 'Long Jump', 'Triple Jump'];

async function loadEventResults() {
  const { data: roundData } = await supabase
    .from('rounds')
    .select('id, round_name, event_id, competition_id, events(name), competitions(name, start_date)')
    .eq('id', roundId)
    .single();

  document.getElementById('eventName').textContent = roundData.events.name;
  document.getElementById('roundName').textContent = roundData.round_name;

  const { data: results } = await supabase
    .from('results')
    .select('*, athletes(name, year_of_birth, gender)')
    .eq('round_id', roundId);

  if (!results.length) return;

  const heats = {};
  const currentYear = new Date().getFullYear();
  const isWindSensitive = windSensitiveEvents.includes(roundData.events.name);

  results.forEach(res => {
    if (!heats[res.heat_number]) heats[res.heat_number] = [];
    heats[res.heat_number].push(res);
  });

  const heatsContainer = document.getElementById('heatsContainer');

  for (const [heatNumber, heatResults] of Object.entries(heats)) {
    const wind = heatResults[0].wind || '0.0';
    const isLegal = parseFloat(wind) <= 2.0 || wind.startsWith('-');

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = `Heat ${heatNumber} (Wind: ${wind} m/s${!isLegal ? ' ❌' : ''})`;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>Lane</th><th>Name</th><th>Result (Wind)</th><th>Qual</th></tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    heatResults.forEach(res => {
      const row = document.createElement('tr');
      const age = currentYear - res.athletes.year_of_birth;
      const windDisplay = res.wind ? `${res.result} (${res.wind} m/s)` : res.result;
      const windColor = isWindSensitive && parseFloat(res.wind) > 2.0 ? 'red' : 'inherit';

      row.innerHTML = `
        <td>${res.lane || ''}</td>
        <td>${res.athletes.name}</td>
        <td style="color:${windColor}">${windDisplay}</td>
        <td>${res.qualification || ''}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    heatsContainer.appendChild(table);
  }

  // Overall standings (sorted)
  const legalResults = results.filter(r => {
    if (!isWindSensitive) return true;
    const wind = parseFloat(r.wind);
    return wind <= 2.0 || r.wind.startsWith('-');
  });

  legalResults.sort((a, b) => parseFloat(a.result) - parseFloat(b.result));

  const overallBody = document.getElementById('overallStandingsBody');
  legalResults.forEach((res, i) => {
    const age = currentYear - res.athletes.year_of_birth;
    const windDisplay = res.wind ? `${res.result} (${res.wind} m/s)` : res.result;
    const windColor = isWindSensitive && parseFloat(res.wind) > 2.0 ? 'red' : 'inherit';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${res.athletes.name}</td>
      <td>${res.athletes.gender}</td>
      <td style="color:${windColor}">${windDisplay}</td>
      <td>${age}</td>
      <td>${roundData.competitions.name}</td>
    `;
    overallBody.appendChild(row);
  });
}

loadEventResults();
