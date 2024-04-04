document.addEventListener('DOMContentLoaded', function() {
  atualizarTabelaEstoque();
});

function atualizarTabelaEstoque(filtro = '') {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const tabelaEstoque = document.getElementById('tabelaEstoque');
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.codigo.includes(filtro)
  );

  if (produtosFiltrados.length > 0) {
    let conteudoTabela = `<table border="1">
      <tr>
        <th>Código</th>
        <th>Nome</th>
        <th>Quantidade</th>
        <th>Código de Barras</th>
        <th>Download</th>
        <th>Remover</th>
      </tr>`;

    produtosFiltrados.forEach((produto) => {
      let quantidade = produto.entrada - produto.saida;
      let barcodeId = `barcode-${produto.codigo}`;
      let downloadLinkId = `download-link-${produto.codigo}`;

      conteudoTabela += `<tr>
          <td>${produto.codigo}</td>
          <td>${produto.nome}</td>
          <td>${quantidade}</td>
          <td><div class="barcode-container"><svg id="${barcodeId}"></svg></div></td>
          <td><a class="download" id="${downloadLinkId}" href="#">Download</a></td>
          <td><button id="remove-button" onclick="removerProduto('${produto.codigo}')"></button></td>
      </tr>`;
    });

    conteudoTabela += '</table>';
    tabelaEstoque.innerHTML = conteudoTabela;

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
    tabelaEstoque.innerHTML = '<p>Não há produtos cadastrados no estoque ou não foram encontrados produtos com o filtro aplicado.</p>';
  }
}

function removerProduto(codigoProduto) {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const index = produtos.findIndex(prod => prod.codigo === codigoProduto);
  if (index !== -1 && confirm(`Tem certeza que deseja remover o produto ${produtos[index].nome}?`)) {
    produtos.splice(index, 1);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    atualizarTabelaEstoque(); // Atualize a tabela após a remoção
  }
}

function pesquisarProduto() {
  let inputPesquisa = document.getElementById('pesquisaProduto').value.trim();
  atualizarTabelaEstoque(inputPesquisa);
}

function gerarLinkDownload(barcodeId, codigo) {
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
    URL.revokeObjectURL(url);
    const imgURL = canvas.toDataURL('image/png');
    const downloadLink = document.getElementById(`download-link-${codigo}`);
    downloadLink.href = imgURL;
    downloadLink.setAttribute('download', `${codigo}_barcode.png`);
  };
  img.src = url;
}




