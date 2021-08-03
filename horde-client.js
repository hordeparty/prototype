const socket = io("ws://localhost:3000/clients");
let simplePeer = null;

let room = new URL(window.location.href).searchParams.get('room');
if (!room) {
    room = "123";
}
socket.emit('joinRoom', room);

socket.on('serverOffer', function (packet) {
    if (simplePeer == null) {
        simplePeer = new SimplePeer({
            initiator: false,
            trickle: false
        });
        simplePeer.on('error', err => console.log(err));
        simplePeer.on('signal', (data) => {
            socket.emit('clientAnswer', data);
        });
        simplePeer.on('stream', stream => {
            let receiverVideo = document.getElementById("receiver-video");
            receiverVideo.srcObject = stream;
        });
    }
    simplePeer.signal(packet);
});

const connect = () => {
    let playerName = document.getElementById("playerName").value;
    socket.emit('clientHello', playerName);
}

//gamepad

class KeyGamePad {
    y = "KeyZ";
    x = "KeyS";
    b = "KeyX";
    a = "KeyD";
    l = "KeyA";
    r = "KeyF";
    select = "Shift";
    start = "Enter";
    up = "ArrowUp";
    down = "ArrowDown";
    left = "ArrowLeft";
    right = "ArrowRight";

    getButton(eventKey) {
        return Object.keys(this).find(key => this[key] === eventKey);
    }
}

let gamePadLayout = 'keys';
const gamePads = new Map();
gamePads.set(gamePadLayout, new KeyGamePad());

class GamepadEvent {
    type = null;
    button = null;

    constructor(type, button) {
        this.type = type;
        this.button = button;
    }
}

const sendGamePadEvent = (gamePadEvent) => {
    if (simplePeer != null) {
        let gamePad = gamePads.get(gamePadLayout);
        let gamePadButton = gamePad.getButton(gamePadEvent.button);
        if (typeof gamePadButton !== 'undefined') {
            let keyEvent = {
                type: gamePadEvent.type,
                button: gamePadButton
            };
            //console.log(keyEvent);
            simplePeer.send(JSON.stringify(keyEvent));
        }
    }
};

document.addEventListener('keydown', (event) => {
    sendGamePadEvent(new GamepadEvent('keydown', event.code));
});

document.addEventListener('keyup', (event) => {
    sendGamePadEvent(new GamepadEvent('keyup', event.code));
});

const setGamePadLayout = (obj) => {
    gamePadLayout = $(obj).val();
}
