module.exports = function(app){

    app.post('/correios/calcularPrazo', function(req, resp){
        // console.log('rota atingida.');
        var CorreiosSOAPClient = new app.servicos.correiosSOAPClient();
        var args = req.body;
        CorreiosSOAPClient.calcularPrazo(args, function(err, resultado){
            resp.status(200).send(JSON.stringify(resultado));
        });
    });

}