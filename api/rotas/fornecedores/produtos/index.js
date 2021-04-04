const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.params.idFornecedor)
    response.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (request, response) => {
    const idFornecedor = request.params.idFornecedor
    const body = request.body

    const dados = Object.assign({}, body,  {fornecedor: idFornecedor})
    const produto = new Produto(dados)
    await produto.criar()
    response.status(201)
    response.send(produto)
})

module.exports = roteador