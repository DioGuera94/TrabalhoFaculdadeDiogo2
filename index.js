//Esta aplicação WEB será desenvolvida com o auxílio da biblioteca/módulo [Express](https://expressjs.com/).
//Express é um framework web para desenvolvimento de aplicações web.
//O framework Express foi desenvolvido com o objetivo de simplificar o desenvolvimento de aplicações web.
//A complexidade de programar o protocolo HTTP é diminuida com a ajuda do framework Express.
//Para não reinventar a roda.... vamos instalar o Express.
//No terminal executar o comando: npm install express
//No formato CommonJS --> const express = require("express");

import express from "express";

const host = "0.0.0.0"; //todas as interfaces de rede do computador
const porta = 3000; //identifica a nossa aplicação como sendo a 3000

const app = express(); //aplicação servidora web que se comunica utilizando o HTTP

function paginaInicial(requisicao, resposta) {
    resposta.send(`<h1>Seja bem vindo!</h1> 
                   <br/> 
                   <h2>Primeiros passos para desenvolvimento de aplicação web com Node/JS</h2>
                   <h3>Página inicial</h3>
        `);
}            //   ----> A função paginaInicial não é chamada, ele é passada como parâmetro
             //   |
app.get("/", paginaInicial);  //http://localhost:3000/ <== é a raiz da aplicação

function mostrarSobre(requisicao, resposta) {
    resposta.write(`<html>`)
    resposta.write(`<head>
                        <meta charset="UTF-8">
                        <title>Sobre</title>
                    </head>
                    <body>`);
    resposta.write(`<h1>Sobre nós</h1> `);
    resposta.write(`<p>Sou Diogo da Silva Floriano, um desenvolvedor iniciante.</p>`);
    resposta.write(`<p>Estou aprendendo a programar em JavaScript para oferecer aos meus clientes as melhores soluções em aplicações para a Internet.</p>`);
    resposta.write(`<p>Envie uma doação para o meu e-mail: 3t6fY@example.com</p>`);
    resposta.write(`<p>Adote um programador.</p>`);
    resposta.write(`</body>`)
    resposta.write(`</html>`)
    resposta.end();
}

app.get("/sobre", mostrarSobre);


//implementar uma rota que seja capaz de receber parâmetros na URL
//a requisição deverá informar o valor a ser depositado por meio da url
//exemplo http://localhost:3000/depositar?valor=10
function depositar(requisicao, resposta){
    const valor = requisicao.query.valor;
    if (valor) {
        resposta.write(`<html>
                        <head>
                           <meta charset="UTF-8">
                           <title>Depósito realizado!</title>
                        </head>
                        <body>
                            <h1>Depósito realizado!</h1> 
                            <h1>Valor Depositado: R$ ${valor}</h1> 
                            <h1>Obrigado!</h1>
                        </body>
                        </html>`);
        resposta.end();
    }
    else{
        resposta.write("<html>");
        resposta.write("<head>");
        resposta.write("<meta charset='UTF-8'>");
        resposta.write("</head>");
        resposta.write("<body>");
        resposta.write("<h1>É necessário informar o valor a ser depositado!<h1>");
        resposta.write("Exemplo: http://localhost:3000/depositar?valor=10");
        resposta.write("</body>");
        resposta.write("</html>");
        resposta.end();
    }
}

app.get("/depositar", depositar);

function multiplicar(requisicao, resposta){
    // criar uma página html (resposta) exibindo a faixa de valores
        const valor = parseInt(requisicao.query.valor);
        const final = parseInt(requisicao.query.final);
    
            if (valor > 0 && final > 0 && valor < final){
                resposta.write("<p>Multiplicando...</p>");
                resposta.write("<ul>");
                    for (let i = 1; i <= final; i++){
                const resultado = valor*i;
                resposta.write(`<li>${valor} x ${i} = ${resultado}</li>`);
                }
                resposta.write("</ul>");
                resposta.end();
            }
            else{ 
                resposta.write("<p>Multiplicando...</p>");
                resposta.write("<ul>");
                for (let i = 1; i <= 10; i++){
                    const resultado = valor*i;
                    resposta.write(`<li>${valor} x ${i} = ${resultado}</li>`);
                }
                resposta.write("</ul>");
                resposta.end();
                resposta.write("<p>Informe corretamente o valor e o final se quiser uma tabuada diferente.</p>");
                resposta.write("<p>Exemplo: http://localhost:3000/multiplicar?valor=1&final=10</p>");
    
        }
    }

app.get("/multiplicar", multiplicar);

app.listen(porta, host, () => {    //arrow function ou ainda função de seta
    console.log("Servidor em execução http://" + host + ":" + porta);
});



