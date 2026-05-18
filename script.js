let estoqueBranco = 0;
let estoquePreto = 0;

let entradas = [];
let saidas = [];
let servicos = [];

const estoqueBrancoEl = document.getElementById("estoqueBranco");
const estoquePretoEl = document.getElementById("estoquePreto");

const listaEntradas = document.getElementById("listaEntradas");
const listaSaidas = document.getElementById("listaSaidas");
const listaServicos = document.getElementById("listaServicos");

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

function salvarDados() {
    const dados = {
        estoqueBranco,
        estoquePreto,
        entradas,
        saidas,
        servicos
    };

    localStorage.setItem("calcarioSistema", JSON.stringify(dados));
}

function renderizarListas() {
    listaEntradas.innerHTML = "";
    listaSaidas.innerHTML = "";
    listaServicos.innerHTML = "";

    entradas.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    Calcário ${item.tipo} - ${item.quantidade} Ton<br>
                    R$ ${item.valor || "0"}
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarEntrada(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirEntrada(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaEntradas.appendChild(li);
    });

    saidas.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    Calcário ${item.tipo} - ${item.quantidade} Ton<br>
                    R$ ${item.valor || "0"}
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarSaida(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirSaida(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaSaidas.appendChild(li);
    });

    servicos.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    ${item.tipo} - ${item.quantidade}
                    ${item.valor ? `<br>R$ ${item.valor}` : ""}
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarServico(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirServico(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

      listaServicos.appendChild(li);

});

atualizarTotais();

}

document.getElementById("formEntrada").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("entradaNome").value.trim();
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
        valor
    });

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    this.reset();
});

document.getElementById("formSaida").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("saidaNome").value.trim();
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
        valor
    });

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    this.reset();
});

document.getElementById("formServico").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("servicoNome").value.trim();
    const tipo = document.getElementById("servicoTipo").value;
    const quantidade = document.getElementById("servicoQuantidade").value;
    const valor = document.getElementById("servicoValor").value.trim();

    servicos.unshift({
        nome,
        tipo,
        quantidade,
        valor
    });

    renderizarListas();
    salvarDados();

    this.reset();
});

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

function excluirServico(index) {
    const confirmar = confirm("Deseja apagar este serviço?");

    if (!confirmar) return;

    servicos.splice(index, 1);

    renderizarListas();
    salvarDados();
}

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

    fecharExtrato();
    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formEntrada").scrollIntoView({ behavior: "smooth" });
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

    fecharExtrato();
    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formSaida").scrollIntoView({ behavior: "smooth" });
}

function editarServico(index) {
    const item = servicos[index];

    document.getElementById("servicoNome").value = item.nome;
    document.getElementById("servicoTipo").value = item.tipo;
    document.getElementById("servicoQuantidade").value = item.quantidade;
    document.getElementById("servicoValor").value = item.valor || "";

    servicos.splice(index, 1);

    fecharExtrato();
    renderizarListas();
    salvarDados();

    document.getElementById("formServico").scrollIntoView({ behavior: "smooth" });
}

function atualizarEstoque() {
    estoqueBrancoEl.textContent = estoqueBranco + " Ton";
    estoquePretoEl.textContent = estoquePreto + " Ton";
}

document.getElementById("btnBackup").addEventListener("click", function() {
    const dados = {
        estoqueBranco,
        estoquePreto,
        entradas,
        saidas,
        servicos
    };

    const json = JSON.stringify(dados, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "backup-calcario.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById("btnExcel").addEventListener("click", function() {
    let csv = `TIPO,NOME,CALCARIO,QUANTIDADE,VALOR\n`;

    entradas.forEach(item => {
        csv += `ENTRADA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
    });

    saidas.forEach(item => {
        csv += `SAIDA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
    });

    servicos.forEach(item => {
        csv += `SERVICO,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "relatorio-calcario.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById("inputImportar").addEventListener("change", function(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {
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

const modalExtrato = document.getElementById("modalExtrato");
const btnAbrirExtrato = document.getElementById("btnAbrirExtrato");
const btnFecharExtrato = document.getElementById("btnFecharExtrato");

function abrirExtrato() {
    modalExtrato.classList.add("ativo");
    mostrarAba("entradas");
}

function fecharExtrato() {
    modalExtrato.classList.remove("ativo");
}

function mostrarAba(nome) {
    document.querySelectorAll(".conteudo-aba").forEach(aba => {
        aba.classList.remove("ativo");
    });

    document.querySelectorAll(".aba").forEach(botao => {
        botao.classList.remove("ativa");
    });

    if (nome === "entradas") {
        document.getElementById("abaEntradas").classList.add("ativo");
        document.querySelectorAll(".aba")[0].classList.add("ativa");
    }

    if (nome === "saidas") {
        document.getElementById("abaSaidas").classList.add("ativo");
        document.querySelectorAll(".aba")[1].classList.add("ativa");
    }

    if (nome === "servicos") {
        document.getElementById("abaServicos").classList.add("ativo");
        document.querySelectorAll(".aba")[2].classList.add("ativa");
    }
}

btnAbrirExtrato.addEventListener("click", abrirExtrato);
btnFecharExtrato.addEventListener("click", fecharExtrato);

modalExtrato.addEventListener("click", function(event) {
    if (event.target === modalExtrato) {
        fecharExtrato();
    }
});

const totalEntradasEl =
document.getElementById("totalEntradas");

const totalSaidasEl =
document.getElementById("totalSaidas");

const totalServicosEl =
document.getElementById("totalServicos");

const totalComprasEl =
document.getElementById("totalCompras");

const totalVendasEl =
document.getElementById("totalVendas");

const totalValorServicosEl =
document.getElementById("totalValorServicos");

function converterValor(valor) {

    if (!valor) return 0;

    return Number(
        valor
        .toString()
        .replace(/\./g,"")
        .replace(",",".")
        .replace(/[^\d.]/g,"")
    ) || 0;

}

function formatarDinheiro(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}

function atualizarTotais() {

    let totalEntradaQtd = 0;
    let totalSaidaQtd = 0;
    let totalServicoQtd = 0;

    let totalCompras = 0;
    let totalVendas = 0;
    let totalServicosValor = 0;

    entradas.forEach(item => {

        totalEntradaQtd +=
        Number(item.quantidade) || 0;

        totalCompras +=
        converterValor(item.valor);

    });

    saidas.forEach(item => {

        totalSaidaQtd +=
        Number(item.quantidade) || 0;

        totalVendas +=
        converterValor(item.valor);

    });

    servicos.forEach(item => {

        totalServicoQtd +=
        Number(item.quantidade) || 0;

        totalServicosValor +=
        converterValor(item.valor);

    });

    totalEntradasEl.textContent =
    totalEntradaQtd + " Ton";

    totalSaidasEl.textContent =
    totalSaidaQtd + " Ton";

    totalServicosEl.textContent =
    totalServicoQtd;

    totalComprasEl.textContent =
    formatarDinheiro(totalCompras);

    totalVendasEl.textContent =
    formatarDinheiro(totalVendas);

    totalValorServicosEl.textContent =
    formatarDinheiro(totalServicosValor);

}

carregarDados();

document.getElementById("btnImprimirExtrato")
.addEventListener("click", function() {

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    let conteudo = `
        <html>
        <head>
            <title>Extrato ApCalcários</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #111;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .data {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #555;
                }

                h2 {
                    background: #1e3b20;
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 25px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    font-size: 14px;
                }

                th {
                    background: #f1f5f9;
                }

                .rodape {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #555;
                }
            </style>
        </head>

        <body>
            <h1>Extrato ApCalcários</h1>
            <p class="data">Emitido em ${dataAtual}</p>
    `;

    conteudo += `
        <h2>Entradas</h2>
        <table>
            <tr>
                <th>Nome / Data</th>
                <th>Calcário</th>
                <th>Quantidade</th>
                <th>Valor</th>
            </tr>
    `;

    entradas.forEach(item => {
        conteudo += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>${item.quantidade} Ton</td>
                <td>R$ ${item.valor || "0"}</td>
            </tr>
        `;
    });

    conteudo += `</table>`;

    conteudo += `
        <h2>Saídas</h2>
        <table>
            <tr>
                <th>Produtor</th>
                <th>Calcário</th>
                <th>Quantidade</th>
                <th>Valor</th>
            </tr>
    `;

    saidas.forEach(item => {
        conteudo += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>${item.quantidade} Ton</td>
                <td>R$ ${item.valor || "0"}</td>
            </tr>
        `;
    });

    conteudo += `</table>`;

    conteudo += `
        <h2>Serviços</h2>
        <table>
            <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Quantidade</th>
                <th>Valor</th>
            </tr>
    `;

    servicos.forEach(item => {
        conteudo += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${item.valor || "0"}</td>
            </tr>
        `;
    });

    conteudo += `
        </table>

        <div class="rodape">
            © 2026 - feito por Renan Schlickmann Gesser
        </div>

        </body>
        </html>
    `;

    const janela = window.open("", "_blank");

    janela.document.write(conteudo);
    janela.document.close();

    janela.print();

});
