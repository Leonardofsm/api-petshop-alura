const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.send(
        JSON.stringify(resultados)
    )
})

roteador.post('/', async (requisicao, resposta) => {
    const dadosRecebidos = requisicao.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()
    resposta.send(
        JSON.stringify(fornecedor)
    )
})

roteador.get('/:idFornecedor', async (request, response) => {
        try {
            const id = request.params.idFornecedor
            const fornecedor = new Fornecedor({ id: id })
            await fornecedor.carregar()
                response.send(
                    JSON.stringify(fornecedor)
                )
        } catch (erro) {
            response.send(
                JSON.stringify({
                    mensagem: erro.message
                })
            )
        }
})

roteador.patch('/:idFornecedor', async (request, response) => {
    try{
        const id = request.params.idFornecedor
        const dadosRecebidos = request.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        response.end()
    } catch (erro) {
        response.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
})

module.exports = roteador