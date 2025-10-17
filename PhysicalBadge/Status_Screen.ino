
// Displays the first Status screen.
void displayStatusOneScreen() {
  String strMessage;

  strMessage = getNumberOfAnimalsCollectedString();
  strMessage += " | ";
  strMessage += getNumberOfChallengesCompletedString(true);

  displayMessageScreen("Person", "Status (1/3)", strMessage, false, false, true);
}

// Displays the second Status screen.
void displayStatusTwoScreen() {
  String strMessage;

  strMessage = getNumberOfChallengesCompletedString(false);
  strMessage += " | ";
  strMessage += "Passcode: ";
  strMessage += getUserPasscode();

  displayMessageScreen("Person", "Status (2/3)", strMessage, false, false, true);
}

// Displays the third Status screen.
void displayStatusThreeScreen() {
  String strMessage;

  strMessage = "UUID: ";
  strMessage += getUserUUID();

  strMessage += " | ";
  if (WiFi.status()==WL_CONNECTED) strMessage += "WiFi: Connected";
  else strMessage += "WiFi: Not Connected";
  
  strMessage += " | ";
  if (WiFi.status()==WL_CONNECTED) {
    strMessage += "IP Addr: "+WiFi.localIP().toString();
  }

  displayMessageScreen("Person", "Status (3/3)", strMessage, false, false, true);
}

// Returns a string with then number of animals collected.
String getNumberOfAnimalsCollectedString() {
  String strMessage;

  strMessage = "Animals Collected (";
	strMessage += getNumberOfAnimalsCollected();
	strMessage += "/";
	strMessage += getNumberOfAnimals();
	strMessage += ")";

  return strMessage;
}

// Returns a string with the number of challenges completed.
String getNumberOfChallengesCompletedString(bool isOnlineChallenge) {
  String strMessage;

  if (isOnlineChallenge) strMessage = "Online ";
  else strMessage = "Offline ";

  strMessage += "Challenges Completed (";
	strMessage += getNumberOfChallengesCompleted(isOnlineChallenge);
	strMessage += "/";
	strMessage += getNumberOfChallenges();
	strMessage += ")";

  return strMessage;
}

// Returns the user's Passcode as a String.
String getUserPasscode() {
  String strMessage;

  if (strlen(user.Passcode)==0) strMessage = "Not set";
  else strMessage = String(user.Passcode);

  return strMessage;
}

// Returns the User's UUID as a string.
String getUserUUID() {
  String strMessage;

  strMessage = "";
  for (int i=0; i<32; i++) {
    strMessage = strMessage + user.UUID[i];
    if ((i==7) || (i==11) || (i==15) || (i==19)) strMessage += "-";
  }

  return strMessage;
}
