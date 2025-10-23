// Pins for the TFT screen.
#define TFT_CS     15
#define TFT_SCLK   14
#define TFT_DC     27     // Marked as A0 on TFT Display (Rev A: Pin 12, Rev B: 27)
#define TFT_MOSI   13
#define TFT_RST    4

// Pins for the SD Screen.
// Note: Confirmed working pins for RevB.
#define SD_CS   21
#define SD_SCLK 14
#define SD_MISO 12
#define SD_MOSI 13

// Pins for the button inputs.
#define UP_KEY_INPUT    25
#define DOWN_KEY_INPUT  26
#define A_KEY_INPUT     19
#define B_KEY_INPUT     18

// Bitwise registers for the button inputs.
#define UP_KEY_REGISTER   1
#define DOWN_KEY_REGISTER 2
#define A_KEY_REGISTER    4
#define B_KEY_REGISTER    8

// TFT Screen pixel width and height.
#define SCREEN_WIDTH  160
#define SCREEN_HEIGHT 128
