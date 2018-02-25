var HashMap = require('hashmap');
var http = require('http');
var buffer = require('buffer').Buffer;
var port = process.env.PORT || 8080;
var userInfoMap = new HashMap();

function UserInfo(ss) {
    this.currentString = '0';
    this.savedString = ss;
    this.lastCommand = "";
}

//create a server object:
function editCurrentString(chatId, str) {
    if (userInfoMap.get(chatId).currentString === '0') {
        userInfoMap.get(chatId).currentString = str;
    }
    else userInfoMap.get(chatId).currentString += str;
}

http.createServer(function (req, res) {
    var objekt;
    var command;
    var keyboard_keys = {
        'inline_keyboard': [[{"text": 'AC', "callback_data": "reset"}, {
            "text": '+',
            "callback_data": "plus"
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
            [{"text": '0', "callback_data": 0}, {"text": '=', "callback_data": 'answer'}]]
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
                        "text": "0",
                        "reply_markup": keyboard_keys
                    };
                    userInfoMap.set(inComeMessage.chat.id, new UserInfo("0"))
                } else
                    command = {
                        "method": 'sendMessage',
                        "chat_id": inComeMessage.chat.id.toString(),
                        "text": 'Не пиши мне ничего'
                    };
            }
        } else {
            if ((query.data !== "minus") & (query.data !== "reset" ) && ( query.data !== "plus") && (query.data !== 'answer')) {
                editCurrentString(query.message.chat.id, query.data);
            } else if ((query.data === "minus") || (query.data === "plus")) {
                userInfoMap.get(query.message.chat.id).savedString = userInfoMap.get(query.message.chat.id).currentString;
                userInfoMap.get(query.message.chat.id).currentString = '0';
                userInfoMap.get(query.message.chat.id).lastCommand = query.data;
            } else if ((query.data === 'answer')) {
                if (userInfoMap.get(query.message.chat.id).lastCommand === "minus") {
                    userInfoMap.get(query.message.chat.id).currentString = (parseInt(userInfoMap.get(query.message.chat.id).savedString) - parseInt(userInfoMap.get(query.message.chat.id).currentString));
                } else if (userInfoMap.get(query.message.chat.id).lastCommand === "plus") {
                    userInfoMap.get(query.message.chat.id).currentString = (parseInt(userInfoMap.get(query.message.chat.id).savedString) + parseInt(userInfoMap.get(query.message.chat.id).currentString));
                }
            } else if (query.data === 'reset') {
                userInfoMap.get(query.message.chat.id).currentString = '0';
            }
            command = {
                "method": "editMessageText",
                "chat_id": query.message.chat.id,
                "message_id": query.message.message_id,
                "text": userInfoMap.get(query.message.chat.id).currentString,
                "reply_markup": keyboard_keys
            };
        }
        res.write(JSON.stringify(command));
        res.end();
    });
}).listen(port); //the server object listens on port 8080
