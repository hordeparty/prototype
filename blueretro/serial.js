let reader;
let writer;
let serialConnected = false;

const serialData = [0x2E, 0x2E, 0x2E, 0x2E];

// const buffer = new Uint8Array(data).buffer;

function handleSerialData({value, done}) {
    let psconsole = $('#serial-out');
    psconsole.append(`${new TextDecoder().decode(value)}`);
    psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
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

function clearConsole(){
    $('#serial-out').text('');
}
