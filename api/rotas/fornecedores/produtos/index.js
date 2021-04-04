const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const c = require('config')

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.fornecedor.id)
    response.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (request, response, proximo) => {
    try {
        const idFornecedor = request.fornecedor.id
        const body = request.body
        const dados = Object.assign({}, body,  {fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        response.status(201)
        response.send(produto)
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (request, response) => {
    const dados = {
        id: request.params.id,
        fornecedor: request.fornecedor.id
    }
    const produto = new Produto(dados)
    await produto.apagar()
    response.status(204)
    response.end()
})

module.exports = roteador