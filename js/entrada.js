function darEntrada() {
  let codigo = document.getElementById('codigoEntrada').value;
  let quantidade = parseInt(document.getElementById('quantidadeEntrada').value, 10);
  let data = new Date().toISOString().slice(0, 10); // Obtém a data atual no formato YYYY-MM-DD

  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  let produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    if (!produto.entradas) produto.entradas = [];
    produto.entradas.push({ data: new Date().toISOString().slice(0, 10), quantidade: quantidade });
    produto.entradaTotal = (produto.entradaTotal || 0) + quantidade; // Atualiza o total de entrada
    localStorage.setItem('produtos', JSON.stringify(produtos));

   alert('Entrada de produto registrada com sucesso!');
    window.close();
  } else {
    alert("Produto não encontrado.");
  }
}
