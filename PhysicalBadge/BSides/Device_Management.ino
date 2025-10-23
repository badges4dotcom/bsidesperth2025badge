
// Registers a device with the online server.
void registerDevice() {
  JsonDocument docOut;
  JsonDocument docIn;
  String strOutput;
  String strInput;
  DeserializationError jsonError;
  char *error;

  if (!hasValidPasscode()) {
    docOut["user"] = generateUserJsonDocument();
    serializeJson(docOut, strOutput);
    strInput = sendWebRequest(GAME_WEB_URL, 8080, "/register.php", GAME_WEB_URL, strOutput);
    
    jsonError = deserializeJson(docIn, strInput);
    
    error = 0;
    if (!jsonError) {
      if (jsonElementExists(docIn, "Response") && jsonElementExists(docIn, "UUID") && jsonElementExists(docIn, "Passcode")) {
        if (strncmp(docIn["Response"], "success", strlen(docIn["Response"]))==0) {
          if (strlen(docIn["UUID"])==32) {
            if (strlen(docIn["Passcode"])==8) {
              strncpy((char *) &user.UUID, docIn["UUID"], 32);
              strncpy((char *) &user.Passcode, docIn["Passcode"], 8);
            }
          }
        }
      }
    }
  }
}

// Checks to see if the passcode is valid.
bool hasValidPasscode() {
  for (int i=0; i<8; i++) if (user.Passcode[i]!='\0') return true;
  return false;
}

// If the device hasn't been registered, alert the user.
void displayDeviceRegistrationAlert() {
  int keyPress;

  displayMessageScreen("Warning", "Device", "Your device has not been registered. | Press [A] to attempt device registration.", false, false, true);
  keyPress = blockForKeyPress();
  keyPress = blockForKeyPress();
}

// Display an alert if hte device couldn't be registered.
void displayDeviceRegistrationError() {
  int keyPress;

  displayMessageScreen("Warning", "Device", "Your device could not be registered. | Check that you have internet connectivity and try again.", false, false, true);
  keyPress = blockForKeyPress();
  keyPress = blockForKeyPress();
}