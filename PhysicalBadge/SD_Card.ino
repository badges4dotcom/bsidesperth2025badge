// Initialises the SD Card.
bool initialiseSDCard() {
  return SD.begin(SD_CS, tftHSPI);
}

// Gets the file on the SD Card. If it doesn't exist, create it.
String getSDCardFile(String strFile, String strMessage) {


  if (!initialiseSDCard()) return "";
  
  if (!sdFileExists(strFile)) {
    createSDCardFile(strFile, strMessage);
    return "";
  }

  return readSDCardFileContents(strFile, 4);
}

// Checks to see if the file on the SD Card exists.
bool sdFileExists(String strFile) {
  return SD.exists("/"+strFile);
}

// Creates a file on the SD Card.
void createSDCardFile(String strFile, String strMessage) {
  File fileOut;

  fileOut = SD.open("/"+strFile, FILE_WRITE);
  fileOut.println(strMessage);
  fileOut.close();
}

// Reads the file on the SD Card and returns contents as a String.
String readSDCardFileContents(String strFile, int maxLines) {
  File fileIn;
  String strOut;
  int iLines;

  fileIn = SD.open("/"+strFile, FILE_READ);
  strOut = "";
  iLines = 0;

  if (fileIn) {
    while (fileIn.available() && (iLines<maxLines)) {
      strOut = strOut + fileIn.readString() + "|";
      iLines++;
    }

    fileIn.close();
  }

  return strOut;
}