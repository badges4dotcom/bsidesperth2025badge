
char idBSides[6] = {66,83,73,68,69,83};

// Checks if user setting has been initialised.
void checkUserSettings() {
  for (int i=0; i<6; i++) {
    if (user.UUID[i]!=idBSides[i]) {
      initialiseUserSettings(false);
      return;
    }
  }
}

// Reads the user settings from EEPROM.
void readUserSettings() {
  EEPROM.get(0, user);
  checkUserSettings();
}

// Writes the user settings to EEPROM.
void saveUserSettings() {
  EEPROM.put(0, user);
  EEPROM.commit();
}

// Initialises the user settings.
void initialiseUserSettings(bool displayMessage) {
  int i;
  int keyPress;
  char cIn;

  // Generate a UUID.
  memset(user.UUID, '\0', sizeof(user.UUID));
  for (i=0; i<6; i++) user.UUID[i] = idBSides[i];
  user.UUID[6] = '?';                                     // TODO: Reserved UUID byte for future use.
  for (i=7; i<32; i++) {
    cIn = random(0, 52);
    if (cIn >= 26) {
      cIn -= 26;
      cIn = cIn+97;
    } else {
      cIn = cIn+65;
    }
    user.UUID[i] = cIn;
  }
  memset(user.Passcode, '\0', sizeof(user.Passcode));

  user.AnimalsCollected = 0;
  user.OnlineChallengesCompleted = 0;
  user.OfflineChallengesCompleted = 0;
  user.missionStatus = 0;

  user.locationX = 0;
  user.locationY = 0;
  user.lastLocationX = 0;
  user.lastLocationY = 0;

  memset(user.WiFiSSID, '\0', sizeof(user.WiFiSSID));
  memset(user.WiFiPassword, '\0', sizeof(user.WiFiPassword));

  saveUserSettings();

  displayMessageScreen("Person", "Benny", "Your user settings have been reset.", true, true, true);
  keyPress = blockForKeyPress();
  keyPress = blockForKeyPress();
}

// Generates a JSON document with the User details.
JsonDocument generateUserJsonDocument() {
  JsonDocument docItems;

  docItems["UUID"] = user.UUID;
  docItems["Passcode"] = user.Passcode;
  docItems["AnimalsCollected"] = user.AnimalsCollected;
  docItems["OnlineChallengesCompleted"] = user.OnlineChallengesCompleted;
  docItems["OfflineChallengesCompleted"] = user.OfflineChallengesCompleted;

  return docItems;
}