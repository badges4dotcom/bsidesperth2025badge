
// Sends a "POST" web HTTP request to the web server using secure sockets.
String sendWebRequest (char *server, int port, String url, String host, String strData) {
  WiFiClientSecure client;
  String getRequest;
  String strResult;
  char c;
  int cResult;

  client.setCACert(GAME_ROOT_CERTIFICATE);
  client.setTimeout(15000);
  client.setHandshakeTimeout(12000);
  client.setConnectionTimeout(10000);
  //client.setInsecure();   //Uncomment to ignore certificate.

  cResult = client.connect(server, port);
  if (!cResult) {
    /*
    displayMessageScreen("Warning", "Error", "The connection returned: "+cResult, false, false, true);
    blockForKeyPress();
    blockForKeyPress();
    */
    return "";
  }

  getRequest = "POST ";
  getRequest += url;
  getRequest += " HTTP/1.1";
  client.println(getRequest);

  getRequest = "Host: ";
  getRequest += host;
  client.println(getRequest);
  client.println("Content-Type: application/json");
  
  getRequest = "Content-Length: ";
  getRequest += strData.length();
  client.println(getRequest);

  client.println();
  client.println(strData);

  // Read headers.
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;                      // All headers have been received/ read.
  }

  // Read body.
  strResult = "";
  while (client.available()) {
    c = client.read();
    strResult += c;
  }

  client.stop();

  return strResult;
}

bool jsonElementExists(JsonDocument docIn, String element) {
  if (docIn[element]==NULL) return false;
  return true;
}