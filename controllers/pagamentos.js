
module.exports = function(app){
    
    app.get('/pagamentos', function(req, resp){
        resp.send('Rota de pagamento atingida.');
    });

    app.post('/pagamentos/pagamento', function(req, resp){

        var pagamento = req.body;
        var conn = app.persistencia.ConnectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDAO(conn);

        pagamento.data = new Date;
        pagamentoDao.salva(pagamento, function(err, result){
            if(err){
                resp.send(err);
            }else{
                resp.json(pagamento);
            }
        });
    });

}