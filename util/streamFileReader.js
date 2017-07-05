var fs = require('fs');

fs.createReadStream('img_teste.jpg')
    .pipe(fs.createWriteStream('imgWithStream.jpg'))
    .on('finish', function(){
        console.log('arquivo escrito com stream');
    });