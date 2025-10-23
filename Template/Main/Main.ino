#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>
#include <WiFi.h>

#include "Definitions.h"

SPIClass tftHSPI = SPIClass(HSPI);
Adafruit_ST7735 tft = Adafruit_ST7735(&tftHSPI, TFT_CS, TFT_DC, TFT_RST);

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
int lastKeyRegister = 0;

// Sets up the program.
void setup(void) {
  pinMode(UP_KEY_INPUT, INPUT);
  pinMode(DOWN_KEY_INPUT, INPUT);  
  pinMode(A_KEY_INPUT, INPUT);
  pinMode(B_KEY_INPUT, INPUT);
  
  tftHSPI.begin();
  tft.initR(INITR_BLACKTAB);
  tft.setSPISpeed(20000000);
  tft.setRotation(3);

  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(0, 0);

  // Connect to WiFi
  /*
  configureWiFi();
  connectToWiFi("BSidesWiFi","DoesThisWiFiAPEvenExist?");   // Not a real AP. Returns True if the connection is successful, False otherwise.
  */
}

void loop() {
  displayTextDisplay();
  displaySpirals();
}

