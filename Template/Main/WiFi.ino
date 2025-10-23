// Sets up WiFi.
void configureWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true, false, 100);
  delay(100);
}

// Connects to WiFi .
bool connectToWiFi(String wifiSSID, String strPassword) {
  WiFi.begin(wifiSSID, strPassword);

  // Here is the spot to inform the user of the WiFi connecting.

  // Wait 15 seconds for connection.
  for (int i=0; i<15; i++) {
    if (WiFi.status()==WL_CONNECTED) return true;
    delay(1000);
  }

  return false;
}

// Checks to see if the user is online.
bool isUserOnlineWithWiFi() {
  return (WiFi.status()==WL_CONNECTED);
}
