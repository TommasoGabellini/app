const concorrenti = ["Mago", "Guerriero", "Arciere", "Guaritore", "Assassino"];
const maxScelte = 2;

const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");
const loginSection = document.getElementById("loginSection");

const teamSection = document.getElementById("teamSection");
const cardContainer = document.getElementById("cardContainer");
const confirmTeamBtn = document.getElementById("confirmTeamBtn");
const logoutBtn = document.getElementById("logoutBtn");

const adminSection = document.getElementById("adminSection");
const teamList = document.getElementById("teamList");
const regolamentoInput = document.getElementById("regolamento");
const salvaRegolamentoBtn = document.getElementById("salvaRegolamento");

const classificaSection = document.getElementById("classificaSection");
const classificaDiv = document.getElementById("classifica");
const regolamentoTesto = document.getElementById("regolamentoTesto");

// Nav menu per l'admin
const navMenu = document.createElement("div");
navMenu.style.textAlign = "center";
navMenu.innerHTML = `
  <button onclick="mostraSezione('admin')">Gestione Squadre</button>
  <button onclick="mostraSezione('classifica')">Classifica</button>
  <button onclick="logout()">Logout</button>
`;
document.body.insertBefore(navMenu, adminSection);
navMenu.classList.add("hidden");

let selected = [];
let currentUser = null;

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  if (user) {
    localStorage.setItem("loggedUser", user);
    currentUser = user;
    checkUserRole();
  }
});

logoutBtn.addEventListener("click", logout);

function logout() {
  localStorage.removeItem("loggedUser");
  location.reload();
}

window.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedUser");
  if (user) {
    currentUser = user;
    checkUserRole();
  }
  mostraRegolamento();
});

function checkUserRole() {
  loginSection.classList.add("hidden");
  if (currentUser.toLowerCase() === "admin") {
    navMenu.classList.remove("hidden");
    mostraSezione("admin");
  } else {
    teamSection.classList.remove("hidden");
    classificaSection.classList.remove("hidden");
    renderCards();
    mostraClassifica();
  }
}

function mostraSezione(sezione) {
  adminSection.classList.add("hidden");
  classificaSection.classList.add("hidden");

  if (sezione === "admin") {
    adminSection.classList.remove("hidden");
    mostraSquadreAdmin();
  } else if (sezione === "classifica") {
    classificaSection.classList.remove("hidden");
    mostraClassifica();
  }
}

function renderCards() {
  cardContainer.innerHTML = "";
  selected = [];

  concorrenti.forEach(name => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = name;

    card.addEventListener("click", () => {
      if (selected.includes(name)) {
        selected = selected.filter(n => n !== name);
        card.classList.remove("selected");
      } else if (selected.length < maxScelte) {
        selected.push(name);
        card.classList.add("selected");
      }
      confirmTeamBtn.classList.toggle("hidden", selected.length !== maxScelte);
    });

    cardContainer.appendChild(card);
  });
}

confirmTeamBtn.addEventListener("click", () => {
  const squadra = {
    utente: currentUser,
    membri: selected,
    punti: 0,
    stato: "in attesa"
  };
  const allTeams = JSON.parse(localStorage.getItem("squadre") || "[]");
  const filtrate = allTeams.filter(t => t.utente !== currentUser);
  filtrate.push(squadra);
  localStorage.setItem("squadre", JSON.stringify(filtrate));

  alert("Squadra inviata! In attesa di approvazione.");
  confirmTeamBtn.classList.add("hidden");
});

function mostraSquadreAdmin() {
  teamList.innerHTML = "";
  const squadre = JSON.parse(localStorage.getItem("squadre") || "[]");

  squadre.forEach((sq, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${sq.utente}</strong><br>
      Membri: ${sq.membri.join(", ")}<br>
      Punti: <input type="number" value="${sq.punti}" id="punti-${i}" style="width:60px"> <br>
      Stato: ${sq.stato}
      <br>
      <button onclick="approvaSquadra(${i})">Approva</button>
      <button onclick="rifiutaSquadra(${i})">Rifiuta</button>
      <button onclick="eliminaSquadra(${i})">Elimina</button>
    `;
    teamList.appendChild(div);
  });
}

function approvaSquadra(index) {
  const squadre = JSON.parse(localStorage.getItem("squadre") || "[]");
  squadre[index].stato = "approvata";
  squadre[index].punti = parseInt(document.getElementById(`punti-${index}`).value);
  localStorage.setItem("squadre", JSON.stringify(squadre));
  mostraSquadreAdmin();
}

function rifiutaSquadra(index) {
  const squadre = JSON.parse(localStorage.getItem("squadre") || "[]");
  squadre[index].stato = "rifiutata";
  localStorage.setItem("squadre", JSON.stringify(squadre));
  mostraSquadreAdmin();
}

function eliminaSquadra(index) {
  let squadre = JSON.parse(localStorage.getItem("squadre") || "[]");
  squadre.splice(index, 1);
  localStorage.setItem("squadre", JSON.stringify(squadre));
  mostraSquadreAdmin();
}

salvaRegolamentoBtn.addEventListener("click", () => {
  const testo = regolamentoInput.value.trim();
  localStorage.setItem("regolamento", testo);
  alert("Regolamento salvato.");
  mostraRegolamento();
});

function mostraRegolamento() {
  const testo = localStorage.getItem("regolamento") || "Nessun regolamento ancora definito.";
  regolamentoTesto.textContent = testo;
}

function mostraClassifica() {
  classificaDiv.innerHTML = "";
  const squadre = JSON.parse(localStorage.getItem("squadre") || "[]");
  const approvate = squadre.filter(s => s.stato === "approvata");
  approvate.sort((a, b) => b.punti - a.punti);

  approvate.forEach(sq => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${sq.utente}</strong><br>Punti: ${sq.punti}`;
    classificaDiv.appendChild(div);
  });
}
