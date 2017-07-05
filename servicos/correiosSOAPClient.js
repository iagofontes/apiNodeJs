var soap = require('soap');

function CorreiosSOAPClient(){
    this._url = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl";
}

CorreiosSOAPClient.prototype.calcularPrazo = function(args, callback){

    soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl',
        function(err, cliente){
            console.log('Cliente soap criado normalmente, corretamente.');
            cliente.CalcPrazo(args,callback);
        });
}

module.exports = function(){
    return CorreiosSOAPClient;
}
