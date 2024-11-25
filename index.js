import express from 'express';

import session from 'express-session';

import cookieParser from 'cookie-parser';


const app = express();

app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./pages/public'));

const porta = 3000;
const host = '0.0.0.0';

var listaProdutos = [];

function cadastroProdutoView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="container text-center">
                    <h1 class="mb-5">Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="border p-3 row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="codigoBarras" class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" id="codigoBarras" name="codigoBarras"  placeholder="Digite o código de barras">
                        </div>
                        <div class="col-md-4">
                            <label for="descricao" class="form-label">Descrição do Produto</label>
                            <input type="text" class="form-control" id="descricao" name="descricao">
                        </div>
                        <div class="col-md-4">
                            <label for="precoCusto" class="form-label">Preço de Custo</label>
                            <input type="text" class="form-control" id="precoCusto" name="precoCusto">
                        </div>
                        <div class="col-md-4">
                            <label for="precoVenda" class="form-label">Preço de Venda</label>
                            <input type="text" class="form-control" id="precoVenda" name="precoVenda">
                        </div>
                        <div class="col-md-4">
                            <label for="dataValidade" class="form-label">Data de Validade</label>
                            <input type="date" class="form-control" id="dataValidade" name="dataValidade">
                        </div>
                        <div class="col-md-4">
                            <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque">
                        </div>
                        <div class="col-md-4">
                            <label for="nomeFabricante" class="form-label">Nome do Fabricante</label>
                            <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante">
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    function formatCurrency(input) {
                        let value = parseFloat(input.value.replace(/,/g, '').replace('R$', ''));
                        if (!isNaN(value)) {
                            input.value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        }
                    }

                    const precoCusto = document.getElementById('precoCusto');
                    const precoVenda = document.getElementById('precoVenda');

                    precoCusto.addEventListener('blur', function() { formatCurrency(precoCusto); });
                    precoVenda.addEventListener('blur', function() { formatCurrency(precoVenda); });
                });
            </script>
        </html>
    `);
}

function menuView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    resp.send(`
        <html>
            <head>
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/cadastrarProduto">Cadastrar Produto</a>
                                <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Logado como: Diogo</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
}

function cadastrarProduto(req, resp) {
    const codigoBarras = req.body.codigoBarras;
    const descricao = req.body.descricao;
    const precoCusto = req.body.precoCusto;
    const precoVenda = req.body.precoVenda;
    const dataValidade = req.body.dataValidade;
    const qtdEstoque = req.body.qtdEstoque;
    const nomeFabricante = req.body.nomeFabricante;

    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }

    if (codigoBarras && descricao && precoCusto && precoVenda && dataValidade && qtdEstoque && nomeFabricante) {
        const produto = { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante };

        listaProdutos.push(produto);

        resp.write(`
        <html>
            <head>
                <title>Lista de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Código de Barras</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Preço de Custo</th>
                        <th scope="col">Preço de Venda</th>
                        <th scope="col">Data de Validade</th>
                        <th scope="col">Qtd em Estoque</th>
                        <th scope="col">Nome do Fabricante</th>
                    </tr>
                </thead>
                <tbody>`);
        for (var i = 0; i < listaProdutos.length; i++) {
            resp.write(`<tr>
                                    <td>${listaProdutos[i].codigoBarras}</td>
                                    <td>${listaProdutos[i].descricao}</td>
                                    <td>${listaProdutos[i].precoCusto}</td>
                                    <td>${listaProdutos[i].precoVenda}</td>
                                    <td>${listaProdutos[i].dataValidade}</td>
                                    <td>${listaProdutos[i].qtdEstoque}</td>
                                    <td>${listaProdutos[i].nomeFabricante}</td>
                                </tr>
                        `);
        }

        resp.write(`</tbody> 
            </table>
            <a class="btn btn-primary" href="/cadastrarProduto">Continuar Cadastrando</a>
            <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
            `);
    } else {
        resp.write(`
            <html>
                <head>
                    <title>Cadastro de Produtos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <meta charset="utf-8">
                </head>
                <body>
                    <div class="container text-center">
                        <h1 class="mb-5">Cadastro de Produtos</h1>
                        <form method="POST" action="/cadastrarProduto" class="border p-3 row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="codigoBarras" class="form-label">Código de Barras</label>
                                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="${codigoBarras}">
        `);
        if (!codigoBarras) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o código de barras!</p></span>
                </div>
                `);
        }
        resp.write(`</div>
                        <div class="col-md-4">
                        <label for="descricao" class="form-label">Descrição do Produto</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}">`);
        if (!descricao) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe a descrição do produto!</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
                <div class="col-md-4">
                    <label for="precoCusto" class="form-label">Preço de Custo</label>
                    <input type="text" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}">
            `);
        if (!precoCusto) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o preço de custo!</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="precoVenda" class="form-label">Preço de Venda</label>
                    <input type="text" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}">
            `);
        if (!precoVenda) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o preço de venda!</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="dataValidade" class="form-label">Data de Validade</label>
                    <input type="date" class="form-control" id="dataValidade" name="dataValidade" value="${dataValidade}">
            `);
        if (!dataValidade) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe a data de validade!</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                    <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" value="${qtdEstoque}">
            `);
        if (!qtdEstoque) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe a quantidade em estoque!</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="nomeFabricante" class="form-label">Nome do Fabricante</label>
                    <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" value="${nomeFabricante}">
            `);
        if (!nomeFabricante) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o nome do fabricante!</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>
        <div class="col-12">
            <button class="btn btn-primary" type="submit">Cadastrar</button>
        </div>
        </form>
    </div>
    <div>
        <p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>
    </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </html> `);
    }

    resp.end();
}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha   = req.body.senha;

    if (usuario === 'Diogo' && senha === '123'){
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect('/');
    }
    else{
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
}

function verificarAutenticacao(req, resp, next){
    if (req.session.usuarioLogado){
        next();
    }
    else
    {
        resp.redirect('/login.html');
    }
}

app.get('/login', (req, resp) =>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.post('/login', autenticarUsuario);
app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarProduto', verificarAutenticacao, cadastroProdutoView);
app.post('/cadastrarProduto', verificarAutenticacao, cadastrarProduto);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});