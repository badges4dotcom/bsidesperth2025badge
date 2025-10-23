
// Blocks the game/app, waiting for user input.
int blockForKeyPress() {
  int keyRegister;

  keyRegister = lastKeyRegister;
  while (keyRegister==lastKeyRegister) {
    if ((lastDebounceTime-millis()) > debounceDelay) {
      keyRegister = 0;
      if (digitalRead(UP_KEY_INPUT) == HIGH) keyRegister = keyRegister ^ UP_KEY_REGISTER;
      if (digitalRead(DOWN_KEY_INPUT) == HIGH) keyRegister = keyRegister ^ DOWN_KEY_REGISTER;
      if (digitalRead(A_KEY_INPUT) == HIGH) keyRegister = keyRegister ^ A_KEY_REGISTER;
      if (digitalRead(B_KEY_INPUT) == HIGH) keyRegister = keyRegister ^ B_KEY_REGISTER;
      delay(10);
    }
  }
  lastKeyRegister = keyRegister;
  lastDebounceTime = millis();

  return keyRegister;
}

// Checks for user input, but does not block the game/app.
int checkForKeyPress() {
  int keyRegister = 0;

  // Only check inputs if debounce time has passed
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (digitalRead(UP_KEY_INPUT) == HIGH) keyRegister ^= UP_KEY_REGISTER;
    if (digitalRead(DOWN_KEY_INPUT) == HIGH) keyRegister ^= DOWN_KEY_REGISTER;
    if (digitalRead(A_KEY_INPUT) == HIGH) keyRegister ^= A_KEY_REGISTER;
    if (digitalRead(B_KEY_INPUT) == HIGH) keyRegister ^= B_KEY_REGISTER;

    // Check if there's a change
    if (keyRegister != lastKeyRegister) {
      lastKeyRegister = keyRegister;
      lastDebounceTime = millis();
      return keyRegister;
    }
  }

  return 0;
}