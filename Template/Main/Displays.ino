
// Displays the screen with different coloured text.
void displayTextDisplay() {
  int count;

  // Clear the display.
	tft.fillScreen(ST77XX_BLACK);
  tft.setTextWrap(false);

  // Loop while there is no keypress.
  count = 0;
  while (checkForKeyPress()==0) {
    if (count>14) tft.fillScreen(ST77XX_BLACK);

    // Randomise location, text size, and colour.
    tft.setCursor(random(0,SCREEN_WIDTH), random(0, SCREEN_HEIGHT));
    tft.setTextSize(random(1, 3));
    tft.setTextColor(random(0,65535));

    // Print text.
    tft.print("BSides Perth 2025");
    count++;

    // Wait 100ms.
    delay(100);
  }
}

// Displays the screen with different coloured text.
void displaySpirals() {
  int colour, x, y, size;
  int count;

  // Clear the display.
	tft.fillScreen(ST77XX_BLACK);
  tft.setTextWrap(false);

  // Loop while there is no keypress.
  count = 0;
  while (checkForKeyPress()==0) {
    if (count>14) tft.fillScreen(ST77XX_BLACK);

    // Randomise location and colour.
    x = random(0,SCREEN_WIDTH);
    y = random(0, SCREEN_HEIGHT);
    colour = random(0,65535);
    size = random(20, SCREEN_WIDTH / 2);

    // Print text.
    drawSpiral(x, y, colour, size);
    count++;

    // Wait 100ms.
    delay(100);
  }
}

// Draws a spiral on the screen.
void drawSpiral(int x, int y, int colour, int size) {
  int gap;
  int numSquares = 5;
  float fGap;

  x = x - size;
  y = y - size;
  
  fGap = size;
  fGap = fGap / numSquares;
  if (fGap>numSquares) fGap = 2;
  else fGap = fGap - numSquares;
  fGap = fGap * 2;
  gap = fGap;

  for (int i=0; i<numSquares; i++) {
    drawSquare(x, y, colour, size, gap);
    size = size - (gap + 1);
    x = x + ((gap/2) + 1);
    y = y + ((gap/2) + 1);
  }
}

void drawSquare(int x, int y, int colour, int size, int gap) {
  int cY, cX;
  int iDelay = 3;

  cX = x;
  cY = y;
  for (cY=y; cY<y+size-(gap/2); cY++) {
    tft.drawPixel(x, cY, colour);
    delay(iDelay);
  }
  for (cX=x; cX<x+size-(gap/2); cX++) {
    tft.drawPixel(cX, cY, colour);
    delay(iDelay);
  }
  for (; cY>(y+(gap/2)); cY--)  {
    tft.drawPixel(cX, cY, colour);
    delay(iDelay);
  }
  for (; cX>(x+(gap/2)); cX--) {
    tft.drawPixel(cX, cY, colour);
    delay(iDelay);
  }
}