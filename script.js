let carrinho=[];
let paginaAtual=1;
let itensPorPagina=6;
let categoriaAtual="todos";

/* LOGIN */
function entrarCliente(){
    telaLogin.style.display="none";
    loja.style.display="block";
}

function loginVendedor(){
    if(usuario.value==localStorage.user && senha.value==localStorage.pass){
        telaLogin.style.display="none";
        loja.style.display="block";
        localStorage.tipo="vendedor";
    }else alert("Erro");
}

function criarConta(){
    localStorage.user=usuario.value;
    localStorage.pass=senha.value;
    alert("Conta criada");
}

function sair(){
    loja.style.display="none";
    telaLogin.style.display="flex";
}

/* TOAST */
function toast(msg){
    let t=document.getElementById("toast");
    t.innerText=msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2000);
}

/* PRODUTOS */
function mostrar(lista){
    produtos.innerHTML="";

    lista.forEach(p=>{
        produtos.innerHTML+=`
        <div class="produto">
            <img src="${p.imagem}">
            <p>${p.nome}</p>
            <p>R$${p.preco}</p>

            <button onclick="add('${p.nome}',${p.preco})">🛒</button>
            <button onclick="fav('${p.nome}')">❤️</button>
        </div>`;
    });
}

function carregar(){
    let lista=JSON.parse(localStorage.produtos||"[]");

    if(categoriaAtual!="todos"){
        lista=lista.filter(p=>p.categoria==categoriaAtual);
    }

    let inicio=(paginaAtual-1)*itensPorPagina;
    let fim=inicio+itensPorPagina;

    mostrar(lista.slice(inicio,fim));

    paginacao.innerHTML="";
    for(let i=1;i<=Math.ceil(lista.length/itensPorPagina)&&i<=9;i++){
        paginacao.innerHTML+=`<button onclick="pagina(${i})">${i}</button>`;
    }
}

/* BUSCA */
function buscarProduto(){
    let termo=busca.value.toLowerCase();
    let lista=JSON.parse(localStorage.produtos||"[]");
    lista=lista.filter(p=>p.nome.toLowerCase().includes(termo));
    mostrar(lista);
}

/* ORDENAR */
function ordenar(tipo){
    let lista=JSON.parse(localStorage.produtos||"[]");

    if(tipo=="menor") lista.sort((a,b)=>a.preco-b.preco);
    if(tipo=="maior") lista.sort((a,b)=>b.preco-a.preco);

    mostrar(lista);
}

/* CATEGORIA */
function filtrarCategoria(cat){
    categoriaAtual=cat;
    paginaAtual=1;
    carregar();
}

/* PAGINA */
function pagina(p){
    paginaAtual=p;
    carregar();
}

/* CARRINHO */
function add(n,p){
    carrinho.push({n,p});
    atualizarCarrinho();
    toast("Adicionado 🛒");
}

function atualizarCarrinho(){
    lista.innerHTML="";
    let total=0;

    carrinho.forEach((i,x)=>{
        lista.innerHTML+=`${i.n} R$${i.p} <button onclick="rem(${x})">X</button><br>`;
        total+=i.p;
    });

    contador.innerText=carrinho.length;
    totalEl=document.getElementById("total");
    totalEl.innerText=total;
}

function rem(i){
    carrinho.splice(i,1);
    atualizarCarrinho();
}

/* PAGAMENTO */
function pagarPix(){
    pagamentoBox.innerHTML="Pix: loja@pix.com <button onclick='finalizar()'>OK</button>";
}

function pagarCartao(){
    pagamentoBox.innerHTML="<input placeholder='cartao'><button onclick='finalizar()'>Pagar</button>";
}

function finalizar(){
    let pedidos=JSON.parse(localStorage.pedidos||"[]");
    pedidos.push(carrinho);
    localStorage.pedidos=JSON.stringify(pedidos);
    carrinho=[];
    atualizarCarrinho();
    toast("Compra feita!");
}

/* FAVORITO */
function fav(nome){
    let f=JSON.parse(localStorage.fav||"[]");
    if(!f.includes(nome)){
        f.push(nome);
        localStorage.fav=JSON.stringify(f);
        toast("Favorito ❤️");
    }
}

/* PAINEL */
function abrirPainel(){
    if(localStorage.tipo=="vendedor"){
        painel.classList.add("ativo");
        atualizarPainel();
    }else alert("Só vendedor");
}

function fecharPainel(){
    painel.classList.remove("ativo");
}

function adicionarProduto(){
    let reader=new FileReader();

    reader.onload=e=>{
        let lista=JSON.parse(localStorage.produtos||"[]");

        lista.push({
            nome:nome.value,
            preco:Number(preco.value),
            categoria:categoria.value,
            imagem:e.target.result
        });

        localStorage.produtos=JSON.stringify(lista);
        carregar();
    }

    reader.readAsDataURL(imagem.files[0]);
}

function atualizarPainel(){
    let lista=JSON.parse(localStorage.produtos||"[]");
    listaPainel.innerHTML="";

    lista.forEach((p,i)=>{
        listaPainel.innerHTML+=`${p.nome} <button onclick="removerProduto(${i})">X</button><br>`;
    });
}

function removerProduto(i){
    let lista=JSON.parse(localStorage.produtos);
    lista.splice(i,1);
    localStorage.produtos=JSON.stringify(lista);
    carregar();
    atualizarPainel();
}

window.onload=carregar;