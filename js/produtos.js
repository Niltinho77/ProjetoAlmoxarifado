function atualizarListaProdutos() {
    const listaProdutos = document.getElementById('listaProdutos');
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  
    if (produtos.length > 0) {
      let conteudo = '<ul>';
      produtos.forEach((produto, index) => {
        conteudo += `<li>Código: ${produto.codigo}, Nome: ${produto.nome}, Estoque: ${produto.entrada - produto.saida} <button onclick="removerProduto(${index})">Remover</button></li>`;
      });
      conteudo += '</ul>';
      listaProdutos.innerHTML = conteudo;
    } else {
      listaProdutos.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    }
  }
  
  function removerProduto(index) {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    if (produtos.length > 0 && index >= 0 && index < produtos.length) {
      // Confirmação antes de remover
      const confirmacao = confirm(`Tem certeza que deseja remover o produto ${produtos[index].nome}?`);
      if (confirmacao) {
        produtos.splice(index, 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        atualizarListaProdutos(); // Atualiza a lista na página principal
      }
    }
  }
  