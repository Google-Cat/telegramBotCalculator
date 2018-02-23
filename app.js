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
        res.writeHead(200, {'Content-Type': 'application/json'});
        body = buffer.concat(body).toString();
        str = body.toString();
        objekt = JSON.parse(str);
        inComeMessage = objekt.message;

        if (inComeMessage.text.toString() === "/start") {
            toSendMessage = {
                "method": 'sendMessage',
                "chat_id": inComeMessage.chat.id.toString(),
                "text": '',
                "reply_markup": {
                    'keyboard': [['AC', '+', '-'], ['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['', '0', '']],
                    'resize_keyboard': true,
                    'one_time_keyboard': true
                }
            };
        } else
            toSendMessage = {
                "method": 'sendMessage',
                "chat_id": inComeMessage.chat.id.toString(),
                "text": 'Не пиши мне ничего'
            };
        res.write(JSON.stringify(toSendMessage));
        res.end();
    });
}).listen(port); //the server object listens on port 8080
