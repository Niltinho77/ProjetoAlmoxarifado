document.addEventListener('DOMContentLoaded', function() {
  gerarRelatorioDeConsumo();
});

function gerarRelatorioDeConsumo() {
  const produtosSaida = JSON.parse(localStorage.getItem('produtosSaida')) || [];

  // Agrupa as saídas por código de produto, somando as quantidades
  const resumoPorProduto = produtosSaida.reduce((acc, {codigo, nome, quantidade}) => {
    if (!acc[codigo]) {
      acc[codigo] = { nome, quantidade: 0 };
    }
    acc[codigo].quantidade += quantidade;
    return acc;
  }, {});

  // Gera o HTML da tabela
  let conteudoTabela = `<table border='1'>
                          <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Quantidade Consumida</th>
                          </tr>`;

  Object.entries(resumoPorProduto).forEach(([codigo, { nome, quantidade }]) => {
    conteudoTabela += `<tr>
                         <td>${codigo}</td>
                         <td>${nome}</td>
                         <td>${quantidade}</td>
                       </tr>`;
  });

  conteudoTabela += "</table>";
  document.getElementById('tabelaRelatorio').innerHTML = conteudoTabela;
}
