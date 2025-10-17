# BSides Perth 2025 Badge

## Physical Badge Download Instructions

To download the code to the physical badge, perform the following:
1. Download and install Arduino IDE from [https://www.arduino.cc/en/software/](https://www.arduino.cc/en/software/)
2. Open Arduino IDE
3. In the menu, navigate to File>Open... , and select the project folder.
4. In the drop down box at the top of the window, select "Select other board and port..."
5. Select "DOIT ESP32 DEVKIT V1". If it is not available, follow "Install ESP32 Boards" instructions below.
6. On the left of the window, click the books icon (Library Manager).
7. Install the following libraries: SD, Adafruit BusIO, Adafruit GFX Library, Adafruit ST7735 and ST7789 Library, ArduinoJson, and RLEBitmap.
8. Plug in ESP32 into USB port.
9. In the menu, select Tools > Port, and select the port corresponding with the USB Serial / ESP32.
10. In the menu, select Sketch > Upload
11. Upload should take about 1-5mins.

## Install ESP32 Boards

1. In the Arduino window, select the "Boards Manager" item/icon on the left hand side.
2. Search for ESP32 in the search bar at the top.
3. Click on the "Install" button under "esp32 by Espressif""
