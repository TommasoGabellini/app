let squadre = JSON.parse(localStorage.getItem("squadre")) || {};
let bacheca = localStorage.getItem("bacheca") || "";
document.getElementById("bachecaMessaggio").innerText = bacheca;

document.getElementById("loginBtn").addEventListener("click", () => {
  const nome = document.getElementById("teamNameInput").value.trim();
  if (!nome) return;

  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  
  if (nome.toLowerCase() === "admin") {
    document.getElementById("adminSection").classList.remove("hidden");
    document.getElementById("bachecaSection").classList.remove("hidden");
    document.getElementById("adminBacheca").classList.remove("hidden");
    aggiornaListaAdmin();
  } else {
    if (!squadre[nome]) {
      squadre[nome] = { concorrenti: [], punti: 0, approvata: false };
      localStorage.setItem("squadre", JSON.stringify(squadre));
    }
    document.getElementById("teamTitle").innerText = `Squadra: ${nome}`;
    document.getElementById("teamSection").classList.remove("hidden");
    document.getElementById("classificaSection").classList.remove("hidden");
    document.getElementById("bachecaSection").classList.remove("hidden");

    mostraConcorrenti(nome);
    aggiornaClassifica();
  }
});

function mostraConcorrenti(nome) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const card = document.createElement("div");
    card.innerText = `Concorrente ${i}`;
    card.className = "card";
    container.appendChild(card);
  }
  document.getElementById("confirmTeamBtn").classList.remove("hidden");
  document.getElementById("confirmTeamBtn").onclick = () => {
    alert("Richiesta inviata al master");
  };
}

function aggiornaListaAdmin() {
  const list = document.getElementById("adminTeamList");
  list.innerHTML = "";
  for (const [nome, dati] of Object.entries(squadre)) {
    const li = document.createElement("li");
    li.innerText = `${nome} - ${dati.punti} punti`;
    const approva = document.createElement("button");
    approva.innerText = "Approva";
    approva.onclick = () => {
      squadre[nome].approvata = true;
      localStorage.setItem("squadre", JSON.stringify(squadre));
      aggiornaClassifica();
    };
    const rimuovi = document.createElement("button");
    rimuovi.innerText = "Elimina";
    rimuovi.onclick = () => {
      delete squadre[nome];
      localStorage.setItem("squadre", JSON.stringify(squadre));
      aggiornaListaAdmin();
      aggiornaClassifica();
    };
    li.appendChild(approva);
    li.appendChild(rimuovi);
    list.appendChild(li);
  }
}

function aggiornaClassifica() {
  const lista = document.getElementById("classificaList");
  lista.innerHTML = "";
  const squadreApprovate = Object.entries(squadre).filter(([_, s]) => s.approvata);
  squadreApprovate.sort((a, b) => b[1].punti - a[1].punti);
  for (const [nome, dati] of squadreApprovate) {
    const li = document.createElement("li");
    li.innerText = `${nome}: ${dati.punti} punti`;
    lista.appendChild(li);
  }
}

document.getElementById("salvaBachecaBtn").addEventListener("click", () => {
  const testo = document.getElementById("bachecaInput").value.trim();
  if (testo) {
    bacheca = testo;
    localStorage.setItem("bacheca", testo);
    document.getElementById("bachecaMessaggio").innerText = testo;
    document.getElementById("bachecaInput").value = "";
  }
});

document.getElementById("homeBtn").addEventListener("click", () => {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById("loginSection").classList.remove("hidden");
});
