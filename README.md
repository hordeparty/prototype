Protótipo/MVP para rodar snes9x versão wasm (xnes) multiplayer.

Mesmo conceito de https://snes.party rodando em https://app.kosmi.io

Homologado em 29/07/2021 com 14 partidas de UMK3 consecutivas durante um campeonato com 7 salas paralelas.

Utilizado semanalmente por tiozões do departamento de TI em happy hour remotos.

Gamepads testados:

- Teclado (a, s, d , f, z, x, Enter, Shift, up, down, left, right)
- Xbox360
- XBox One
- PS3
- PS4
- PS5
- Generic usb Snes clone
- Generic usb PS2 adapter
- Generic usb Unknown

---

#Projetos macro

- HOST-WRTC (server.html + server.js + simplepeer.js)
- HOST-SOCKET.IO (chat demo socket.io sem CORS https://github.com/hordeparty/chat-example.git)
- MEDIA-CLIENT-PLAYER-FULL (client.html + client.js + hordepadapi.js + simplepeer.js)
- MEDIA-CLIENT-PLAYER-VIEWER (conceito)
- MEDIA-CLIENT-VIEWER-NODE-MESH (conceito)
- CLIENT-PLAYER-CONTROLER (conceito)
- CLIENT-HOST-CONTROLLER (conceito)
- CLIENT-HOST-STREAMER (conceito)

---

##HOST-WRTC

Server onde roda o jogo.

Envia stream da tag video via wrtc para os MEDIA-CLIENT.

Recebe pacotes de acionamento de controle via wrtc de 

- MEDIA-CLIENT-PLAYER-FULL
- CLIENT-PLAYER-CONTROLER.

##MEDIA-CLIENT-PLAYER-VIEWER

- Conecta no HOST-WRTC.
- Consome o stream da tag video enviada pelo HOST-WRTC.

##MEDIA-CLIENT-PLAYER-FULL

- Conecta no HOST-WRTC
- Consome o stream da tag video enviada pelo HOST-WRTC.
- Envia pacotes de acionamento de controle para o HOST-WRTC.

##MEDIA-CLIENT-VIEWER-NODE-MESH

- Conecta no HOST-WRTC ou em outro MEDIA-CLIENT-VIEWER-NODE-MESH.
- Consome o stream da tag video enviada pelo HOST-WRTC.
- Retransmite o stream da tag video para outros MEDIA-CLIENT-VIEWER-NODE-MESH.

##CLIENT-PLAYER-CONTROLER

- Envia pacotes de acionamento de controle para o HOST-WRTC.

##CLIENT-HOST-CONTROLLER

- Conecta no HOST-WRTC.
- Recebe pacotes de acionamento de controle via wrtc do HOST-WRTC .
- Envia acionamento de controle para hardware específico.

##CLIENT-HOST-STREAMER

- Conecta no HOST-WRTC.
- Envia stream de FFMPEG via wrtc para o HOST-WRTC.

exemplo https://github.com/dwoja22/ffmpeg-webrtc
