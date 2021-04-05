const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (request, response) => {
    response.set('Access-Control-Allow-Methods', 'GET')
    response.set('Access-Control-Allow-Headers', 'Content-Type')
    response.status(204)
    response.end()
})

roteador.get('/', async (request, response) => {
    try{
        const resultados = await TabelaFornecedor.listar()
        response.status(200)
        const serializador = new SerializadorFornecedor(
            response.getHeader('Content-Type')
        )
        response.send(
            serializador.serializar(resultados)
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


module.exports = roteador