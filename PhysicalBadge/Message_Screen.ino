
// This function checks to see if a message will overflow, and attempts to manually text-wrap it
// so it looks nice and neat on screen.
void displayWrappedText(String strMessage, int lineLength, int x, int y, bool scrollText, bool allowSkip) {
  int keyPress;
  
  String strWord;
  int spacePos;
  int linePos;
  int i;
  bool processingLine;

  tft.setCursor(x, y);

  linePos = 0;
  processingLine = true;
  while (processingLine) {
    // Pop the next word.
    spacePos = strMessage.indexOf(" ");
    if (spacePos==-1) {
      processingLine = false;
      spacePos = strMessage.length();
    }
    strWord = strMessage.substring(0,spacePos);
    strMessage = strMessage.substring(spacePos+1);

    // If line delimiter is processed, step two lines down.
    if (strWord=="|") {
      linePos = 0;
      y=y+20;
      tft.setCursor(x, y);
      continue;
    }

    if (spacePos+linePos>lineLength) {
      linePos = 0;
      y += 10;
      tft.setCursor(x, y);
    }

    for (i=0; i<strWord.length(); i++) {
      tft.print(strWord.charAt(i));
      if (scrollText) delay(100);
      linePos++;

      // If the word is longer than the line, move to the next line half way through.
      if (linePos>lineLength) {
        linePos = 0;
        y += 10;
        tft.setCursor(x, y);
      }

      if (allowSkip) {
        keyPress = checkForKeyPress();
        if ((keyPress & B_KEY_REGISTER) > 0) return;
      }
    }

    if (!processingLine) break;
    if (linePos!=lineLength) {
      tft.print(" ");
      linePos++;
    }
  }
}

// Displays the message specified on the screen.
void displayMessageScreen(String imageID, String strTitle, String strMessage, bool scrollText, bool showSkipKey, bool showContinueMessage) {
  int cursorX, cursorY;

  cursorX = 60;
  cursorY = 20;

  if (imageID == "Null") tft.fillRect(60, 0, SCREEN_WIDTH-60, SCREEN_HEIGHT, ST77XX_BLACK);
  else {
    tft.fillScreen(ST77XX_BLACK);
    displayImage(imageID,0,0,1);
  }

  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(1);
  tft.setTextWrap(true);

  tft.setCursor(60, 0);
  tft.print(strTitle);

  tft.setCursor(cursorX, SCREEN_HEIGHT-10);
  if (showSkipKey) tft.print("[B] to skip");
  
  displayWrappedText(strMessage, MAX_LINE_LENGTH, cursorX, cursorY, scrollText, showSkipKey);

  tft.fillRect(cursorX, SCREEN_HEIGHT-10, SCREEN_WIDTH-cursorX, 10, ST77XX_BLACK);
  tft.setCursor(cursorX, SCREEN_HEIGHT-10);
  if (showContinueMessage) tft.print("[A] to continue");
}
