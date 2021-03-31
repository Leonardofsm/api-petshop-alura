const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const { request, response } = require('express')

roteador.get('/', async (request, response) => {
    try{
        const resultados = await TabelaFornecedor.listar()
        response.status(200)
        response.send(
            JSON.stringify(resultados)
        )
    } catch(erro) {
        response.status(404)
        response.send(
            JSON.stringify(
                {mensagem: erro.message}
            )
        )
    }
})

roteador.post('/', async (request, response) => {
    try{
        const dadosRecebidos = request.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        response.status(201)
        response.send(
            JSON.stringify(fornecedor)
        )
    } catch (erro) {
        response.status(400)
        response.send(
            JSON.stringify(
                {mensagem: erro.message}
            )
        )
    }
})

roteador.get('/:idFornecedor', async (request, response) => {
        try {
            const id = request.params.idFornecedor
            const fornecedor = new Fornecedor({ id: id })
            await fornecedor.carregar()
                response.status(200)
                response.send(
                    JSON.stringify(fornecedor)
                )
        } catch (erro) {
            response.status(404)
            response.send(
                JSON.stringify({
                    mensagem: erro.message
                })
            )
        }
})

roteador.put('/:idFornecedor', async (request, response) => {
    try{
        const id = request.params.idFornecedor
        const dadosRecebidos = request.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        response.status(204)
        response.end()
    } catch (erro) {
        response.status(400)
        response.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
})

roteador.delete('/:idFornecedor', async (request, response) => {
    try{
        const id = request.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        await fornecedor.remover()
        response.status(204)
        response.end()
    } catch (erro) {
        response.status(404)
        response.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
})

module.exports = roteador