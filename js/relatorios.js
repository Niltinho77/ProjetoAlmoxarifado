document.addEventListener('DOMContentLoaded', function() {
  gerarRelatorioDeProdutos();
});

function filtrarRelatorio() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  gerarRelatorioDeProdutos(searchTerm);
}

function gerarRelatorioDeProdutos(searchTerm = '') {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const tabelaRelatorio = document.getElementById('tabelaRelatorio');
  const mensagemErro = document.getElementById('mensagemErro');
  let encontrouResultados = false;

  let conteudoTabela = `<table border="1">
    <tr>
      <th>Código</th>
      <th>Nome</th>
      <th>Data</th>
      <th>Entrada</th>
      <th>Saída</th>
    </tr>`;

  produtos.forEach(produto => {
    const registrosData = {};

    // Agrupa as entradas e saídas por data
    produto.entradas?.forEach(({ data, quantidade }) => {
      registrosData[data] = registrosData[data] || { entrada: 0, saida: 0 };
      registrosData[data].entrada += quantidade;
    });
    produto.saidas?.forEach(({ data, quantidade }) => {
      registrosData[data] = registrosData[data] || { entrada: 0, saida: 0 };
      registrosData[data].saida += quantidade;
    });

    // Filtra e adiciona ao relatório
    Object.keys(registrosData).forEach(data => {
      const { entrada, saida } = registrosData[data];
      const dataStr = data.includes(searchTerm) || searchTerm === '';
      const codigoStr = produto.codigo.toLowerCase().includes(searchTerm);
      const nomeStr = produto.nome.toLowerCase().includes(searchTerm);

      if (dataStr || codigoStr || nomeStr) {
        encontrouResultados = true;
        conteudoTabela += `<tr>
          <td>${produto.codigo}</td>
          <td>${produto.nome}</td>
          <td>${data}</td>
          <td>${entrada}</td>
          <td>${saida}</td>
        </tr>`;
      }
    });
  });

  conteudoTabela += '</table>';
  tabelaRelatorio.innerHTML = conteudoTabela;

  // Ajusta a exibição de mensagens de erro baseado nos resultados
  if (!encontrouResultados && searchTerm) {
    mensagemErro.style.display = 'block';
    mensagemErro.textContent = 'Nenhum resultado encontrado.';
  } else if (searchTerm === '') {
    mensagemErro.style.display = 'none';
    if (!encontrouResultados) {
      tabelaRelatorio.innerHTML = 'Inicie uma pesquisa para ver os resultados aqui.';
    }
  } else {
    mensagemErro.style.display = 'none';
  }
}
