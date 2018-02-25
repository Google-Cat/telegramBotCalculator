var http = require('http');
var buffer = require('buffer').Buffer;
var port = process.env.PORT || 8080;
var currentString = '0';
var savedString;
var lastCommand;

//create a server object:
function editCurrentString(str) {
    if (currentString === '0') {
        currentString = str;
    }
    else currentString += str;
    return currentString;
}

http.createServer(function (req, res) {
    var objekt;
    var command;
    var keyboard_keys = {
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
            [{"text": '0', "callback_data": 0}, {"text": '=', "callback_data": 'ravno'}]]
    };
    var inComeMessage;
    var query;
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
        query = objekt.callback_query;
        if (query === undefined) {
            if (inComeMessage.text !== undefined) {
                console.log(inComeMessage.text.toString());
                if (inComeMessage.text.toString() === "/start") {
                    command = {
                        "method": 'sendMessage',
                        "chat_id": inComeMessage.chat.id.toString(),
                        "text": currentString,
                        "reply_markup": keyboard_keys
                    };
                } else
                    command = {
                        "method": 'sendMessage',
                        "chat_id": inComeMessage.chat.id.toString(),
                        "text": 'Не пиши мне ничего'
                    };
            }
        } else {
            if ((query.data !== "minus") & (query.data !== "reset" ) && ( query.data !== "summ") && (query.data !== 'ravno')) {
                editCurrentString(query.data);
                command = {
                    "method": "editMessageText",
                    "chat_id": query.message.chat.id,
                    "message_id": query.message.message_id,
                    "text": currentString,
                    "reply_markup": keyboard_keys
                };
            } else if ((query.data === "minus") || (query.data === "summ")) {
                savedString = currentString;
                currentString = '0';
                lastCommand = query.data;
            } else if ((query.data === 'ravno')) {
                if (lastCommand === "minus") {
                    editCurrentString(parseInt(savedString) - parseInt(currentString));
                } else editCurrentString(parseInt(savedString) + parseInt(currentString));
            }
            console.log(command.method, command.message_id, currentString);
        }
        res.write(JSON.stringify(command));
        res.end();
    });
}).listen(port); //the server object listens on port 8080
