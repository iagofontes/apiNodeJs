/*var express = require('express');
var app = express();*/
var app = require('./config/custom-express')();

app.listen(3000, function(){
    console.log('Server up');
});

/*app.get('/teste', function(req, resp){
    resp.send('Rota atingida');
});*/