document.addEventListener('DOMContentLoaded', ()=> {
  const produtos = [
    { id: 1, nome: "Tênis Runner Azul", preco: 249.90, img: "imagens/ft.jpeg" },
    { id: 2, nome: "Tênis Casual Branco", preco: 199.90, img: "imagens/ftt.jpeg" },
    { id: 3, nome: "Tênis Esportivo Preto", preco: 299.90, img: "imagens/tenis3.jpg" },
    { id: 4, nome: "Tênis Corrida Verde", preco: 229.90, img: "imagens/tenis4.jpg" }
  ];

  const produtosGrid = document.getElementById('produtosGrid');
  const itensCarrinhoEl = document.getElementById('itensCarrinho');
  const totalValorEl = document.getElementById('totalValor');
  const esvaziarBtn = document.getElementById('esvaziarBtn');
  const finalizarBtn = document.getElementById('finalizarBtn');

  let cart = {};

  function formatBRL(v){
    return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  }

  function renderProdutos(){
    produtosGrid.innerHTML = '';
    produtos.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nome}" onerror="this.src='imagens/placeholder.png'">
        <h3>${p.nome}</h3>
        <div class="preco">${formatBRL(p.preco)}</div>
        <div class="acoes">
          <div>
            <button class="icon-btn favorito" data-id="${p.id}" title="Favoritar">♡</button>
          </div>
          <div>
            <button class="btn primaria add-btn" data-id="${p.id}">Adicionar ao carrinho</button>
          </div>
        </div>
      `;
      produtosGrid.appendChild(card);
    });
  }

  function atualizarFavoritoBtn(btn, active){
    btn.classList.toggle('active', active);
    btn.textContent = active ? '♥' : '♡';
  }

  function renderCarrinho(){
    itensCarrinhoEl.innerHTML = '';
    const ids = Object.keys(cart);
    if(ids.length === 0){
      itensCarrinhoEl.innerHTML = `<div class="empty">Carrinho vazio</div>`;
      totalValorEl.textContent = formatBRL(0);
      return;
    }
    let total = 0;
    ids.forEach(id=>{
      const item = cart[id];
      total += item.preco * item.qtd;
      const node = document.createElement('div');
      node.className = 'item-carrinho';
      node.innerHTML = `
        <img src="${item.img}" alt="${item.nome}" onerror="this.src='imagens/placeholder.png'">
        <div class="item-info">
          <div>${item.nome}</div>
          <div class="inline">
            <button class="btn secundaria diminuir" data-id="${id}">−</button>
            <div class="quant">${item.qtd}</div>
            <button class="btn secundaria aumentar" data-id="${id}">+</button>
            <div style="margin-left:auto;font-weight:700">${formatBRL(item.preco * item.qtd)}</div>
          </div>
        </div>
        <div>
          <button class="btn secundaria remover" data-id="${id}">Remover</button>
        </div>
      `;
      itensCarrinhoEl.appendChild(node);
    });
    totalValorEl.textContent = formatBRL(total);
  }

  function addToCart(prodId){
    const p = produtos.find(x=>x.id==prodId);
    if(!p) return;
    if(cart[prodId]) cart[prodId].qtd++;
    else cart[prodId] = {...p, qtd:1};
    renderCarrinho();
  }

  function removeFromCart(prodId){
    delete cart[prodId];
    renderCarrinho();
  }

  function changeQty(prodId, delta){
    if(!cart[prodId]) return;
    cart[prodId].qtd += delta;
    if(cart[prodId].qtd <= 0) removeFromCart(prodId);
    else renderCarrinho();
  }

  // Delegation para botões
  document.body.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.matches('.add-btn')){
      addToCart(t.dataset.id);
    } else if (t.matches('.favorito')){
      const id = t.dataset.id;
      const active = t.classList.toggle('active');
      atualizarFavoritoBtn(t, active);
      // opcional: salvar favoritos no localStorage
    } else if (t.matches('.remover')){
      removeFromCart(t.dataset.id);
    } else if (t.matches('.aumentar')){
      changeQty(t.dataset.id, 1);
    } else if (t.matches('.diminuir')){
      changeQty(t.dataset.id, -1);
    } else if (t === esvaziarBtn){
      cart = {};
      renderCarrinho();
    } else if (t === finalizarBtn){
      if(Object.keys(cart).length === 0){
        alert('Carrinho vazio.');
      } else {
        alert('Compra finalizada (simulada). Total: ' + totalValorEl.textContent);
        cart = {};
        renderCarrinho();
      }
    }
  });

  // Inicializa
  renderProdutos();
  renderCarrinho();
});
