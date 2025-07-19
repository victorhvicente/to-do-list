let tarefas = [];

function adicionarTarefa() {
  let input = document.getElementById("tarefaInput");
  let texto = input.value.trim();

  if (texto === "") {
    alert("Digite uma tarefa válida!");
    return;
  }

  if (tarefas.includes(texto)) {
    alert("Essa tarefa já foi adicionada");
    return;
  }

  tarefas.push(texto);
  input.value = "";

  atualizarLista();
}

function removerTarefa(item) {
  tarefas.splice(item, 1);
  atualizarLista();
}

function atualizarLista() {
  let listaTarefas = document.getElementById("listaTarefas");
  listaTarefas.innerHTML = "";

  for (let i = 0; i < tarefas.length; i++) {
    let item = document.createElement("li");
    item.className = "list-group-item";

    item.innerHTML = `
      ${tarefas[i]}
      <div class="float-end">
        <button class="btn btn-sm btn-warning text-white" onclick="editarTarefa(${i})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="removerTarefa(${i})">Remover</button>   
      </div>
    `;

    listaTarefas.appendChild(item);
  }

  atualizarContador();
  salvarLocalStorage();
  atualizarBotoes();
}

function editarTarefa(item) {
  let tarefaEditada = prompt("Editar a Tarefa: ", tarefas[item]);

  if (tarefaEditada.trim() == "") {
    alert("Texto não pode ser vazio!");
    return;
  }

  if (tarefas.includes(tarefaEditada)) {
    alert("Tarefa já existe na lista!");
    return;
  }

  tarefas[item] = tarefaEditada;

  atualizarLista();
}

function atualizarContador() {
  document.getElementById("contador").textContent = tarefas.length;
}

function salvarLocalStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarLocalStorage() {
  let dados = localStorage.getItem("tarefas");

  if (dados) {
    tarefas = JSON.parse(dados);
    atualizarLista();
  }
}

function atualizarBotoes() {
  let btnUpload = document.getElementById("btnUpload");
  let btnDownload = document.getElementById("btnDownload");

  if (tarefas.length > 0) {
    btnDownload.disabled = false;
    btnUpload.disabled = true;
  } else {
    btnDownload.disabled = true;
    btnUpload.disabled = false;
  }
}

function downloadJson() {
  if (tarefas.length == 0) {
    alert("Não existem tarefas para baixar!");
    return;
  }

  let dataStr = JSON.stringify(tarefas);
  let blob = new Blob([dataStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "tarefas.json";
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function uploadJson(arquivo) {
  let file = arquivo.target.files[0];

  if (!file) {
    alert("Arquivo não existe");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    try {
      let dados = JSON.parse(e.target.result);

      if (!Array.isArray(dados)) {
        alert("Arquivo JSON inválido!");
        return;
      }

      for (let tarefa of dados) {
        if (typeof tarefa != "string") {
          alert("Arquivo JSON inválido! Todas as tarefas devem ser texto!");
          return;
        }
      }

      if (tarefas.length > 0) {
        alert("Para o upload funcionar, a lista tem que estar vazia!");
        return;
      }

      tarefas = dados;
      atualizarLista();
    } catch (error) {
      alert("Erro ao ler o arquivo JSON: " + error.message);
    }
  };

  reader.readAsText(file);
  arquivo.target.value = "";
}

// Esperar o DOM estar carregado
document.addEventListener("DOMContentLoaded", function () {
  carregarLocalStorage();
  atualizarBotoes();
});