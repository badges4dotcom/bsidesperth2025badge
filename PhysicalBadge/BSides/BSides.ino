#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <ArduinoJson.h>
#include <EEPROM.h>
#include <SD.h>
#include <SPI.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>

#include <RLEBitmap.h>

#include "images/Badges4_Icon_Small.h"
#include "images/BlueWren.h"
#include "images/BSides_Perth_2025_Logo.h"
#include "images/Cockatoo.h"
#include "images/Computer.h"
#include "images/Crow.h"
#include "images/Cross.h"
#include "images/CyberEchidna.h"
#include "images/Devil.h"
#include "images/Dingo.h"
#include "images/Echidna.h"
#include "images/Emu.h"
#include "images/Explosion.h"
#include "images/Kangaroo.h"
#include "images/Kookaburra.h"
#include "images/Koala.h"
#include "images/Lightning.h"
#include "images/Parrot.h"
#include "images/Person.h"
#include "images/Person2.h"
#include "images/Person3.h"
#include "images/Person4.h"
#include "images/Person5.h"
#include "images/Person6.h"
#include "images/Person7.h"
#include "images/Snake.h"
#include "images/Spider.h"
#include "images/Tick.h"
#include "images/Tilemap_NonRLE.h"
#include "images/Warning.h"
#include "images/WiFi.h"
#include "images/Wombat.h"

#include "Game_Data.h"

String mainMenuItems[] = {"Start","Status","Wi-Fi", "Reset"};
int mainMenuItemsCount = 4;

SPIClass tftHSPI = SPIClass(HSPI);
Adafruit_ST7735 tft = Adafruit_ST7735(&tftHSPI, TFT_CS, TFT_DC, TFT_RST);

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
int lastKeyRegister = 0;

bool bGameRunning;
UserSettings user;
bool redrawWholeMap;
bool playGameCompletionAnimation;

// Displays the first screen with the BSides Perth Logo.
void displayHomeScreen() {
	initialiseScreenAndText();
  displayImage("Logo", (int16_t)((SCREEN_WIDTH - 96) / 2), 0, 1);

  tft.setCursor(42, 120);
  tft.print("Press any key.");
}

// Displays the badges4 logo.
void displayBadges4Logo() {
	initialiseScreenAndText();
  tft.drawRGBBitmap(64,32,Badges4_Icon_Small,33,32);

  tft.setTextSize(2);
  tft.setTextColor(0xef5d);
  tft.setCursor(16, 70);
  tft.print("badges4.com");

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);

  tft.setCursor(42, 120);
  tft.print("Press any key.");  
}

// Sets up the program.
void setup(void) {
  randomSeed(analogRead(0));

  pinMode(UP_KEY_INPUT, INPUT);
  pinMode(DOWN_KEY_INPUT, INPUT);  
  pinMode(A_KEY_INPUT, INPUT);
  pinMode(B_KEY_INPUT, INPUT);
  pinMode(available_gpio[GPIO_CHALLENGE_PTR], INPUT);   // Enable the additional input for GP Gertrude challenge.
  
  tftHSPI.begin();
  tft.initR(INITR_BLACKTAB);
  tft.setSPISpeed(20000000);
  tft.setRotation(3);

  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(0, 0);

  EEPROM.begin(128);
  readUserSettings();

  displayHomeScreen();
  blockForKeyPress();

  displayBadges4Logo();
  blockForKeyPress();
  blockForKeyPress();

  tft.fillScreen(ST77XX_BLACK);
  runMenuLoop();
}

// Main loop for the menu.
void runMenuLoop() {
  int keyPress;
  int menuItem;

  menuItem = 0;
  while (true) {
    keyPress = 0; // Probably not needed.
    displayMenu(mainMenuItems, mainMenuItemsCount, menuItem, MAX_MENUITEMS_ONSCREEN, 2);
    keyPress = blockForKeyPress();

    if ((keyPress&DOWN_KEY_REGISTER)>0) menuItem++;
    if ((keyPress&UP_KEY_REGISTER)>0) menuItem--;

    // Check to see if its still in bounds.
    if (menuItem > (mainMenuItemsCount-1)) menuItem = mainMenuItemsCount-1;
    if (menuItem < 0) menuItem = 0;

    if ((keyPress&A_KEY_REGISTER)>0) {
      switch (menuItem) {
        case 0:
          if (getNumberOfAnimalsCollected()==0) startIntro(); // If no animals have been collected, do intro.
          runGameLoop();
          break;
        case 1:
          displayStatusOneScreen();
          keyPress = blockForKeyPress();
          keyPress = blockForKeyPress();
          displayStatusTwoScreen();
          keyPress = blockForKeyPress();
          keyPress = blockForKeyPress();
          displayStatusThreeScreen();
          keyPress = blockForKeyPress();
          keyPress = blockForKeyPress();
          break;
        case 2:
          configureWiFi();
          break;
        case 3:
          initialiseUserSettings(true);
          break;
      }
    }
  }
}

// Main game loop.
void runGameLoop() {
  bGameRunning = true;
  redrawWholeMap = true;
  playGameCompletionAnimation = false;

  relocateAnimalsToTheirLocations();
  while (bGameRunning) {
    checkForGameCompletion();

    drawGameMap();
    drawAnimals();
    drawBSidesBenny();
    drawCharacter();

    resetDrawWholeMap();

    checkForMovement();
    checkForInteraction();
  }
}

// I don't know why I didn't use the Arduino loop function ¯\_(ツ)_/¯.
void loop() {
}

