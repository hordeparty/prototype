let controllers = [];

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
        if (this.buttonsPressed[index] == false) {
          this.callBack("b", index, true);
        }
        this.buttonsPressed[index] = true;
      } else {
        if (this.buttonsPressed[index] == true) {
          this.callBack("b", index, false);
        }
        this.buttonsPressed[index] = false;
      }
    }
    for (const [index, axis] of this.controller.axes.entries()) {
      if (axis > 0.3) {
        if (this.axesPosition[index] == null) {
          this.callBack("a", index, true);
        }
        this.axesPosition[index] = true;
      }
      if (axis > -0.3 && axis < 0.3) {
        if (this.axesPosition[index] != null) {
          this.callBack("a", index, null);
        }
        this.axesPosition[index] = null;
      }
      if (axis < -0.3) {
        if (this.axesPosition[index] == null) {
          this.callBack("a", index, false);
        }
        this.axesPosition[index] = false;
      }
    }
  }
};

const hordeGamepadApi = (event) => {
  console.log(event);
  controllers.push(new hordepad(event, sendEvent));
};

window.addEventListener("gamepadconnected", hordeGamepadApi);
window.addEventListener("gamepaddisconnected", hordeGamepadApi);

function sendEvent(btnType, btnIndex, pressed) {
  // btnType == "b" button
  // btnType == "a" axis
  // console.log("btnType [" + btnType + "] btnIndex[" + btnIndex + "] [" + pressed + "]");
  let eventType = "keyup";
  if (pressed === true) {
    eventType = "keydown";
  }
  let button = btnIndex;
  if (btnType === "a") {
    let axisDirection = 0;
    if (pressed === true) {
      axisDirection = 1;
    }
    button = "a" + btnIndex + "" + axisDirection;
    eventType = "keydown";
    if (pressed == null) {
      eventType = "keyup";
      sendGamePadEvent({type: eventType, button: "a" + btnIndex + "" + 1});
    }
  }
  sendGamePadEvent({type: eventType, button: button});
}

setInterval(() => {
  for (let i = 0; i < controllers.length; i++) {
    controllers[i].update();
  }
}, 1);
