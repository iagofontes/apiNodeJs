var restify = require('restify');

function ClienteCartoes(){
    this._cliente = restify.createJsonClient({
        url: "http://localhost:3001"
    });
}

ClienteCartoes.prototype.autoria = function(cartao, callback){
    this._cliente.post('/cartoes/autoriza', function(err, req, resp, result){
        console.log('consumindo serviço externo.');
        console.log(result);
    });
}

module.exports = function(){
    return ClienteCartoes;
}