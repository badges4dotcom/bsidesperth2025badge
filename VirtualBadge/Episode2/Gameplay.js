// ---- Intro sequence ----
async function startIntro() {
  await displayIntroMessage();
  await blockForKeyPress();  
  await displayMessageScreen("Person", "Benny", "Hi, I'm Benny. Welcome to BSides Perth 2025.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Null", "Benny", "You're about to re-enter the BSides metaverse.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Null", "Benny", "To exit the metaverse simply refresh the page. | Your progress will be saved after each item is collected.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Person", "Benny", "Back in 2025, I left the BSides petting zoo, and transformed myself back to a human. I can help you transform back too.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Person", "Benny", "I just need the parts for the machine. They're scattered across the metaverse.", true, true, true);
  await blockForKeyPress();
}

// ---- Map rendering ----
function resetDrawWholeMap() {
  redrawWholeMap = false;
}

function drawGameMap() {
  const xTiles = SCREEN_WIDTH / TILE_SIZE;
  const yTiles = SCREEN_HEIGHT / TILE_SIZE;

  const tileXOffset = Math.floor(user.locationX / xTiles);
  const tileYOffset = Math.floor(user.locationY / yTiles);

  for (let tileY = 0; tileY < yTiles; tileY++) {
    for (let tileX = 0; tileX < xTiles; tileX++) {
      const gameMapX = tileXOffset * xTiles + tileX;
      const gameMapY = tileYOffset * yTiles + tileY;

      let validTileRedraw = false;
      if (redrawWholeMap) validTileRedraw = true;
      else if (gameMapX === user.lastLocationX && gameMapY === user.lastLocationY) {
        if (!((user.locationX==user.lastLocationX) && (user.locationY==user.lastLocationY))) {
          validTileRedraw = true;
        }
      }

      if (validTileRedraw) {
        // draw background
        drawTile(tileX, tileY, (tileX % 2) + 8, false);

        if (gameMapY >= 0 && gameMapY < gameMap.length) {
          // overlay tile if not blank
          const tileID = gameMap[gameMapY][gameMapX];
          if (tileID !== -1) {
            drawTile(tileX, tileY, tileID, true);
          }
        }
      }
    }
  }
}

function drawTile(tileX, tileY, tileID, useTransparency) {
  const offsetY = Math.floor(tileID / (TILEMAP_WIDTH / TILE_SIZE)) * TILEMAP_WIDTH * TILE_SIZE +
                  (tileID % (TILEMAP_WIDTH / TILE_SIZE)) * TILE_SIZE;

  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const imgArrPos = offsetY + y * TILEMAP_WIDTH + x;
      const color = Tilemap[imgArrPos];
      if (!useTransparency || color !== 0xFFFF) {
        ctx.fillStyle = color565ToHex(color);
        ctx.fillRect(tileX * TILE_SIZE + x, tileY * TILE_SIZE + y, 1, 1);
      }
    }
  }
}

// ---- Character + items ----
async function drawCharacter() {
  displayImage("CyberEchidna", (user.locationX % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE, (user.locationY % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE, 3);
}

function drawItems() {
  for (let i = 0; i < items.length; i++) {
    if (isItemWithinView(items[i].X, items[i].Y)) {
      if (redrawWholeMap || (Math.abs(items[i].X - user.locationX) <= 1 && Math.abs(items[i].Y - user.locationY) <= 1)) {
        displayImage(items[i].ID, (items[i].X % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE, (items[i].Y % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE, 4);
      }
    }
  }
}

function isItemWithinView(x, y) {
  const xTiles = SCREEN_WIDTH / TILE_SIZE;
  const yTiles = SCREEN_HEIGHT / TILE_SIZE;

  const xLower = Math.floor(user.locationX / xTiles) * xTiles;
  const xUpper = xLower + xTiles;
  const yLower = Math.floor(user.locationY / yTiles) * yTiles;
  const yUpper = yLower + yTiles;

  return x >= xLower && x < xUpper && y >= yLower && y < yUpper;
}

// Draws the two Bennys on the screen
function drawBSidesBenny() {
    if (!redrawWholeMap) return;
  
    if (user.missionStatus < 1) {
      if (isItemWithinView(BSIDES_BENNY_LOCATION_X, BSIDES_BENNY_LOCATION_Y)) {
        displayImage(
          "Person",
          (BSIDES_BENNY_LOCATION_X % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE,
          (BSIDES_BENNY_LOCATION_Y % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE,
          5
        );
      }

      if (isItemWithinView(BSIDES_BENNY2_LOCATION_X, BSIDES_BENNY2_LOCATION_Y)) {
        displayImage(
          "Person",
          (BSIDES_BENNY2_LOCATION_X % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE,
          (BSIDES_BENNY2_LOCATION_Y % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE,
          5
        );
      }
    }
  }
  
  function checkForMovement() {  
    // Block/wait until a key press is received
    let keyPress = checkForKeyPress();
    resetKeysPress();
    if (keyPress==0) return;

    for (var i=0; i<movementSpeed; i++) {  
      let nextPersonX = user.locationX;
      let nextPersonY = user.locationY;

      // Update location based on input
      if ((keyPress & UP_KEY_REGISTER) > 0) nextPersonY = user.locationY - 1;
      if ((keyPress & DOWN_KEY_REGISTER) > 0) nextPersonY = user.locationY + 1;
      if ((keyPress & A_KEY_REGISTER) > 0) nextPersonX = user.locationX - 1;
      if ((keyPress & B_KEY_REGISTER) > 0) nextPersonX = user.locationX + 1;
    
      // Check bounds
      if (nextPersonX < 0) nextPersonX = 0;
      if (nextPersonX >= MAP_SIZE_WIDTH) nextPersonX = MAP_SIZE_WIDTH - 1;
      if (nextPersonY < 0) nextPersonY = 0;
      if (nextPersonY >= MAP_SIZE_HEIGHT) nextPersonY = MAP_SIZE_HEIGHT - 1;
    
      // If no object blocks the move, update position
      if (!isThereAnObject(nextPersonX, nextPersonY)) {
        checkForScreenRedraw(nextPersonX, nextPersonY);
    
        //if ((user.lastLocationX == nextPersonX) && (user.lastLocationY == nextPersonY)) return;

        user.lastLocationX = user.locationX;
        user.lastLocationY = user.locationY;
        user.locationX = nextPersonX;
        user.locationY = nextPersonY;
      }
    }
  }

  function checkForScreenRedraw(nextPersonX, nextPersonY) {
    // Guard for out-of-bounds
    if (nextPersonX < 0 || nextPersonX >= MAP_SIZE_WIDTH) return;
    if (nextPersonY < 0 || nextPersonY >= MAP_SIZE_HEIGHT) return;
  
    const xTiles = Math.floor(SCREEN_WIDTH / TILE_SIZE);
    const yTiles = Math.floor(SCREEN_HEIGHT / TILE_SIZE);
  
    // If user has moved across a "page", trigger a redraw
    if (user.locationX !== nextPersonX) {
      if ((user.locationX % xTiles === 0) && (nextPersonX % xTiles === xTiles - 1)) {
        redrawWholeMap = true;
      }
      if ((user.locationX % xTiles === xTiles - 1) && (nextPersonX % xTiles === 0)) {
        redrawWholeMap = true;
      }
    }
  
    if (user.locationY !== nextPersonY) {
      if ((user.locationY % yTiles === 0) && (nextPersonY % yTiles === yTiles - 1)) {
        redrawWholeMap = true;
      }
      if ((user.locationY % yTiles === yTiles - 1) && (nextPersonY % yTiles === 0)) {
        redrawWholeMap = true;
      }
    }
  }
  

// --- Interactions ---
async function checkForInteraction() {
    // --- Check for items ---
    for (let i = 0; i < items.length; i++) {
      if (!hasItemBeenCollected(i)) {
        if (items[i].X === user.locationX && items[i].Y === user.locationY) {
          await collectItem(i);
          saveUserSettings();
          redrawWholeMap = true;
          return;
        }
      }
    }
  
    // --- Check for challenges ---
    for (let i = 0; i < challenges.length; i++) {
      if (challenges[i].X === user.locationX && challenges[i].Y === user.locationY) {
        await performChallenge(i);
        saveUserSettings();
        redrawWholeMap = true;
        return;
      }
    }
  
    // --- Check for Benny (at the start) ---
    if (
      user.locationX === BSIDES_BENNY_LOCATION_X &&
      user.locationY === BSIDES_BENNY_LOCATION_Y + 1
    ) {
      await interactWithBSidesBenny();
      redrawWholeMap = true;
      return;
    }
  
    // --- Check for Benny (at the BSides Lab) ---
    if (
      user.locationX === BSIDES_BENNY2_LOCATION_X &&
      user.locationY === BSIDES_BENNY2_LOCATION_Y + 1
    ) {
      await interactWithBSidesBennyBSidesAtStart();
      redrawWholeMap = true;
      return;
    }
  }

async function interactWithBSidesBenny() {
    if (user.missionStatus === 0) {
      if (getNumberOfItemsCollected() === (getNumberOfItems())) {
        // Play Outro
        displayMessageScreen(
          "CyberEchidna",
          "Cyber Echidna",
          "Ok, I've collected all the items just as you asked.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Person",
          "Benny",
          "Brilliant! Those parts are going to make a sweet gaming rig!",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "CyberEchidna",
          "Cyber Echidna",
          "A gaming rig??! I thought you were building a machine to transform me back?",
          true,
          true,
          true
        );
        await blockForKeyPress();

        displayMessageScreen(
          "Person",
          "Benny",
          "Don't worry, don't worry! I only needed the one prism and the laser pointer.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        await displayOutroAnimation();
        await blockForKeyPress();
  
        displayMessageScreen(
          "Person8",
          "BSides Participant",
          "Oh wow, thanks for changing me back Benny.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Person",
          "Benny",
          "You're welcome BSides Perth 2025 Participant. Enjoy the rest of the conference.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        // Play end of game animation.
        playGameCompletionAnimation = true;
        checkForGameCompletion();

        user.missionStatus = 1;
      } else {
        // Come back when you've ...
        let strMessage = `You have only collected ${getNumberOfItemsCollected()} out of ${getNumberOfItems()} items.`;
        displayMessageScreen("Person", "Benny", strMessage, true, true, true);
        await blockForKeyPress();
  
        strMessage = "Come back to me once you have collected all of them.";
        displayMessageScreen("Person", "Benny", strMessage, true, true, true);
        await blockForKeyPress();
      }
    } else {
      return; // No interaction with Benny after he has been collected
    }
  
    user.locationX = user.locationX + 1;
    saveUserSettings();
  }
  
  async function interactWithBSidesBennyBSidesAtStart() {
    if (user.missionStatus === 0) {
      if (getNumberOfItemsCollected() < getNumberOfItems()) {
        displayMessageScreen(
          "Person",
          "Benny",
          "Welcome back to the BSides metaverse.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Null",
          "Benny",
          "Collect all the items in the metaverse and then come see me at the BSides Lab.",
          true,
          true,
          true
        );

        await blockForKeyPress();
        await blockForKeyPress();
      }
    }
  
    user.locationY = user.locationY + 1;
    saveUserSettings();
  }
  
  // Sets up the item Locations based on whether they've been collected or not.
function relocateItemsToTheirLocations() {
    for (let i = 0; i < getNumberOfItems(); i++) {
      if (hasItemBeenCollected(i)) {
        items[i].X = items[i].CapturedX;
        items[i].Y = items[i].CapturedY;
      } else {
        items[i].X = items[i].InitialX;
        items[i].Y = items[i].InitialY;
      }
    }
  }
  
  // Checks whether an item has been collected.
  function hasItemBeenCollected(pos) {
    if (pos < 0 || pos >= getNumberOfItems()) return false;
  
    // Use bitwise check same as Arduino code
    return (user.ItemsCollected & (1 << pos)) > 0;
  }
  
  // Collects the item if it hasn't been collected.
async function collectItem(pos) {
    
    if (pos < 0 || pos >= getNumberOfItems()) return;
  
    // Don't bother if the item has been collected.
    if (hasItemBeenCollected(pos)) return;
  
    // Set the flag for the item being collected.
    user.ItemsCollected |= (1 << pos);
  
    let strMessage = `You have collected the ${items[pos].Name}. | ${getNumberOfItemsCollectedString()}`;
    displayMessageScreen(items[pos].ID, items[pos].Name, strMessage, true, true, true);
    await blockForKeyPress();
  
    // Move the item to the BSides Lab.
    items[pos].X = items[pos].CapturedX;
    items[pos].Y = items[pos].CapturedY;

    redrawWholeMap = true;
  }
  
  // Checks for game completion flag, and if true, display end-of-game animation.
  function checkForGameCompletion() {
    if (playGameCompletionAnimation) {
      playEndOfGameAnimation();
      playGameCompletionAnimation = false;
    }
  }
  
  // Checks to see if there is an object at x, y.
  function isThereAnObject(x, y) {
    if (x < 0 || x >= MAP_SIZE_WIDTH) return false;
    if (y < 0 || y >= MAP_SIZE_HEIGHT) return false;
  
    if ((x === BSIDES_BENNY_LOCATION_X && y === BSIDES_BENNY_LOCATION_Y) ||
        (x === BSIDES_BENNY2_LOCATION_X && y === BSIDES_BENNY2_LOCATION_Y)) {
      return true;
    }
  
    const tileID = gameMap[y][x];
    if (tileID === -1) return false; // A blank tile has no object.
  
    // Tiles in the tile map in the top-right hand corner have no object.
    const tileRow = Math.floor(tileID / (TILEMAP_WIDTH / TILE_SIZE));
    if ((tileID % (TILEMAP_WIDTH / TILE_SIZE)) >= TILE_FREEZONE_COLUMN && tileRow <= TILE_FREEZONE_ROW) {
      return false;
    }
  
    return true;
  }
  
  // Returns the number of items to collect.
  function getNumberOfItems() {
    return items.length;
  }
  
  // Returns the number of items collected.
  function getNumberOfItemsCollected() {
    let numitems = 0;
    let iitems = user.ItemsCollected;
  
    while (iitems) {
      numitems += (iitems & 1);
      iitems >>= 1;
    }
  
    return numitems;
  }
  