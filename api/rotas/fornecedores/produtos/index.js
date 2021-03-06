const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const SerializadorProduto = require('../../../Serializador').SerializadorProduto

roteador.options('/', (request, response) => {
    response.set('Access-Control-Allow-Methods', 'GET', 'POST')
    response.set('Access-Control-Allow-Headers', 'Content-Type')
    response.status(204)
    response.end()
})

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.fornecedor.id)
    const serializador = new SerializadorProduto(
        response.getHeader('Content-Type')
    )
    response.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (request, response, proximo) => {
    try {
        const idFornecedor = request.fornecedor.id
        const body = request.body
        const dados = Object.assign({}, body,  {fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new SerializadorProduto(
            response.getHeader('Content-Type')
        )
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        response.status(201)
        response.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id', (request, response) => {
    response.set('Access-Control-Allow-Methods', 'DELETE', 'GET', 'HEAD', 'PUT')
    response.set('Access-Control-Allow-Headers', 'Content-Type')
    response.status(204)
    response.end()
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

roteador.get('/:id', async (request, response, proximo) => {
    try{
        const dados = {
            id: request.params.id,
            fornecedor: request.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new SerializadorProduto(
            response.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.head('/:id', async (request, response, proximo) => {
    try{
        const dados = {
            id: request.params.id,
            fornecedor: request.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(200)
        response.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async (request, response, proximo) => {
    try{
        const dados = Object.assign(
            {},
            request.body,
            {
                id: request.params.id,
                fornecedor: request.fornecedor.id
            }
        )
        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(204)
        response.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id/diminuir-estoque', (request, response) => {
    response.set('Access-Control-Allow-Methods', 'POST')
    response.set('Access-Control-Allow-Headers', 'Content-Type')
    response.status(204)
    response.end()
})

roteador.post('/:id/diminuir-estoque', async (request, response, proximo) => {
    try{
        const produto = new Produto({
            id: request.params.id,
            fornecedor: request.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - request.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(204)
        response.end()
    } catch(erro) {
        proximo(erro)
    }

})

module.exports = roteador