function darEntrada() {
  let codigo = document.getElementById('codigoEntrada').value;
  let quantidade = parseInt(document.getElementById('quantidadeEntrada').value, 10);

  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  let produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    produto.entrada += quantidade;
    localStorage.setItem('produtos', JSON.stringify(produtos));

    if (window.opener && typeof window.opener.atualizarListaProdutos === 'function') {
      window.opener.atualizarListaProdutos();
    }

    alert('Entrada de produto registrada com sucesso!');
    window.close();
  } else {
    alert("Produto não encontrado.");
  }
}
