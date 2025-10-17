
// Initialises the screen black, and sets the text white.
void initialiseScreenAndText() {
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(1);
  tft.setTextWrap(true);
}

// Draws text at a point on screen.
void drawText(String strText, int x, int y, int size, uint16_t colour) {
  tft.setTextColor(colour);
  tft.setTextSize(size);
  tft.setCursor(x, y);
  tft.print(strText);
}

// Displays the menu on the screen.
void displayMenu(String menuItems[], int menuItemsCount, int menuItem, int numItemsOnScreen, int fontSize) {
  int upperBound;
  int menuItemHeight;
  int y;

  // Find the upper bound of menu items.
  upperBound = menuItem + numItemsOnScreen;
  if (upperBound>=menuItemsCount) upperBound = menuItemsCount-1;

  // Calculate Menu Item Height
  menuItemHeight = SCREEN_HEIGHT / numItemsOnScreen;

  y = 0;
  //tft.fillScreen(ST77XX_BLACK); // Disabled to reduce screen
  tft.setTextSize(fontSize);
  for (int i=menuItem; i<=upperBound; i++) {
    if (i==menuItem) {
      tft.setTextColor(ST77XX_BLACK);
      tft.fillRect(0, 0, SCREEN_WIDTH, menuItemHeight, ST77XX_WHITE);
    } else {
      tft.setTextColor(ST77XX_WHITE);
      tft.fillRect(0, y, SCREEN_WIDTH, menuItemHeight, ST77XX_BLACK);
    }

    tft.setCursor(6, y+12);
    tft.print(menuItems[i]);
    y = y + menuItemHeight;
  }

  if (y < SCREEN_HEIGHT) tft.fillRect(0, y, SCREEN_WIDTH, SCREEN_HEIGHT-y, ST77XX_BLACK);
}

// Displays the progress bar on the screen (used in the challenges).
unsigned int displayProgressBar(int time, int startTime, int curTime) {
	float timeRemainingPercent;
	int timeRemaining;

	timeRemainingPercent = time - ((curTime-startTime)/1000);
	timeRemaining = timeRemainingPercent;
	timeRemainingPercent = 1 - (timeRemainingPercent / time);
	timeRemainingPercent = timeRemainingPercent * SCREEN_WIDTH;

	if (curTime==startTime) tft.fillRect(0, SCREEN_HEIGHT-50, SCREEN_WIDTH, 20, ST77XX_BLUE);
	else tft.fillRect(SCREEN_WIDTH-timeRemainingPercent, SCREEN_HEIGHT-50, SCREEN_WIDTH, 20, ST77XX_BLACK);
	
	tft.setCursor(20, SCREEN_HEIGHT-20);
	if (curTime!=startTime) tft.fillRect(20, SCREEN_HEIGHT-20, 20, 10, ST77XX_BLACK);
	tft.print(timeRemaining);
	if (curTime==startTime) tft.print(" seconds remaining");	

	return timeRemaining;
}

void displayResponseStatus(uint16_t colour) {
  tft.fillCircle(SCREEN_WIDTH-5, 5, 5, colour);
}