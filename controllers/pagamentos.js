
module.exports = function(app){
    app.get('/pagamentos', function(req, resp){
        resp.send('Rota de pagamento atingida.');
    });
}