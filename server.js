const http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => {
    var addr = request.url,
        q = url.parse(addr, true),
        filePath = '';

    // SETS THE FILEPATH OF FILE TO BE READ AND SENT BACK
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    // LOGS THE REQUEST URL AND TIMESTAMP TO log.txt FILE
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Added to log.');
        }
    });

    // READS THE FILE AT THE GIVEN FILEPATH AND SETS RESULTS TO 'data'
    fs.readFile(filePath, function (err, data) {
        if (err) {
            throw err;
        }

        // AFTER READING FILE, CALLBACK WRITES HEAD AND BODY TO SEND BACK
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();

    });

}).listen(8080);