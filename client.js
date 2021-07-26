let p = null;
let nomeJogador = "";

let keypressTrigger = [];

let gamePadButtons = {
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
  getButton: function(eventKey){
    return Object.keys(gamePadButtons).find(key => gamePadButtons[key] === eventKey);
  }
};



const sendKeyEvent = (event) => {
  let gamePadButton =  gamePadButtons.getButton(event.key);
  if (typeof gamePadButton !== 'undefined'){
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
    tipoPacote: null,
    pacote: null
  };
  let objMsgRecebida = msg;
  if (objMsgRecebida.destino !== 0 && objMsgRecebida.destino === nomeJogador) {
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
