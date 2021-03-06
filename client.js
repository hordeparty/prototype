let p = null;
let nomeJogador = "";

let sala = new URL(window.location.href).searchParams.get('sala');

$( document ).ready(function() {
  $('#nomeSala').append(`<h1><b>${sala}</b></h1>`);
  if(!sala){
    alert("nome sala invalido");
    $('#nomeSala').append(`<h1><b>SALA INVALIDA</b></h1>`);
  }
});


let keyPadButtons = {
  y: "z",
  x: "s",
  b: "x",
  a: "d",
  l: "a",
  r: "f",
  select: "Shift",
  start: "Enter",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  getButton: function (eventKey) {
    return Object.keys(keyPadButtons).find(key => keyPadButtons[key] === eventKey);
  }
};

// PS4, PS5, Xbox360, XboxOne
class gamePad {
  b = 0;
  a = 1;
  y = 2;
  x = 3;
  l = 4;
  r = 5;
  select = 8;
  start = 9;
  up = 12;
  down = 13;
  left = 14;
  right = 15;

  getButton(eventKey) {
    return Object.keys(this).find(key => this[key] === eventKey);
  }
}

let gamePads = [];
let gamePadLayout = 'default';
gamePads['default'] = new gamePad();

let gamepadSnes = new gamePad();
gamepadSnes.b = 2;
gamepadSnes.y = 3;
gamepadSnes.x = 0;
gamepadSnes.up = 'a10';
gamepadSnes.down = 'a11';
gamepadSnes.left = 'a00';
gamepadSnes.right = 'a01';
gamePads['snes'] = gamepadSnes;

let gamepadPS3 = new gamePad();
gamepadPS3.b = 14;
gamepadPS3.a = 13;
gamepadPS3.y = 15;
gamepadPS3.x = 12;
gamepadPS3.l = 10;
gamepadPS3.r = 11;
gamepadPS3.select = 0;
gamepadPS3.start = 3;
gamepadPS3.up = 4;
gamepadPS3.down = 6;
gamepadPS3.left = 7;
gamepadPS3.right = 5;
gamePads['ps3'] = gamepadPS3;

const sendGamePadEvent = (gamePadEvent) => {
  if (p != null) {
    let gamePad = gamePads[gamePadLayout];
    let gamePadButton = gamePad.getButton(gamePadEvent.button);
    if (typeof gamePadButton !== 'undefined') {
      let keyEvent = {
        type: gamePadEvent.type,
        button: gamePadButton
      };
      //console.log(keyEvent);
      p.send(JSON.stringify(keyEvent));
    }
  }
};

const sendKeyEvent = (event) => {
  let gamePadButton = keyPadButtons.getButton(event.key);
  if (typeof gamePadButton !== 'undefined') {
    let keyEvent = {
      type: event.type,
      button: gamePadButton
    };
    p.send(JSON.stringify(keyEvent));
  }
};

document.addEventListener("keydown", (event) => {
  if (p != null) {
    // if (keypressTrigger.indexOf(event.code) == -1) {
    //   keypressTrigger.push(event.code);
    sendKeyEvent(event);
    // }
  }
});

document.addEventListener("keyup", (event) => {
  if (p != null) {
    // let indexOf = keypressTrigger.indexOf(event.code);
    // if (indexOf != -1) {
    //   keypressTrigger.splice(indexOf);
    sendKeyEvent(event);
    // }
  }
});

// document.addEventListener("keyup", (event) => {
//   sendKeyEvent(event);
// });

const socket = io("ws://localhost:3000");
socket.on('chat message', function (msg) {
  let objMsg = {
    origem: null,
    destino: null,
    sala: null,
    tipoPacote: null,
    pacote: null
  };
  let objMsgRecebida = msg;
  if (objMsgRecebida.destino !== 0 && objMsgRecebida.destino === nomeJogador && objMsgRecebida.sala == sala) {
    if ("helloData" === objMsgRecebida.tipoPacote) {
      incoming(objMsgRecebida.pacote);
    }
  }
});

const conectar = () => {
  nomeJogador = $("#nomeJogador").val();
  $("#nomeJogador").attr("disabled", true);
  $("#btnconectar").attr("disabled", true);
  let objMsgEnviar = {
    origem: nomeJogador,
    destino: 0,
    sala: sala,
    tipoPacote: "hello",
    pacote: null
  }
  socket.emit('chat message', objMsgEnviar);
};

const bindingEvents = (p) => {
  p.on('error', err => console.log(err));
  p.on('signal', (data) => {
    let objMsgEnviar = {
      origem: nomeJogador,
      destino: 0,
      sala: sala,
      tipoPacote: "helloOkData",
      pacote: data
    };
    socket.emit('chat message', objMsgEnviar);
  });
  p.on('stream', stream => {
    let receiverVideo = document.getElementById("receiver-video");
    receiverVideo.srcObject = stream;
  });
};

const incoming = (data) => {
  if (p == null) {
    p = new SimplePeer({
      initiator: false,
      trickle: false
    });
    bindingEvents(p);
  }
  p.signal(data);
};

const defineControle = (obj) => {
  gamePadLayout = $(obj).val();
}
