function darSaida() {
  let codigo = document.getElementById('codigoSaida').value;
  let quantidade = parseInt(document.getElementById('quantidadeSaida').value, 10);
  let data = new Date().toISOString().slice(0, 10); // Obtém a data atual no formato YYYY-MM-DD

  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  let produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    if (produto.entrada - produto.saida >= quantidade) {
      produto.saida += quantidade;
      localStorage.setItem('produtos', JSON.stringify(produtos));

      if (window.opener && typeof window.opener.atualizarListaProdutos === 'function') {
        window.opener.atualizarListaProdutos();
      }

      alert('Saída de produto registrada com sucesso!');
      window.close();
    } else {
      alert("Quantidade de saída maior que a quantidade disponível em estoque.");
    }
  } else {
    alert("Produto não encontrado.");
  }
}
