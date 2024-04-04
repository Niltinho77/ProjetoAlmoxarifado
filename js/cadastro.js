function cadastrarProduto() {
  let codigo = document.getElementById('codigo').value.trim();
  let nome = document.getElementById('nome').value.trim();
  
  // Carregar a lista atual de produtos do localStorage
  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

  // Verificar se já existe um produto com o mesmo código
  let produtoExistente = produtos.find(produto => produto.codigo === codigo);

  if (produtoExistente) {
    alert('Um produto com este código já está cadastrado.');
    return; // Parar a execução se o produto já existir
  }

  // Se não existir, adicionar o novo produto
  let novoProduto = {
    codigo: codigo,
    nome: nome,
    entrada: 0,
    saida: 0
  };

  produtos.push(novoProduto);
  localStorage.setItem('produtos', JSON.stringify(produtos));

  // Atualizar a lista de produtos na janela principal, se necessário
  if (window.opener && typeof window.opener.atualizarListaProdutos === 'function') {
    window.opener.atualizarListaProdutos();
  }

  alert('Produto cadastrado com sucesso!');
  window.close(); // Fecha a janela de cadastro
}
