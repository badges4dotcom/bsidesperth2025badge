
// Sets up WiFi and starts a scan for networks.
void configureWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true, false, 100);
  delay(100);

  displayMessageScreen("WiFi", "WiFi", "Scanning for networks...", false, false, false);
  scanForWiFiAPs();
}

// Scans for WiFi networks.
void scanForWiFiAPs() {
  int numNetworks;
  int keyPress;
  String wifiNetworks[MAX_WIFI_NETWORKS];
  int menuItem;

  menuItem = 0;

  do {
    numNetworks = WiFi.scanNetworks();
    if (numNetworks < 0) {
      WiFi.disconnect();
      delay(100);
    }
  } while (numNetworks < 0);

  if (numNetworks == 0) {
    displayMessageScreen("WiFi", "WiFi", "No WiFi networks found.", false, false, true);
    keyPress = blockForKeyPress();
    keyPress = blockForKeyPress();
  } else {
    if (numNetworks > MAX_WIFI_NETWORKS) numNetworks = MAX_WIFI_NETWORKS;
    
    for (int i=0; i<numNetworks; i++) {
      wifiNetworks[i] = WiFi.SSID(i);
      delay(10);
    }

    allowUserToSelectWiFiNetwork(wifiNetworks, numNetworks);
  }
}

// Allows a user to select which WiFi network they'd like to connect to.
bool allowUserToSelectWiFiNetwork(String wifiNetworks[], int numNetworks) {
  int keyPress;
  int menuItem;
  WiFiCredentials wifiCreds;
  char cWiFiSSID[33];

  menuItem = 0;
  while (true) {
    keyPress = 0;
    displayMenu(wifiNetworks, numNetworks, menuItem, 6, 1);

    keyPress = blockForKeyPress();

    if ((keyPress&DOWN_KEY_REGISTER)>0) menuItem++;
    if ((keyPress&UP_KEY_REGISTER)>0) menuItem--;
    if ((keyPress & B_KEY_REGISTER) > 0) {
      return false;
    }

    if (menuItem > (numNetworks-1)) menuItem = numNetworks-1;
    if (menuItem < 0) menuItem = 0;

    if ((keyPress&A_KEY_REGISTER)>0) {
      wifiCreds.SSID = wifiNetworks[menuItem];

      wifiCreds.SSID.toCharArray(cWiFiSSID, sizeof(cWiFiSSID));
      if (strncmp(cWiFiSSID, user.WiFiSSID, sizeof(cWiFiSSID))==0) {
        if (promptToUseSavedPassword()) {
          wifiCreds.ValidPassword = true;
          wifiCreds.Password = String(user.WiFiPassword);
          connectToWiFi(wifiCreds.SSID, wifiCreds.Password);   
        } else {
          promptForPassword(&wifiCreds);
          if (wifiCreds.ValidPassword) connectToWiFi(wifiCreds.SSID, wifiCreds.Password);         
        }
      } else {
        promptForPassword(&wifiCreds);
        if (wifiCreds.ValidPassword) connectToWiFi(wifiCreds.SSID, wifiCreds.Password);
      }
      WiFi.scanDelete();
      return wifiCreds.ValidPassword;
    }
  }

  return false;
}

// Screen which allows a user to enter their WiFi password.
void promptForPassword(struct WiFiCredentials *wifiCreds) {
  bool editMode;
  int blinkCursor;
  int keyPress;
  int i;

  wifiCreds->ValidPassword = false;
  wifiCreds->Password = "";
  blinkCursor = 0;

  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(1);
  tft.setTextWrap(true);

  tft.setCursor(0, 0);
  tft.print("Enter password for ");
  tft.print(wifiCreds->SSID);

  tft.setCursor(0, SCREEN_HEIGHT-40);
  tft.print("[UP] Up");
  tft.setCursor(0, SCREEN_HEIGHT-30);
  tft.print("[DOWN] Down"); 
  tft.setCursor(SCREEN_WIDTH/2, SCREEN_HEIGHT-40);
  tft.print("[A] ADD Char");
  tft.setCursor(SCREEN_WIDTH/2, SCREEN_HEIGHT-30);
  tft.print("[B] Accept");
  tft.setCursor(0, SCREEN_HEIGHT-20);
  tft.print("[UP]+[A] DEL Char");   
  tft.setCursor(0, SCREEN_HEIGHT-10);
  tft.print("[UP]+[DOWN] Cancel"); 

  editMode = true;
  while (editMode) {
    if ((blinkCursor%25)==0) {
      tft.fillRect(0, SCREEN_HEIGHT/2-20, SCREEN_WIDTH, 40, ST77XX_BLACK);
      tft.setCursor(0, SCREEN_HEIGHT/2-20);
      for (i=0; i<wifiCreds->Password.length(); i++) {
        if ((wifiCreds->Password.length()>1) && (i<(wifiCreds->Password.length()-1))) tft.print("*");
        else tft.print(wifiCreds->Password.charAt(i));
      }
      
      if (blinkCursor==25) tft.print("|");
      if (blinkCursor==50) blinkCursor = 0;
    }
    blinkCursor = blinkCursor+1;

    keyPress = checkForKeyPress();
    
    if (((keyPress & UP_KEY_REGISTER) > 0) && ((keyPress & DOWN_KEY_REGISTER) > 0)) {
      wifiCreds->ValidPassword = false;
      wifiCreds->SSID = "";
      wifiCreds->Password = "";
      return;
    }
    if (((keyPress & UP_KEY_REGISTER) > 0) && ((keyPress & A_KEY_REGISTER) > 0)) {
      if (wifiCreds->Password.length()<=1) wifiCreds->Password = "";
      else wifiCreds->Password = wifiCreds->Password.substring(0, wifiCreds->Password.length()-1);
      continue;
    }

    if ((keyPress&DOWN_KEY_REGISTER)>0) wifiCreds->Password = incDecPassword(wifiCreds->Password, -1);
    if ((keyPress&UP_KEY_REGISTER)>0) wifiCreds->Password = incDecPassword(wifiCreds->Password, 1);
    if ((keyPress & A_KEY_REGISTER) > 0) {
      if (wifiCreds->Password.length()<=0) wifiCreds->Password = wifiCreds->Password + "a";
      else wifiCreds->Password = wifiCreds->Password + wifiCreds->Password.substring(wifiCreds->Password.length()-1, wifiCreds->Password.length());
    }    
    if ((keyPress & B_KEY_REGISTER) > 0) {
      wifiCreds->ValidPassword = true;
      return;
    }

    delay(10);
  }
}

// Displays the "Connecting to Wifi " screen.
bool displayConnectingToWiFiMessage(String wifiSSID) {
  String strMessage;
  uint8_t status;

  strMessage = "Connecting to "+wifiSSID;
  strMessage = strMessage + " (15sec timeout)";
  displayMessageScreen("WiFi", "WiFi", strMessage, false, false, false);

  for (int i=0; i<15; i++) {
    if (WiFi.status()==WL_CONNECTED) return true;
    delay(1000);
  }

  return false;
}

// Increases/decreases the character at the cursor.
String incDecPassword(String strPassword, int amount) {
  char item;

  if (strPassword.length()<=0) return "";

  item = strPassword.charAt(strPassword.length()-1);
  item = item + amount;
  
  if (item>126) item = 32;
  if (item<32) item = 126;

  if (strPassword.length()==1) strPassword = item;
  else strPassword = (strPassword.substring(0,strPassword.length()-1) + item);

  return strPassword;
}

// Saves the WiFi credentials to EEPROM memory.
void saveWiFiCredentialsToEEPROM(String wifiSSID, String strPassword) {
  wifiSSID.toCharArray(user.WiFiSSID, sizeof(user.WiFiSSID));
  strPassword.toCharArray(user.WiFiPassword, sizeof(user.WiFiPassword));
  saveUserSettings();
}

// Prompts for saving password to memory.
void promptForSavePassword(String wifiSSID, String strPassword) {
  int keyPress;

  displayMessageScreen("Warning", "WiFi", "Would you like to save your WiFi details? (Security Warning: it will be stored cleartext in EEPROM). Yes[A], No[B]", false, false, false);
  while (true) {
		keyPress = blockForKeyPress();
		if ((keyPress & A_KEY_REGISTER) > 0) {
      saveWiFiCredentialsToEEPROM(wifiSSID, strPassword);  
      return;
    }
		if ((keyPress & B_KEY_REGISTER) > 0) return;
	}
}

// Prompts user to use saved password.
bool promptToUseSavedPassword() {
  int keyPress;

  displayMessageScreen("WiFi", "WiFi", "You have a saved password for this WiFi network in EEPROM. Would you like to use it? Yes[A], No[B]", false, false, false);
  while (true) {
		keyPress = blockForKeyPress();
		if ((keyPress & A_KEY_REGISTER) > 0) return true;
		if ((keyPress & B_KEY_REGISTER) > 0) return false;
	}
}

// Connects to WiFi 
bool connectToWiFi(String wifiSSID, String strPassword) {
  String strMessage;
  bool success;
  int keyPress;

  success = false;
  WiFi.begin(wifiSSID, strPassword);
  if (displayConnectingToWiFiMessage(wifiSSID)) {
    registerDevice();

    strMessage = "Connected to ";
    strMessage += wifiSSID + ". Your IP Address is "+WiFi.localIP().toString();
    success = true;
    displayMessageScreen("Tick", "WiFi", strMessage, false, false, true);
    promptForSavePassword(wifiSSID, strPassword);
  } else {
    strMessage = "Could not connect to ";
    strMessage += wifiSSID + ". Please try again.";
    displayMessageScreen("Cross", "WiFi", strMessage, false, false, true);
  }
  keyPress = blockForKeyPress();

  return success;
}

// Checks to see if the user is online.
bool isUserOnlineWithWiFi() {
  return (WiFi.status()==WL_CONNECTED);
}

// Displays the WiFi offline message.
void displayWiFiOfflineAlert() {
  int keyPress;

  displayMessageScreen("WiFi", "WiFi", "You are not connected to a WiFi network. | Please return to game menu ([UP]+[DOWN]) to connect.", false, false, true);
  keyPress = blockForKeyPress();
  keyPress = blockForKeyPress();
}
