var http = require('http');
var buffer = require('buffer').Buffer;
var port = process.env.PORT || 8080;
//create a server object:
http.createServer(function (req, res) {
    var objekt;
    var toSendMessage;
    var inComeMessage;
    var str = '';

    var body = [];
    req.on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        body = buffer.concat(body).toString();
        str = body.toString();
        objekt = JSON.parse(str);
        inComeMessage = objekt.message;
        toSendMessage = {
            "method": 'sendMessage',
            "chat_id": inComeMessage.chat.id.toString(),
            "text": "hvatit mne pisat"
        }
        console.log(inComeMessage.chat.id.toString())
        res.write(JSON.stringify(toSendMessage));
        console.log(JSON.stringify(toSendMessage))
        res.end();
    });

    // at this point, `body` has the entire request body stored in it as a string
}).listen(port); //the server object listens on port 8080
