
module.exports = function(app){
    
    app.get('/pagamentos', function(req, resp){
        resp.send('Rota de pagamento atingida.');
    });

    app.put('/pagamentos/pagamento/:id', function(req, resp){

        var id = req.params.id;

        var conn = app.persistencia.ConnectionFactory();
        var pagamento = {id: id, status: "FINALIZADO"};

        var pagamentoDao = new app.persistencia.PagamentoDAO(conn);
        pagamentoDao.atualiza(pagamento, function(err, result){
            if(err){
                console.log(err);
                resp.status(500).send(err);
                return;
            }
            resp.status(200).send('Pagamento alterado.');
            return;
        });

    });


    app.post('/pagamentos/pagamento', function(req, resp){

        req.assert("status", "Status deve ser preenchido").notEmpty();
        req.assert("valor", "Valor deve ser preenchido e maior que 0")
            .notEmpty()
            .isFloat();
        
        var erros = req.validationErrors();

        if(erros){
            console.log('Problemas com validação. Erros: '+erros);
            resp.status(400).send(erros);
            return;
        }

        var pagamento = req.body;
        var conn = app.persistencia.ConnectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDAO(conn);

        pagamento.data = new Date;
        pagamentoDao.salva(pagamento, function(err, result){
            if(err){
                console.log('Problemas ao realizar a inserção. '+err);
                resp.status(500).send(err);
            }else{
                res.location('/pagamentos/pagamento/'+
                    result.insertId);
                resp.status(201).json(pagamento);
            }
        });
    });

}