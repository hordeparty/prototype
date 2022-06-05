let controllers = [];
let generic_btns_mask = [
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
];

class hordepad {
    controller = {buttons: null, axes: null};
    controllerIdx = null;
    callBack = function (btnIndex, pressed) {
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
        for (const [index, button] of this.controller.buttons.entries()) {
            if (button.pressed || button.touched) {
                if (this.buttonsPressed[index] == false)
                    this.buttonsPressed[index] = true;
            } else {
                if (this.buttonsPressed[index] == true)
                    this.buttonsPressed[index] = false;
            }
        }
        this.callBack(this.buttonsPressed, null);
    }
};

const hordeGamepadApi = (event) => {
    console.log(event);
    controllers.push(new hordepad(event, sendGamepadState));
};

window.addEventListener("gamepadconnected", hordeGamepadApi);
window.addEventListener("gamepaddisconnected", hordeGamepadApi);

function sendGamepadState(buttons, axes) {
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
                if (enabled) {
                    generic_btns_mask[idx] = true;
                    $(domTD).css({"background": "black", "color": "white"});
                } else {
                    $(domTD).css({"background": "white", "color": "black"});
                    generic_btns_mask[idx] = false;
                }
            }
        });
    if((padEnumText === "10" || padEnumText === "11") && enabled){
        let binaryText = '';
        for (let i = 0; i < generic_btns_mask.length; i++) {
            if (generic_btns_mask[i]) {
                binaryText = '1' + binaryText ;
            } else {
                binaryText = '0' + binaryText ;
            }
            $('#binaryval').text(binaryText);
        }
        let hexText = parseInt(binaryText, 2).toString(16).toUpperCase();
        $('#hexval').text('0x' + hexText.padStart(8,'0'));
    }
}

setInterval(() => {
    for (let i = 0; i < controllers.length; i++) {
        controllers[i].update();
    }
}, 10);
