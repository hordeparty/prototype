let reader;
let writer;
let serialConnected = false;

const serialData = [0xB0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xBF];

function appendConsole(text) {
    let psconsole = $('#serial-out');
    psconsole.append(text);
    psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
    if (psconsole.val().length > 10000) {
        psconsole.text(psconsole.val().substring(1000));
    }
}

function handleSerialData({value, done}) {
    appendConsole(`${new TextDecoder().decode(value)}`);
    reader.read().then(handleSerialData);
}

const serialConfig = {
    baudRate: 921600
};

async function connectToSerial() {
    const port = await navigator.serial.requestPort();
    await port.open(serialConfig);
    writer = port.writable.getWriter();
    reader = port.readable.getReader();
    reader.read().then(handleSerialData);
    serialConnected = true;
}

function sendCommand(data) {
    const bufferTmp = new Uint8Array(data).buffer;
    writer.write(bufferTmp);
}

function clearConsole() {
    $('#serial-out').text('');
}
