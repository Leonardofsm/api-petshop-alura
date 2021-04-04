const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.params.idFornecedor)
    response.send(
        JSON.stringify(produtos)
    )
})

module.exports = roteador