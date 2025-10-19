
function millis() {
  return Date.now();
}

let lastKeyPressTime = 0; // shared debounce timer (in ms)
const DEBOUNCE_DELAY = 250;

function blockForKeyPress() {
  return new Promise((resolve) => {
    function tryResolve(keyValue) {
      const now = Date.now();
      if (displayingMessage) return;
      if (now - lastKeyPressTime < DEBOUNCE_DELAY) return; // debounce
      lastKeyPressTime = now;
      cleanup();
      resolve(keyValue);
    }

    function onUpClick() { tryResolve(UP_KEY_REGISTER); }
    function onDownClick() { tryResolve(DOWN_KEY_REGISTER); }
    function onAClick() { tryResolve(A_KEY_REGISTER); }
    function onBClick() { tryResolve(B_KEY_REGISTER); }

    function cleanup() {
      document.getElementById("btnUP").removeEventListener("click", onUpClick);
      document.getElementById("btnDOWN").removeEventListener("click", onDownClick);
      document.getElementById("btnA").removeEventListener("click", onAClick);
      document.getElementById("btnB").removeEventListener("click", onBClick);
    }

    document.getElementById("btnUP").addEventListener("click", onUpClick);
    document.getElementById("btnDOWN").addEventListener("click", onDownClick);
    document.getElementById("btnA").addEventListener("click", onAClick);
    document.getElementById("btnB").addEventListener("click", onBClick);
  });
}

function checkForKeyPress() {  
  let keyRegister = 0;
  const now = Date.now();

  if (now - lastKeyPressTime < DEBOUNCE_DELAY) {
    resetKeysPress();
    return 0; // ignore within debounce window
  }

  if (keysPressed["KeyQ"]) keyRegister ^= UP_KEY_REGISTER;
  if (keysPressed["KeyA"]) keyRegister ^= DOWN_KEY_REGISTER;
  if (keysPressed["KeyE"]) keyRegister ^= A_KEY_REGISTER; 
  if (keysPressed["KeyD"]) keyRegister ^= B_KEY_REGISTER;     

  if (keyRegister !== 0) {
    lastKeyPressTime = now;
  }

  resetKeysPress();
  return keyRegister;
}

  
function resetKeysPress() {
  keysPressed["KeyQ"] = false;
  keysPressed["KeyA"] = false;
  keysPressed["KeyE"] = false;
  keysPressed["KeyD"] = false;
}

  function btnUPPressed() {
    keysPressed["KeyQ"] = true;
  }

  function btnDOWNPressed() {
    keysPressed["KeyA"] = true;
  }

  function btnAPressed() {
    keysPressed["KeyE"] = true;
  }

  function btnBPressed() {
    keysPressed["KeyD"] = true;
  }

// Thanks Matt for the code snippet ;)
addEventListener("keypress", (event) => { 
  keyboardMode = true;
  switch(event.code) { 
    case 'KeyW': document.getElementById('btnUP').click(); break; 
    case 'KeyA': document.getElementById('btnA').click(); break; 
    case 'KeyS': document.getElementById('btnDOWN').click(); break; 
    case 'KeyD': document.getElementById('btnB').click(); break; 
    default: break; }
})