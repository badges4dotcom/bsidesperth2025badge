
function millis() {
  return Date.now();
}

/*
function blockForKeyPress() {
  return new Promise((resolve) => {
    function onUpClick() {
      if (displayingMessage) return;
      resolve(UP_KEY_REGISTER);
    }
    function onDownClick() {
      if (displayingMessage) return;
      resolve(DOWN_KEY_REGISTER);
    }
    function onAClick() {
      if (displayingMessage) return;
      resolve(A_KEY_REGISTER);
    }
    function onBClick() {
      if (displayingMessage) return;
      resolve(B_KEY_REGISTER);
    }

    document.getElementById("btnUP").addEventListener("click", onUpClick);
    document.getElementById("btnDOWN").addEventListener("click", onDownClick);
    document.getElementById("btnA").addEventListener("click", onAClick);
    document.getElementById("btnB").addEventListener("click", onBClick);
  });
}

function checkForKeyPress() {  
    let keyRegister = 0;
  
    // Check currently pressed keys
    if (keysPressed["KeyQ"]) keyRegister ^= UP_KEY_REGISTER;
    if (keysPressed["KeyA"]) keyRegister ^= DOWN_KEY_REGISTER;
    if (keysPressed["KeyE"]) keyRegister ^= A_KEY_REGISTER; // A key
    if (keysPressed["KeyD"]) keyRegister ^= B_KEY_REGISTER;     // B key

    resetKeysPress();

    return keyRegister;
  }
*/

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
/*
  document.addEventListener("keydown", (e) => {
    if (displayingMessage) return false;

    if (e.code === "KeyQ") {
      keysPressed["KeyQ"] = true;
    }
    if (e.code === "KeyA") {
      keysPressed["KeyA"] = true;
    }
    if (e.code === "KeyE") {
      keysPressed["KeyE"] = true;
    }
    if (e.code === "KeyD") {
      keysPressed["KeyD"] = true;
    }
    if (e.code === "KeyP") {
      bGameRunning = false;
    }

    return false;
  });
*/

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