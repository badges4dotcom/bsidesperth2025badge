// ---- Intro sequence ----
async function startIntro() {
  await displayMessageScreen("Person", "Benny", "Hi, I'm Benny. Welcome to BSides Perth 2025.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Null", "Benny", "You're about to enter the BSides metaverse.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Null", "Benny", "To exit the metaverse simply refresh the page. | Your progress will be saved after each animal is collected.", true, true, true);
  await blockForKeyPress();
  await displayMessageScreen("Null", "Benny", "Before you enter, I need to first transform you to a .............. Cyber Echidna!", true, true, true);
  await blockForKeyPress();
  await displayIntroAnimation();
  await blockForKeyPress();
  await displayMessageScreen("Person", "Benny", "Crikey! During the transformation all me animals from the BSides petting zoo got out. | Go collect 'em all!", true, true, true);
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

// ---- Character + animals ----
async function drawCharacter() {
  displayImage("CyberEchidna", (user.locationX % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE, (user.locationY % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE, 3);
}

function drawAnimals() {
  for (let i = 0; i < animals.length; i++) {
    if (isItemWithinView(animals[i].X, animals[i].Y)) {
      if (redrawWholeMap || (Math.abs(animals[i].X - user.locationX) <= 1 && Math.abs(animals[i].Y - user.locationY) <= 1)) {
        displayImage(animals[i].ID, (animals[i].X % (SCREEN_WIDTH / TILE_SIZE)) * TILE_SIZE, (animals[i].Y % (SCREEN_HEIGHT / TILE_SIZE)) * TILE_SIZE, 4);
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
      // First Benny
      if ((user.locationX * TILE_SIZE) < SCREEN_WIDTH) {
        if (isItemWithinView(BSIDES_BENNY_LOCATION_X, BSIDES_BENNY_LOCATION_Y)) {
          displayImage("Person", BSIDES_BENNY_LOCATION_X * TILE_SIZE, BSIDES_BENNY_LOCATION_Y * TILE_SIZE, 5);
        }
      }
  
      // Second Benny
      if (user.missionStatus < 1) {
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
    // --- Check for animals ---
    for (let i = 0; i < animals.length; i++) {
      if (!hasAnimalBeenCollected(i)) {
        if (animals[i].X === user.locationX && animals[i].Y === user.locationY) {
          await collectAnimal(i);
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
  
    // --- Check for Benny (at the Petting Zoo) ---
    if (
      user.locationX === BSIDES_BENNY2_LOCATION_X &&
      user.locationY === BSIDES_BENNY2_LOCATION_Y + 1
    ) {
      await interactWithBSidesBennyPettingZoo();
      redrawWholeMap = true;
      return;
    }
  }


  async function collectAnimal(pos) {
    // Guard for invalid animal index
    if (pos < 0 || pos >= getNumberOfAnimals()) return;
  
    // Don't bother if the animal has already been collected
    if (hasAnimalBeenCollected(pos)) return;
  
    // Mark the animal as collected using bitwise OR
    user.AnimalsCollected |= (1 << pos);
  
    // Build the message
    let strMessage = `You have collected the ${animals[pos].Name}. | ${getNumberOfAnimalsCollectedString()}`;
  
    // Move the animal to the petting zoo
    animals[pos].X = animals[pos].CapturedX;
    animals[pos].Y = animals[pos].CapturedY;

    // Show the message screen
    await displayMessageScreen(animals[pos].ID, animals[pos].Name, strMessage, true, true, true);
    await blockForKeyPress();
  
    // If all animals are collected, flag the end-of-game animation
    if (getNumberOfAnimalsCollected() === getNumberOfAnimals()) {
      playGameCompletionAnimation = true;
    }
  }
  

async function interactWithBSidesBenny() {
    if (user.missionStatus === 0) {
      if (getNumberOfAnimalsCollected() === (getNumberOfAnimals() - 1)) {
        // Play Outro
        displayMessageScreen(
          "CyberEchidna",
          "Cyber Echidna",
          "Ok, I've collected all the animals just as you asked.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Person",
          "Benny",
          "Brilliant! And now to add the last animal ....... the Cyber Echidna! Muhahahahah!",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "CyberEchidna",
          "Cyber Echidna",
          "Ohhhhh hell no! Taaakkeee this!!!",
          true,
          true,
          true
        );
        await blockForKeyPress();
        displayMessageScreen("CyberEchidna", "Cyber Echidna", "Pew! Pew!", true, true, true);
        await blockForKeyPress();
        await new Promise((r) => setTimeout(r, 400));
  
        await displayOutroAnimation();
        await blockForKeyPress();
  
        displayMessageScreen(
          "CyberEchidna",
          "Cyber Echidna",
          "You're going to be a delightful echidna exhibit at the BSides petting zoo Benny.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Echidna",
          "Benny",
          "I will get my revenge Cyber Echidna!!!",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        collectAnimal(13); // Collect the Echidna
        user.missionStatus = 1;
      } else {
        // Come back when you've ...
        let strMessage = `You have only collected ${getNumberOfAnimalsCollected()} out of ${getNumberOfAnimals()} animals.`;
        displayMessageScreen("Person", "Benny", strMessage, true, true, true);
        await blockForKeyPress();
  
        strMessage = "Come back once you have collected all but one.";
        displayMessageScreen("Person", "Benny", strMessage, true, true, true);
        await blockForKeyPress();
      }
    } else {
      return; // No interaction with Benny after he has been collected
    }
  
    user.locationY = user.locationY + 1;
    saveUserSettings();
  }
  
  async function interactWithBSidesBennyPettingZoo() {
    if (user.missionStatus === 0) {
      if (getNumberOfAnimalsCollected() < getNumberOfAnimals()) {
        displayMessageScreen(
          "Person",
          "Benny",
          "Welcome to the BSides petting zoo.",
          true,
          true,
          true
        );
        await blockForKeyPress();
  
        displayMessageScreen(
          "Null",
          "Benny",
          "Feel free to take a look around ... and make yourself at home. Hehehehe {chuckles under breath}",
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
  
  // Sets up the Animal Locations based on whether they've been collected or not.
function relocateAnimalsToTheirLocations() {
    for (let i = 0; i < getNumberOfAnimals(); i++) {
      if (hasAnimalBeenCollected(i)) {
        animals[i].X = animals[i].CapturedX;
        animals[i].Y = animals[i].CapturedY;
      } else {
        animals[i].X = animals[i].InitialX;
        animals[i].Y = animals[i].InitialY;
      }
    }
  }
  
  // Checks whether an Animal has been collected.
  function hasAnimalBeenCollected(pos) {
    if (pos < 0 || pos >= getNumberOfAnimals()) return false;
  
    // Use bitwise check same as Arduino code
    return (user.AnimalsCollected & (1 << pos)) > 0;
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
  
  // Returns the number of animals to collect.
  function getNumberOfAnimals() {
    return animals.length;
  }
  
  // Returns the number of animals collected.
  function getNumberOfAnimalsCollected() {
    let numAnimals = 0;
    let iAnimals = user.AnimalsCollected;
  
    while (iAnimals) {
      numAnimals += (iAnimals & 1);
      iAnimals >>= 1;
    }
  
    return numAnimals;
  }
  