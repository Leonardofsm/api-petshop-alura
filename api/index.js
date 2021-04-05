const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((request, response, proximo) => {
    let formatoRequisitado = request.header('Accept')

    if(formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }
    if(formatosAceitos.indexOf(formatoRequisitado) === -1){
        response.status(406)
        response.end()
        return
    }

    response.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

// TODO - Liberar cors no nodejs
// app.use((response, request, proximo) => {
//     response.set('Access-Control-Allow-Origin', '*')
//     proximo()
// })

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

app.use((erro, request, response, proximo) => {
    let status = 500

    if(erro instanceof NaoEncontrado) {
        status = 404
    } 

    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }

    if(erro instanceof ValorNaoSuportado){
        status = 406
    }
    const serializador = new SerializadorErro(
        response.getHeader('Content-Type')
    )
    response.status(status)
    response.send(
        serializador.serializar({
            id: erro.idErro,
            mensagem: erro.message
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('A API está funcionando!'))