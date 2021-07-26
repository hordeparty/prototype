let clients = [];

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
  getButtonNumber: function(button, controle){
    let controleCalc = (controle - 1) * 12;
    return gamePadButtons[button] + controleCalc + 91337;
  }
};

const socket = io("ws://localhost:3000");
socket.on('chat message', function (msg) {
  let objMsg = {
    origem: null,
    destino: null,
    tipoPacote: null,
    pacote: null
  };
  let objMsgRecebida = msg;
  if (objMsgRecebida.destino === 0) {
    if (!(objMsgRecebida.origem in clients)) {
      adicionaJogador(objMsgRecebida.origem);
    }
    if (objMsgRecebida.origem in clients) {
      if (clients[objMsgRecebida.origem].helloOkData == null) {
        if ("helloOkData" === objMsgRecebida.tipoPacote) {
          incoming(clients[objMsgRecebida.origem].simplePeer, objMsgRecebida.pacote);
          console.log(objMsgRecebida.origem);
          $(`#${objMsgRecebida.origem}`).children().get(2).innerHTML = "<b>ONLINE</b>";
        }
      }
    }
  }
});

const mudaControle = (comboControle) => {
  let controle = comboControle.val();
  let nomeJogador = comboControle.parent().prev().text();
  clients[nomeJogador].controle = controle;
}

const adicionaJogador = (nomeJogador) => {
  let controle = Object.keys(clients).length + 1;
  $("#tbodyJogadores").append(`<tr id="${nomeJogador}">
<td>${nomeJogador}</td>
<td><select id="select${nomeJogador}" value="${controle}" onchange="mudaControle($(this));">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
</select></td>
<td>OFFLINE</td>
</tr>`);
  $(`#select${nomeJogador}`).val(controle);
  let jogador = {
    nome: nomeJogador,
    controle: controle,
    simplePeer: null,
    helloData: null,
    helloOkData: null
  };
  let emulatorVideo = document.getElementById('emulator-video').captureStream(20);
  let simplePeer = new SimplePeer({
    initiator: true,
    stream: emulatorVideo,
    trickle: false
  });
  jogador.simplePeer = simplePeer;
  clients[jogador.nome] = jogador;
  bindingEvents(nomeJogador);
};

const bindingEvents = (nomeJogador) => {
  clients[nomeJogador].simplePeer.on('error', err => console.log(err));
  clients[nomeJogador].simplePeer.on('signal', (data) => {
    clients[nomeJogador].helloData = data;
    let objMsgEnviar = {
      origem: 0,
      destino: nomeJogador,
      tipoPacote: "helloData",
      pacote: data
    };
    socket.emit('chat message', objMsgEnviar);
    clients[nomeJogador].simplePeer.on('data', (data) => {
      // console.log("jogador: [" + nomeJogador + "] controle: ["+ clients[nomeJogador].controle +"] enviou: [" + data + "]");
      let dataObj = JSON.parse(data);
      let moduleKey = gamePadButtons.getButtonNumber(dataObj.button, clients[nomeJogador].controle);
      if(dataObj.type === "keydown"){
        // console.log("keydown " + dataObj.button);
        Module._press(moduleKey);
      } else if(dataObj.type === "keyup"){
        // console.log("keyup " + dataObj.button);
        Module._depress(moduleKey);
      }
    });
  });
};

const incoming = (simplePeer, data) => {
  simplePeer.signal(data);
};
