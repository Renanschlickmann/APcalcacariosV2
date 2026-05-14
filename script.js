let estoqueBranco = 0;
let estoquePreto = 0;

// LISTAS
let entradas = [];
let saidas = [];
let servicos = [];

// ELEMENTOS
const estoqueBrancoEl = document.getElementById("estoqueBranco");
const estoquePretoEl = document.getElementById("estoquePreto");

const listaEntradas = document.getElementById("listaEntradas");
const listaSaidas = document.getElementById("listaSaidas");
const listaServicos = document.getElementById("listaServicos");

// =========================
// CARREGAR DADOS
// =========================

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("calcarioSistema"));

  if (dados) {
    estoqueBranco = dados.estoqueBranco || 0;
    estoquePreto = dados.estoquePreto || 0;

    entradas = dados.entradas || [];
    saidas = dados.saidas || [];
    servicos = dados.servicos || [];

    atualizarEstoque();
    renderizarListas();
  }
}

// =========================
// SALVAR DADOS
// =========================

function salvarDados() {
  const dados = {
    estoqueBranco,
    estoquePreto,
    entradas,
    saidas,
    servicos,
  };

  localStorage.setItem("calcarioSistema", JSON.stringify(dados));
}

// =========================
// RENDERIZAR LISTAS
// =========================

function renderizarListas() {
  listaEntradas.innerHTML = "";
  listaSaidas.innerHTML = "";
  listaServicos.innerHTML = "";

  // ENTRADAS
  entradas.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <div class="item-linha">

                <div>
                    <strong>${item.nome}</strong><br>

                    Calcário ${item.tipo} - 
                    ${item.quantidade} Ton

                    <br>

                    R$ ${item.valor || "0"}
                </div>

                <button 
                    class="btn-excluir"
                    onclick="excluirEntrada(${index})"
                >
                    apagar
                </button>

            </div>
        `;

    listaEntradas.appendChild(li);
  });

  // SAÍDAS
  saidas.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <div class="item-linha">

                <div>
                    <strong>${item.nome}</strong><br>

                    Calcário ${item.tipo} - 
                    ${item.quantidade} Ton

                    <br>

                    R$ ${item.valor || "0"}
                </div>

                <button 
                    class="btn-excluir"
                    onclick="excluirSaida(${index})"
                >
                    apagar
                </button>

            </div>
        `;

    listaSaidas.appendChild(li);
  });

  // SERVIÇOS
  servicos.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <div class="item-linha">

                <div>

                    <strong>${item.nome}</strong><br>

                    ${item.tipo} - 
                    ${item.quantidade}

                    ${item.valor ? `<br>R$ ${item.valor}` : ""}

                </div>

                <button 
                    class="btn-excluir"
                    onclick="excluirServico(${index})"
                >
                    apagar
                </button>

            </div>
        `;

    listaServicos.appendChild(li);
  });
}

// =========================
// ENTRADA
// =========================

document.getElementById("formEntrada").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("entradaNome").value;

  const tipo = document.getElementById("entradaTipo").value;

  const quantidade = Number(document.getElementById("entradaQuantidade").value);

  const valor = document.getElementById("entradaValor").value.trim();

  if (tipo === "branco") {
    estoqueBranco += quantidade;
  } else {
    estoquePreto += quantidade;
  }

  entradas.unshift({
    nome,
    tipo,
    quantidade,
    valor,
  });

  atualizarEstoque();
  renderizarListas();
  salvarDados();

  this.reset();
});

// =========================
// SAÍDA
// =========================

document.getElementById("formSaida").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("saidaNome").value;

  const tipo = document.getElementById("saidaTipo").value;

  const quantidade = Number(document.getElementById("saidaQuantidade").value);

  const valor = document.getElementById("saidaValor").value.trim();

  if (tipo === "branco") {
    if (quantidade > estoqueBranco) {
      alert("Estoque insuficiente!");
      return;
    }

    estoqueBranco -= quantidade;
  } else {
    if (quantidade > estoquePreto) {
      alert("Estoque insuficiente!");
      return;
    }

    estoquePreto -= quantidade;
  }

  saidas.unshift({
    nome,
    tipo,
    quantidade,
    valor,
  });

  atualizarEstoque();
  renderizarListas();
  salvarDados();

  this.reset();
});

// =========================
// SERVIÇOS
// =========================

document.getElementById("formServico").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("servicoNome").value;

  const tipo = document.getElementById("servicoTipo").value;

  const quantidade = document.getElementById("servicoQuantidade").value;

  const valor = document.getElementById("servicoValor").value;

  servicos.unshift({
    nome,
    tipo,
    quantidade,
    valor,
  });

  renderizarListas();
  salvarDados();

  this.reset();
});

// =========================
// EXCLUIR ENTRADA
// =========================

function excluirEntrada(index) {
  const confirmar = confirm("Deseja apagar esta entrada?");

  if (!confirmar) return;

  const item = entradas[index];

  if (item.tipo === "branco") {
    estoqueBranco -= item.quantidade;
  } else {
    estoquePreto -= item.quantidade;
  }

  entradas.splice(index, 1);

  atualizarEstoque();
  renderizarListas();
  salvarDados();
}

// =========================
// EXCLUIR SAÍDA
// =========================

function excluirSaida(index) {
  const confirmar = confirm("Deseja apagar esta saída?");

  if (!confirmar) return;

  const item = saidas[index];

  if (item.tipo === "branco") {
    estoqueBranco += item.quantidade;
  } else {
    estoquePreto += item.quantidade;
  }

  saidas.splice(index, 1);

  atualizarEstoque();
  renderizarListas();
  salvarDados();
}

// =========================
// EXCLUIR SERVIÇO
// =========================

function excluirServico(index) {
  const confirmar = confirm("Deseja apagar este serviço?");

  if (!confirmar) return;

  servicos.splice(index, 1);

  renderizarListas();
  salvarDados();
}

// =========================
// ESTOQUE
// =========================

function atualizarEstoque() {
  estoqueBrancoEl.textContent = estoqueBranco + " Ton";

  estoquePretoEl.textContent = estoquePreto + " Ton";
}

// =========================
// BACKUP JSON
// =========================

document.getElementById("btnBackup").addEventListener("click", function () {
  const dados = {
    estoqueBranco,
    estoquePreto,
    entradas,
    saidas,
    servicos,
  };

  const json = JSON.stringify(dados, null, 2);

  const blob = new Blob(
    [json],

    {
      type: "application/json",
    },
  );

  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(blob);

  link.download = "backup-calcario.json";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
});

// =========================
// EXPORTAR EXCEL CSV
// =========================

document.getElementById("btnExcel").addEventListener("click", function () {
  let csv = `TIPO,NOME,CALCARIO,QUANTIDADE,VALOR\n`;

  // ENTRADAS
  entradas.forEach((item) => {
    csv += `ENTRADA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
  });

  // SAÍDAS
  saidas.forEach((item) => {
    csv += `SAIDA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
  });

  // SERVIÇOS
  servicos.forEach((item) => {
    csv += `SERVICO,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
  });

  const blob = new Blob(
    [csv],

    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "relatorio-calcario.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
});

// =========================
// IMPORTAR BACKUP
// =========================

document
  .getElementById("inputImportar")
  .addEventListener("change", function (event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (e) {
      const dados = JSON.parse(e.target.result);

      estoqueBranco = dados.estoqueBranco || 0;

      estoquePreto = dados.estoquePreto || 0;

      entradas = dados.entradas || [];

      saidas = dados.saidas || [];

      servicos = dados.servicos || [];

      atualizarEstoque();
      renderizarListas();
      salvarDados();

      alert("Backup importado com sucesso!");
    };

    leitor.readAsText(arquivo);
  });

// =========================
// INICIAR
// =========================

carregarDados();

function editarEntrada(index) {
    const item = entradas[index];

    document.getElementById("entradaNome").value = item.nome;
    document.getElementById("entradaTipo").value = item.tipo;
    document.getElementById("entradaQuantidade").value = item.quantidade;
    document.getElementById("entradaValor").value = item.valor || "";

    if (item.tipo === "branco") {
        estoqueBranco -= item.quantidade;
    } else {
        estoquePreto -= item.quantidade;
    }

    entradas.splice(index, 1);

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formEntrada").scrollIntoView();
}

function editarSaida(index) {
    const item = saidas[index];

    document.getElementById("saidaNome").value = item.nome;
    document.getElementById("saidaTipo").value = item.tipo;
    document.getElementById("saidaQuantidade").value = item.quantidade;
    document.getElementById("saidaValor").value = item.valor || "";

    if (item.tipo === "branco") {
        estoqueBranco += item.quantidade;
    } else {
        estoquePreto += item.quantidade;
    }

    saidas.splice(index, 1);

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formSaida").scrollIntoView();
}

function editarServico(index) {
    const item = servicos[index];

    document.getElementById("servicoNome").value = item.nome;
    document.getElementById("servicoTipo").value = item.tipo;
    document.getElementById("servicoQuantidade").value = item.quantidade;
    document.getElementById("servicoValor").value = item.valor || "";

    servicos.splice(index, 1);

    renderizarListas();
    salvarDados();

    document.getElementById("formServico").scrollIntoView();
}
