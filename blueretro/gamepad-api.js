let hordepaddbg = {};
let controllers = [];
let syncEnabled = false;

class hordepad {
    controller = {buttons: null, axes: null};
    controllerIdx = null;
    callBack = function (buttons, axes) {
        //replaced with sendGamepadState(buttons, axes)
        console.log(buttons, axes);
    };
    buttonsPressed = [];
    axesPosition = [];

    constructor(event, callBack) {
        this.controller = event.gamepad;
        this.controllerIdx = event.gamepad.index;
        this.callBack = callBack;
        for (let i = 0; i < this.controller.buttons.length; i++) {
            this.buttonsPressed.push(false);
        }
        for (let i = 0; i < this.controller.axes.length; i++) {
            this.axesPosition.push(null);
        }
    }

    update() {
        this.controller = navigator.getGamepads()[this.controllerIdx];
        for (const [index, axis] of this.controller.axes.entries()) {
            this.axesPosition[index] = axis;
        }
        for (const [index, button] of this.controller.buttons.entries()) {
            if (button.pressed || button.touched) {
                if (this.buttonsPressed[index] == false)
                    this.buttonsPressed[index] = true;
            } else {
                if (this.buttonsPressed[index] == true)
                    this.buttonsPressed[index] = false;
            }
        }
        this.callBack(this.buttonsPressed, this.axesPosition);
    }
};

const hordeGamepadApi = (event) => {
    console.log(event);
    hordepaddbg = new hordepad(event, sendGamepadState);
    controllers.push(hordepaddbg);
};

window.addEventListener("gamepadconnected", hordeGamepadApi);
window.addEventListener("gamepaddisconnected", hordeGamepadApi);

function floatToBytes(value) {
    return Math.round((1 + value) * 127.5);
}

function sendGamepadState(buttons, axes) {
    let axesChildren = $('#TRAxes').children();
    for (let i = 0; i < axes.length; i++) {
        let childTD = $(axesChildren.get(i + 2));
        if (syncEnabled) {
            let axisBytes = floatToBytes(axes[i]);
            serialData[i + 3] = axisBytes;
            let axisHex = '0x' + parseInt(axisBytes).toString(16).toUpperCase().padStart(2, '0');
            childTD.text(axisHex);
        }
    }
    let children = $('#TRButtons').children();
    for (let i = 0; i < buttons.length; i++) {
        let childTD = $(children.get(i));
        if (buttons[i]) {
            childTD.css({"background": "black", "color": "white"});
            debugProtocol(childTD.text(), true)
        } else if (childTD.length > 0) {
            childTD.css({"background": "white", "color": "black"});
            debugProtocol(childTD.text(), false)
        }
    }
}

function debugProtocol(padEnumText, enabled) {
    $("#padmap td").each(
        function (idx, domTD) {
            if (padEnumText === $(domTD).text()) {
                let btnValue = 1 << idx;
                let btnBitPart1 = (btnValue >> 8) & 0xff;
                let btnBitPart2 = btnValue & 0xff;
                if (enabled) {
                    serialData[1] = serialData[1] | btnBitPart1;
                    serialData[2] = serialData[2] | btnBitPart2;
                    $(domTD).css({"background": "black", "color": "white"});
                } else {
                    $(domTD).css({"background": "white", "color": "black"});
                    serialData[1] = serialData[1] & (btnBitPart1 ^ 0xff);
                    serialData[2] = serialData[2] & (btnBitPart2 ^ 0xff);
                }
            }
        });
    if (syncEnabled) {
        let hexText1 = parseInt(String(serialData[1])).toString(16).toUpperCase();
        let hexText2 = parseInt(String(serialData[2])).toString(16).toUpperCase();
        let hexText = hexText1.padStart(2, '0') + hexText2.padStart(2, '0');

        let binaryText = parseInt(String(serialData[1])).toString(2).padStart(8, '0');
        binaryText = binaryText + parseInt(String(serialData[2])).toString(2).padStart(8, '0');
        $('#binaryval').text(binaryText);
        $('#hexval').text('0x' + hexText.padStart(4, '0'));
        if (serialConnected && enabled) {
            sendCommand(serialData);
        }
    }
}

setInterval(() => {
    for (let i = 0; i < controllers.length; i++) {
        controllers[i].update();
    }
}, 10);

function toggleSync() {
    syncEnabled = !syncEnabled;
    if (syncEnabled) {
        $('#span_sync').css({'background': 'blue', 'color': 'white'})
        $('#span_sync').text('SYNC ON');
    } else {
        $('#span_sync').css({'background': 'white', 'color': 'black'})
        $('#span_sync').text('SYNC OFF');
    }
}
