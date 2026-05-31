const teams = {
  A: [],
  B: []
};

async function fetchPlayer(input) {
  const isUsername = input.startsWith("@");

  const url = isUsername
    ? `/api/player?username=${input.replace("@", "")}`
    : `/api/player?id=${input}`;

  const res = await fetch(url);
  return await res.json();
}

async function addPlayer(team) {
  const input = document.getElementById(`team${team}_in`);
  const value = input.value.trim();

  if (!value) return;

  const player = await fetchPlayer(value);

  teams[team].push(player);
  render(team);

  input.value = "";
}

function render(team) {
  const div = document.getElementById(`list${team}`);

  div.innerHTML = teams[team]
    .map(p => `
      <div class="card">
        ${p.name} | REL: ${p.rel} | WAR: ${p.war}
      </div>
    `)
    .join("");
}

function value(player) {
  return (player.rel * 100) + (player.war * 50);
}

function calcTrade() {
  const A = teams.A.reduce((sum, p) => sum + value(p), 0);
  const B = teams.B.reduce((sum, p) => sum + value(p), 0);

  const diff = A - B;

  let verdict =
    Math.abs(diff) < 5 ? "Even Trade ⚖️"
    : diff > 0 ? "Team A Wins 🔵"
    : "Team B Wins 🔴";

  document.getElementById("result").innerText =
    `${verdict} | Diff: ${diff.toFixed(2)}`;
}