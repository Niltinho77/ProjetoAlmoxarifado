function darSaida() {
  let codigo = document.getElementById('codigoSaida').value;
  let quantidade = parseInt(document.getElementById('quantidadeSaida').value, 10);
  let data = new Date().toISOString().slice(0, 10); // Obtém a data atual no formato YYYY-MM-DD

  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  let produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
      let quantidadeDisponivel = (produto.entradaTotal || 0) - (produto.saidaTotal || 0); // Calcula a quantidade disponível baseando-se nos totais de entrada e saída

      if (quantidade <= quantidadeDisponivel) { // Verifica se há estoque suficiente para a saída
          if (!produto.saidas) produto.saidas = [];
          produto.saidas.push({ data: data, quantidade: quantidade });
          produto.saidaTotal = (produto.saidaTotal || 0) + quantidade; // Atualiza o total de saída

          localStorage.setItem('produtos', JSON.stringify(produtos)); // Salva as alterações no localStorage

          if (window.opener && typeof window.opener.atualizarListaProdutos === 'function') {
              window.opener.atualizarListaProdutos(); // Atualiza a lista de produtos na janela principal, se aplicável
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
