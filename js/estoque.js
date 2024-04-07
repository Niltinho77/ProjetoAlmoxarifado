// Adiciona um ouvinte de evento para carregar a tabela de estoque assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  atualizarTabelaEstoque();
});

function atualizarTabelaEstoque(filtro = '') {
  // Carrega a lista de produtos do localStorage
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  // Seleciona o elemento HTML onde a tabela de estoque será inserida
  const tabelaEstoque = document.getElementById('tabelaEstoque');

  // Filtra os produtos de acordo com o filtro aplicado no campo de pesquisa
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.codigo.includes(filtro)
  );

  // Verifica se existem produtos após aplicar o filtro
  if (produtosFiltrados.length > 0) {
    // Inicializa a tabela de estoque com cabeçalhos
    let conteudoTabela = `<table border="1">
      <tr>
        <th>Código</th>
        <th>Nome</th>
        <th>Quantidade</th>
        <th>Código de Barras</th>
        <th>Download</th>
        <th>Remover</th>
      </tr>`;

    // Para cada produto filtrado, calcula a quantidade disponível e adiciona uma linha na tabela
    produtosFiltrados.forEach((produto) => {
      let quantidade = produto.entrada - produto.saida; // Calcula a quantidade disponível
      let barcodeId = `barcode-${produto.codigo}`; // ID único para o elemento SVG do código de barras
      let downloadLinkId = `download-link-${produto.codigo}`; // ID único para o link de download do código de barras

      // Adiciona uma linha na tabela para o produto
      conteudoTabela += `<tr>
          <td>${produto.codigo}</td>
          <td>${produto.nome}</td>
          <td>${quantidade}</td>
          <td><div class="barcode-container"><svg id="${barcodeId}"></svg></div></td>
          <td><a class="download" id="${downloadLinkId}" href="#">Download</a></td>
          <td><button id="remove-button" onclick="removerProduto('${produto.codigo}')">Remover</button></td>
      </tr>`;
    });

    // Finaliza a tabela e insere no elemento HTML
    conteudoTabela += '</table>';
    tabelaEstoque.innerHTML = conteudoTabela;

    // Para cada produto filtrado, gera o código de barras e o link de download
    produtosFiltrados.forEach((produto) => {
      let barcodeId = `barcode-${produto.codigo}`;
      JsBarcode(`#${barcodeId}`, produto.codigo, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true
      });
      gerarLinkDownload(barcodeId, produto.codigo);
    });
  } else {
    // Se não houver produtos filtrados, exibe uma mensagem
    tabelaEstoque.innerHTML = '<p>Não há produtos cadastrados no estoque ou não foram encontrados produtos com o filtro aplicado.</p>';
  }
}

function removerProduto(codigoProduto) {
  // Carrega a lista de produtos do localStorage
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  // Encontra o índice do produto a ser removido
  const index = produtos.findIndex(prod => prod.codigo === codigoProduto);

  // Se o produto for encontrado e a confirmação de remoção for positiva, remove o produto
  if (index !== -1 && confirm(`Tem certeza que deseja remover o produto ${produtos[index].nome}?`)) {
    produtos.splice(index, 1); // Remove o produto da lista
    localStorage.setItem('produtos', JSON.stringify(produtos)); // Atualiza o localStorage
    atualizarTabelaEstoque(); // Atualiza a tabela de estoque
  }
}

function pesquisarProduto() {
  // Obtém o valor do campo de pesquisa e atualiza a tabela de estoque com o filtro aplicado
  let inputPesquisa = document.getElementById('pesquisaProduto').value.trim();
  atualizarTabelaEstoque(inputPesquisa);
}

function gerarLinkDownload(barcodeId, codigo) {
  // Gera um link de download para o código de barras do produto
  const svgElement = document.getElementById(barcodeId);
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url); // Libera o URL criado
    const imgURL = canvas.toDataURL('image/png'); // Converte o canvas em uma URL de imagem
    const downloadLink = document.getElementById(`download-link-${codigo}`);
    downloadLink.href = imgURL; // Define a URL da imagem como href do link de download
    downloadLink.setAttribute('download', `${codigo}_barcode.png`); // Define o nome do arquivo a ser baixado
  };
  img.src = url; // Inicia o carregamento da imagem
}
