var restify = require('restify');

var cliente = restify.createJsonClient({
    url: "http://localhost:3001"
});

cliente.post('/cartoes/autoriza', function(err, req, resp, result){
    console.log('consumindo serviço externo.');
    console.log(result);
});