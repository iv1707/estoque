// ============================
// BASE
// ============================

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// SALVAR
function salvarDados() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// ============================
// ADICIONAR PRODUTO
// ============================

function adicionarProduto() {

    const nomeEl = document.getElementById("nome");
    const categoriaEl = document.getElementById("categoria");
    const quantidadeEl = document.getElementById("quantidade");
    const valorEl = document.getElementById("valor");

    if (!nomeEl || !categoriaEl || !quantidadeEl || !valorEl) {
        alert("Erro: campos não encontrados!");
        return;
    }

    const nome = nomeEl.value.trim();
    const categoria = categoriaEl.value;
    const quantidade = Number(quantidadeEl.value);
    const valor = Number(valorEl.value);

    if (!nome || quantidade <= 0 || valor <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const existente = produtos.find(
        p => p.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existente) {
        existente.quantidade += quantidade;
        existente.valor = valor;
        existente.categoria = categoria;
    } else {
        produtos.push({
            nome,
            categoria,
            quantidade,
            valor
        });
    }

salvarDados();

mostrarNotificacao("✅ Produto adicionado com sucesso!");

nomeEl.value = "";
quantidadeEl.value = "";
valorEl.value = "";

    atualizarDashboard();
}

// ============================
// DASHBOARD
// ============================

function atualizarDashboard() {

    produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    const totalProdutos = produtos.length;

    let valorTotal = 0;

    produtos.forEach(p => {
        valorTotal += p.quantidade * p.valor;
    });

    const el1 = document.getElementById("totalProdutos");
    const el2 = document.getElementById("valorTotal");

    if (el1) el1.innerText = totalProdutos;
    if (el2) el2.innerText = "R$ " + valorTotal.toFixed(2);
}

// ============================
// ESTOQUE
// ============================

function carregarEstoque() {

    produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    const tabela = document.getElementById("listaProdutos");

    if (!tabela) return;

    tabela.innerHTML = "";

    let total = 0;

    produtos.forEach((p, i) => {

        const subtotal = p.quantidade * p.valor;
        total += subtotal;

        tabela.innerHTML += `
            <tr>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${p.valor.toFixed(2)}</td>
                <td>R$ ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn-retirar" onclick="retirarProduto(${i})">➖</button>
                    <button class="btn-excluir" onclick="excluirProduto(${i})">🗑️</button>
                </td>
            </tr>
        `;
    });

    const totalEl = document.getElementById("valorTotalEstoque");

    if (totalEl) {
        totalEl.innerText = "R$ " + total.toFixed(2);
    }
}

// ============================
// RETIRAR
// ============================

function retirarProduto(i) {

    const qtd = Number(prompt("Quantidade para retirar:"));

    if (isNaN(qtd) || qtd <= 0) return;

    if (qtd > produtos[i].quantidade) {
        alert("Quantidade maior que o estoque!");
        return;
    }

    produtos[i].quantidade -= qtd;

    if (produtos[i].quantidade <= 0) {
        produtos.splice(i, 1);
    }

    salvarDados();
    carregarEstoque();
}

// ============================
// EXCLUIR
// ============================

function excluirProduto(i) {

    if (!confirm("Deseja excluir este produto?")) return;

    produtos.splice(i, 1);

    salvarDados();
    carregarEstoque();
}

// ============================
// FILTRO
// ============================

function filtrarProdutos() {

    const pesquisa = document.getElementById("pesquisa").value.toLowerCase();

    const linhas = document.querySelectorAll("#listaProdutos tr");

    linhas.forEach(linha => {

        const nome = linha.querySelector("td")?.innerText.toLowerCase();

        linha.style.display =
            nome && nome.includes(pesquisa)
                ? ""
                : "none";
    });
}

// ============================
// INICIALIZAÇÃO SEGURA
// ============================

window.onload = function () {
    carregarEstoque();
    atualizarDashboard();
};

function mostrarNotificacao(texto) {

    const notificacao = document.getElementById("notificacao");

    if (!notificacao) return;

    notificacao.innerText = texto;

    notificacao.classList.add("mostrar");

    setTimeout(function () {
        notificacao.classList.remove("mostrar");
    }, 3000);

}
