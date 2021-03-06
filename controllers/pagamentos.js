var logger = require('../servicos/logger.js');
module.exports = function(app){
    
    app.get('/pagamentos', function(req, resp){
        resp.send('Rota de pagamento atingida.');
    });

    app.get('/pagamentos/pagamento/:id', function(req, resp){
        var id = req.params.id;
        var memcached = app.servicos.memcachedClient();
        memcached.get('pagamento-'+id, function(erro, retorno){
            if(erro || !retorno){
                var conn = app.persistencia.ConnectionFactory();
                var pagamentoDao = new app.persistencia.PagamentoDAO(conn);
                pagamentoDao.buscarPorId(id, function(error, resultado){
                    if(error){
                        console.log('problemas. Error: '+error);
                        resp.status(500).send(error);
                        return;
                    }
                    console.log('Dados do pagamento: '+JSON.stringify(resultado));
                    resp.status(200).json(resultado);
                    return;
                });
            }else{
                //conseguiu pesquisar no cache
                resp.status(200).json(retorno);
                return;
            }
        });
    });

    app.delete('/pagamentos/pagamento/:id', function(req, resp){

        var id = req.params.id;

        var conn = app.persistencia.ConnectionFactory();
        var pagamento = {id: id, status: "CANCELADO"};
        var flag = 0;

        var pagamentoDao = new app.persistencia.PagamentoDAO(conn);
        pagamentoDao.atualiza(pagamento, function(err, result){
            if(err){
                console.log(err);
                resp.status(500).send(err);
                return;
            }
            console.log("pagamento atualizado.");
            var retorno = {status: 'Pagamento cancelado'};
            resp.status(204).json(retorno);
            // resp.status(204).send('Pagamento cancelado.');
            return;
            // flag = 1;
        });

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
        var memcached = app.servicos.memcachedClient();

        pagamento.data = new Date;
        pagamentoDao.salva(pagamento, function(err, result){
            if(err){
                console.log('Problemas ao realizar a inserção. '+err);
                resp.status(500).send(err);
            }else{
                pagamento.id = result.insertId;
                resp.location('/pagamentos/pagamento/'+ pagamento.id);

                var response = {
                    dados_pagamento: pagamento,
                    links: [{
                        rel: "confirmar",
                        method: "PUT",
                        url:"/pagamentos/pagamento/"+pagamento.id
                    },
                    {
                        rel: "cancelar",
                        method: "DELETE",
                        url:"/pagamentos/pagamento/"+pagamento.id
                    }]
                };
                memcached.set('pagamento-'+pagamento.id, pagamento, 60000, function(error){
                    if(error){
                        console.log('errorMemcachedSet : '+error);
                    }
                });
                resp.status(201).json(response);
            }
        });
    });

}