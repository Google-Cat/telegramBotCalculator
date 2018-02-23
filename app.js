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
        console.log(inComeMessage.text.toString());
        if (inComeMessage.text.toString() === "/start") {
            toSendMessage = {
                "method": 'sendMessage',
                "chat_id": inComeMessage.chat.id.toString(),
                "text": 'Вот тебе твоя клава!',
                "reply_markup": {
                    'inline_keyboard': [[{"text": 'AC', "callback_data": "reset"}, {
                        "text": '+',
                        "callback_data": "summ"
                    }, {"text": '-', "callback_data": "minus"}],
                        [{"text": '7', "callback_data": 7}, {"text": '8', "callback_data": 8}, {
                            "text": '9',
                            "callback_data": 9
                        }],
                        [{"text": '4', "callback_data": 4}, {"text": '5', "callback_data": 5}, {
                            "text": '6',
                            "callback_data": 6
                        }],
                        [{"text": '1', "callback_data": 1}, {"text": '2', "callback_data": 2}, {
                            "text": '3',
                            "callback_data": 3
                        }],
                        [{"text": '0', "callback_data": 0}]]
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
