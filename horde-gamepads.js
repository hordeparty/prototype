// PS4, PS5, Xbox360, XboxOne
class DefaultGamePad {
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

gamePads.set('default', new DefaultGamePad());

// Generic usb
let gamepadSnes = new DefaultGamePad();
gamepadSnes.b = 2;
gamepadSnes.y = 3;
gamepadSnes.x = 0;
gamepadSnes.up = 'a10';
gamepadSnes.down = 'a11';
gamepadSnes.left = 'a00';
gamepadSnes.right = 'a01';
gamePads.set('snes', gamepadSnes);

// PS3
let gamepadPS3 = new DefaultGamePad();
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
gamePads.set('ps3', gamepadPS3);
