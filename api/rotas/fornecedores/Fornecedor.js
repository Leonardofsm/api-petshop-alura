const TabelaFornecedor = require('./TabelaFornecedor')

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCricao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this. email = email
        this.categoria = categoria 
        this.dataCricao = dataCricao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })
        this.id = resultado.id
        this.dataCricao = resultado.dataCricao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }
}

module.exports = Fornecedor