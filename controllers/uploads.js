var fs = require('fs');

module.exports = function(app){

    app.post('/upload/image', function(req, resp){

        var filename = req.headers.filename;
        // console.log(filename);
        req.pipe(fs.createWriteStream('uploads/'+filename+'.jpg'))
            .on('finish', function(){
                console.log('upload finalizado.');
                resp.status(201).send('ok');
            });
    });


}