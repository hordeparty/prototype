const socket = io("ws://localhost:3000/servers");
const clients = new Map();

let room = new URL(window.location.href).searchParams.get('room');
if (!room) {
    room = "123";
}
socket.emit('joinRoom', room);


let gamePadButtons = {
    right: 1,
    left: 2,
    down: 3,
    up: 4,
    start: 5,
    select: 6,
    a: 7,
    b: 8,
    x: 9,
    y: 10,
    l: 11,
    r: 12,
    getButtonNumber: function (button, controle) {
        let controleCalc = (controle - 1) * 12;
        return gamePadButtons[button] + controleCalc + 91337;
    }
};

class Client {
    socketId = null;
    name = null;
    simplePeer = null;
    controller = 0;

    constructor(socketId, name, controller) {
        this.socketId = socketId;
        this.name = name;
        this.controller = controller;
        this.simplePeer = new SimplePeer({
            initiator: true,
            stream: this.getStreamVideo(),
            trickle: false
        });
        this.bindEvents();
    }

    getStreamVideo() {
        return document.getElementById('emulator-video').captureStream();
    }

    updateStream() {
        this.simplePeer.addStream(this.getStreamVideo());
    }

    bindEvents() {
        this.simplePeer.on('error', err => console.log(err));
        this.simplePeer.on('signal', (data) => {
            socket.emit('serverOffer', this.socketId, data);
            this.simplePeer.on('data', (data) => {
                let dataObj = JSON.parse(data);
                let moduleKey = gamePadButtons.getButtonNumber(dataObj.button, this.controller);
                if (dataObj.type === "keydown") {
                    // console.log("keydown " + dataObj.button);
                    Module._press(moduleKey);
                } else if (dataObj.type === "keyup") {
                    // console.log("keyup " + dataObj.button);
                    Module._depress(moduleKey);
                }
            });
        });
    }
}

let msgIn = {
    from: null,
    msg: null
};

socket.on('clientHello', msgHelloIn => {
    let msgIn = msgHelloIn;
    let controller = clients.size + 1;
    let client = new Client(msgIn.from, msgIn.msg, controller);
    let playerName = client.name;
    clients.set(msgIn.from, client);
    $("#tbodyJogadores").append(`<tr id="tr${msgIn.from}">
<td>${playerName}</td>
<td><select id="${msgIn.from}" value="${controller}" onchange="changeController($(this));">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
</select></td>
<td>OFFLINE</td>
</tr>`);
    $(`#${msgIn.from}`).val(controller);
});

socket.on('clientAnswer', msgAnswerIn => {
    let msgIn = msgAnswerIn;
    clients.get(msgIn.from).simplePeer.signal(msgIn.msg);
    $(`#tr${msgIn.from}`).children().get(2).innerHTML = "<b>ONLINE</b>";
});

const updateClientStream = () => {
    clients.forEach(function (client) {
        client.updateStream();
    })
}

const changeController = (controllerSelect) => {
    let client = clients.get(controllerSelect.attr('id'));
    client.controller = controllerSelect.val();
}