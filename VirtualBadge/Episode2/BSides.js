// Menu items (equivalent to String array)
const mainMenuItems = ["Start", "Status", "Wi-Fi", "Reset"];
const mainMenuItemsCount = 4;

let keysPressed = new Array(NUM_KEYS).fill(false);

// Debounce handling
let lastDebounceTime = 0;
const debounceDelay = 50; // ms
let lastKeyRegister = 0;

// Game state variables
let bGameRunning = false;
let redrawWholeMap = false;
let playGameCompletionAnimation = false;

let displayingMessage = false;

var movementSpeed = 1;
var easterEgg = false;

async function displayHomeScreen() {
    initialiseScreenAndText();
    
    // Simulate displaying an image at coordinates
    displayImage("BSides_Perth_2025_Logo", (SCREEN_WIDTH - 96) / 2, 0, 1);
  
    setTextSize(1);
    setTextColor("white");
    setCursor(28, 120);
    tftPrint("Press any key.");
  }
  
  function displayBadges4Logo() {
    initialiseScreenAndText();
  
    // Simulate bitmap drawing (replace with actual <img> later)
    drawBitmap("Badges4_Icon_Small", 64, 32, 33, 32);
  
    // First text block
    setTextSize(1.5);
    setTextColor("#d3d3d3");
    setCursor(16, 70);
    tftPrint("badges4.com");
  
    // Reset to normal text style
    setTextSize(1);
    setTextColor("white");
    setCursor(28, 120);
    tftPrint("Press any key.");
  }
  
async function setup() {
    setBadgeColour();

    startLCD();

    // TFT setup is replaced by canvas, so no SPI/init needed
    initialiseScreenAndText();
  
    // Simulate reading user settings from EEPROM
    readUserSettings();

    // Display home screen and wait for key press
    displayHomeScreen();
    await blockForKeyPress();
  
    // Display logo and wait for key press twice
    displayBadges4Logo();
    await blockForKeyPress();
  
    // Clear screen
    initialiseScreenAndText();
  
    // Start main menu loop
    runMenuLoop();
  }

async function runMenuLoop() {
  let menuItem = 0;

  while (true) {
    // Display menu
    displayMenu(mainMenuItems, mainMenuItemsCount, menuItem, MAX_MENUITEMS_ONSCREEN, 2);

    // Wait for key press
    const keyPress = await blockForKeyPress();

    // Navigation
    if (keyPress & DOWN_KEY_REGISTER) menuItem++;
    if (keyPress & UP_KEY_REGISTER) menuItem--;

    // Keep menuItem in bounds
    if (menuItem > mainMenuItemsCount - 1) menuItem = mainMenuItemsCount - 1;
    if (menuItem < 0) menuItem = 0;

    // Selection (A key)
    if (keyPress & A_KEY_REGISTER) {
      switch (menuItem) {
        case 0:
          if (getNumberOfItemsCollected() === 0) await startIntro();
          await runGameLoop();
          break;
        case 1:
          await displayStatusOneScreen();
          await blockForKeyPress();
          await displayStatusTwoScreen();
          await blockForKeyPress();
          await displayStatusThreeScreen();
          await blockForKeyPress();
          break;
        case 2:
          await configureWiFi();
          break;
        case 3:
          await initialiseUserSettings(true);
          break;
      }
    }
  }
}

async function runGameLoop() {
    bGameRunning = true;
    redrawWholeMap = true;
    playGameCompletionAnimation = false;
  
    // Place item at starting locations
    relocateItemsToTheirLocations();
  
    // Main loop using requestAnimationFrame
    while (bGameRunning) {
      // Check for game completion
      checkForGameCompletion();
  
      // Draw game
      drawGameMap();
      drawItems();
      drawBSidesBenny();
      drawCharacter();
  
      // Reset map redraw flag
      resetDrawWholeMap();
  
      // Handle input & interactions
      await checkForMovement();
      await checkForInteraction();
        
      // Wait for next frame (~60 FPS)
      await new Promise(requestAnimationFrame);
    }
  }
  