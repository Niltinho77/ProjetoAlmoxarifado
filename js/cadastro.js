function cadastrarProduto() {
  // Obtém o valor do campo 'código' do formulário, removendo espaços em branco do início e do fim
  let codigo = document.getElementById('codigo').value.trim();
  
  // Obtém o valor do campo 'nome' do formulário, removendo espaços em branco do início e do fim
  let nome = document.getElementById('nome').value.trim();
  
  // Carrega a lista atual de produtos do localStorage, ou inicializa como uma lista vazia se não existir
  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

  // Verifica se já existe um produto cadastrado com o mesmo código
  let produtoExistente = produtos.find(produto => produto.codigo === codigo);

  // Se um produto com o mesmo código já existir, exibe um alerta e interrompe a função
  if (produtoExistente) {
    alert('Um produto com este código já está cadastrado.');
    return; // Interrompe a execução da função
  }

  // Cria um objeto representando o novo produto
  let novoProduto = {
    codigo: codigo,
    nome: nome,
    entrada: 0, // Quantidade de entrada inicializada como 0
    saida: 0    // Quantidade de saída inicializada como 0
  };

  // Adiciona o novo produto à lista de produtos
  produtos.push(novoProduto);
  
  // Atualiza a lista de produtos no localStorage com o novo produto adicionado
  localStorage.setItem('produtos', JSON.stringify(produtos));

  // Se a janela principal estiver aberta e a função atualizarListaProdutos existir, chama essa função para atualizar a lista de produtos
  if (window.opener && typeof window.opener.atualizarListaProdutos === 'function') {
    window.opener.atualizarListaProdutos();
  }

  // Exibe um alerta de sucesso e fecha a janela de cadastro
  alert('Produto cadastrado com sucesso!');
  window.close();
}
