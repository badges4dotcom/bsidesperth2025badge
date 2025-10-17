
// This function performs the introduction to the game.
void startIntro() {
	int keyPress;

	displayMessageScreen("Person", "Benny", "Hi, I'm Benny. Welcome to BSides Perth 2025.", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
	displayMessageScreen("Null", "Benny", "You're about to enter the BSides metaverse.", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
	displayMessageScreen("Null", "Benny", "To exit the metaverse hold [UP]+[DOWN] at the same time. Your progress will be saved.", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
	displayMessageScreen("Null", "Benny", "Before you enter, I need to first transform you to a .............. Cyber Echidna!", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
	displayIntroAnimation();
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();	
	displayMessageScreen("Person", "Benny", "Crikey! During the transformation all me animals from the BSides petting zoo got out. | Go collect 'em all!", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
}

// This function resets the flag used to redraw the whole map.
void resetDrawWholeMap() {
	redrawWholeMap = false;
}

// This function draws the game map.
void drawGameMap() {
	uint16_t tileBuffer[TILE_SIZE * TILE_SIZE]; // Buffer for one tile
	int tileID;
	int tileXOffset, tileYOffset;
	int gameMapX, gameMapY;
	int validTileRedraw;

	// Figure out how many "pages" we're across and down on the map.
	tileXOffset = (user.locationX/(SCREEN_WIDTH / TILE_SIZE));
	tileYOffset = (user.locationY/(SCREEN_HEIGHT / TILE_SIZE));

  tft.startWrite();
  for (int tileY = 0; tileY < SCREEN_HEIGHT / TILE_SIZE; tileY++) {
    for (int tileX = 0; tileX < SCREEN_WIDTH / TILE_SIZE; tileX++) {
			// Calculate the specific X, Y coordinate of the current tile.
			gameMapX = (tileXOffset*(SCREEN_WIDTH / TILE_SIZE))+tileX;
			gameMapY = (tileYOffset*(SCREEN_HEIGHT / TILE_SIZE))+tileY;

			// A tile redraw is only required if the whole map needs a refresh, or the Cyber Echidna has moved.
			validTileRedraw = false;
			if (redrawWholeMap) validTileRedraw = true;
			else {
				if ((gameMapX==(user.lastLocationX)) && (gameMapY==(user.lastLocationY))) validTileRedraw = true;
			}

			// Draw the tile.
			if (validTileRedraw) {
				// Draw generic background.
				drawTile((uint16_t *) &tileBuffer, (tileX%2)+8, false);

				// Get the Tile ID of the tile at X, Y in the map, and draw it.
				tileID = gameMap[gameMapY][gameMapX];
				if (tileID!=-1) {									// Ignore blank tiles as they will be the background
					drawTile((uint16_t *) &tileBuffer, tileID, true);
				}

				// Set window for tile location
				tft.setAddrWindow(tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
				tft.writePixels(tileBuffer, TILE_SIZE * TILE_SIZE, true);
			}
    }
  }
  tft.endWrite();
}

// Draws the animal on the screen.
void drawAnimals() {
	for (int i=0; i<getNumberOfAnimals(); i++) {
		if (isItemWithinView(animals[i].X, animals[i].Y)) {
			// If the whole map has been asked to be redraw, draw the animals in view. Else, only draw the animal in view if it is 1x1 square away from Cyber Echidna.
			if (redrawWholeMap) displayImage(animals[i].ID, (animals[i].X%(SCREEN_WIDTH / TILE_SIZE))*TILE_SIZE, (animals[i].Y%(SCREEN_HEIGHT / TILE_SIZE))*TILE_SIZE, 4);
				else {
				if ((abs(animals[i].X-user.locationX)<=1) && (abs(animals[i].Y-user.locationY)<=1)) displayImage(animals[i].ID, (animals[i].X%(SCREEN_WIDTH / TILE_SIZE))*TILE_SIZE, (animals[i].Y%(SCREEN_HEIGHT / TILE_SIZE))*TILE_SIZE, 4);
			}
		}			
	}
}

// Checks to see if the x, y location specified is within the current user's view.
bool isItemWithinView(int x, int y) {
	int xLower, xUpper;
	int yLower, yUpper;

	xLower = (user.locationX/(SCREEN_WIDTH / TILE_SIZE));
	xUpper = (xLower+1)*(SCREEN_WIDTH / TILE_SIZE);
	xLower = xLower*(SCREEN_WIDTH / TILE_SIZE);

	yLower = (user.locationY/(SCREEN_HEIGHT / TILE_SIZE));
	yUpper = (yLower+1)*(SCREEN_HEIGHT / TILE_SIZE);
	yLower = yLower*(SCREEN_HEIGHT / TILE_SIZE);

	if ((x>=xLower)&&(x<xUpper)) {
		if ((y>=yLower)&&(y<yUpper)) {
			return true;
		}
	}

	return false;
}

// Draws a tile at the location specifed by tileBuffer.
void drawTile(uint16_t *tileBuffer, int tileID, bool useTransparency) {
	int imgArrPos;
	int offsetY;

	if (tileBuffer==NULL) return;
	if ((tileID<0) || (tileID>((TILEMAP_WIDTH*TILEMAP_HEIGHT)/(TILE_SIZE*TILE_SIZE)))) return;

	// Please don't get me to explain the math on this one :'(.
	offsetY = (((int)(tileID/(TILEMAP_WIDTH/TILE_SIZE)))*TILEMAP_WIDTH*TILE_SIZE)+((tileID%(TILEMAP_WIDTH/TILE_SIZE))*TILE_SIZE);
	for (int y = 0; y < TILE_SIZE; y++) {
		for (int x = 0; x < TILE_SIZE; x++) {
			imgArrPos = offsetY + (y*TILEMAP_WIDTH) + x;
			if (useTransparency) {
				if (Tilemap[imgArrPos]!=0xFFFF) tileBuffer[y * TILE_SIZE + x] = Tilemap[imgArrPos];
			} else {
				tileBuffer[y * TILE_SIZE + x] = Tilemap[imgArrPos];
			}
		}
	}
}

// Draws the Cyber Echidna at its current location.
void drawCharacter() {
	displayImage("CyberEchidna", (user.locationX%(SCREEN_WIDTH / TILE_SIZE))*TILE_SIZE, (user.locationY%(SCREEN_HEIGHT / TILE_SIZE))*TILE_SIZE, 3);
}

// Draws the two Bennys on the screen.
void drawBSidesBenny() {
	if (!redrawWholeMap) return;

	if (user.missionStatus<1) {
		if ((user.locationX*TILE_SIZE)<SCREEN_WIDTH) {
			if (isItemWithinView(BSIDES_BENNY_LOCATION_X, BSIDES_BENNY_LOCATION_Y)) displayImage("Person", BSIDES_BENNY_LOCATION_X*TILE_SIZE, BSIDES_BENNY_LOCATION_Y*TILE_SIZE, 5);
		}

		if (user.missionStatus<1) {
			if (isItemWithinView(BSIDES_BENNY2_LOCATION_X, BSIDES_BENNY2_LOCATION_Y)) displayImage("Person", (BSIDES_BENNY2_LOCATION_X%(SCREEN_WIDTH/TILE_SIZE))*TILE_SIZE, (BSIDES_BENNY2_LOCATION_Y%(SCREEN_HEIGHT/TILE_SIZE))*TILE_SIZE, 5);
		}
	}
}

// Checks to see if the user has provided any input.
void checkForMovement() {
  int keyPress;
  int nextPersonX, nextPersonY;

	// Block/wait until something is pressed.
	keyPress = blockForKeyPress();

	// Set the next location as the current location for the time being.
	nextPersonX = user.locationX;
	nextPersonY = user.locationY;

	// Check to see if the user wants to exit.
	if (((keyPress & UP_KEY_REGISTER) > 0) && ((keyPress & DOWN_KEY_REGISTER) > 0)) {		// If the Up Button and Down Button are pressed, exit game.
		bGameRunning = false;
		return;
	}

	// Update location based on input.
	if ((keyPress & UP_KEY_REGISTER) > 0) nextPersonY = user.locationY - 1;
	if ((keyPress & DOWN_KEY_REGISTER) > 0) nextPersonY = user.locationY + 1;
	if ((keyPress & A_KEY_REGISTER) > 0) nextPersonX = user.locationX - 1;
	if ((keyPress & B_KEY_REGISTER) > 0) nextPersonX = user.locationX + 1;

	// Check for the bounds.
	if (nextPersonX<0) nextPersonX = 0;
	if (nextPersonX>=MAP_SIZE_WIDTH) nextPersonX=(MAP_SIZE_WIDTH-1);
	if (nextPersonY<0) nextPersonY = 0;
	if (nextPersonY>=MAP_SIZE_HEIGHT) nextPersonY = MAP_SIZE_HEIGHT-1;

	// If there isn't an object in the next location, update location and possibly prompt for a screen redraw.
	if (!isThereAnObject(nextPersonX, nextPersonY)) {
		checkForScreenRedraw(nextPersonX, nextPersonY);
		user.lastLocationX = user.locationX;
		user.lastLocationY = user.locationY;
		user.locationX = nextPersonX;
		user.locationY = nextPersonY;
	}
}

// Checks to see whether an all-of-screen redraw is required.
void checkForScreenRedraw(int nextPersonX, int nextPersonY) {
	int xTiles, yTiles;

	if ((nextPersonX<0) || (nextPersonX>=MAP_SIZE_WIDTH)) return;
	if ((nextPersonY<0) || (nextPersonY>=MAP_SIZE_HEIGHT)) return;

	xTiles = SCREEN_WIDTH / TILE_SIZE;
	yTiles = SCREEN_HEIGHT / TILE_SIZE;

	// If the Cyber Echidna has moved across a "page", redraw.
	if (user.locationX != nextPersonX) {
		if (((user.locationX%xTiles)==0) && ((nextPersonX%xTiles)==(xTiles-1))) redrawWholeMap = true;
		if (((user.locationX%xTiles)==(xTiles-1)) && ((nextPersonX%xTiles)==0)) redrawWholeMap = true;
	}
	if (user.locationY != nextPersonY) {
		if (((user.locationY%yTiles)==0) && ((nextPersonY%yTiles)==(yTiles-1))) redrawWholeMap = true;
		if (((user.locationY%yTiles)==(yTiles-1)) && ((nextPersonY%yTiles)==0)) redrawWholeMap = true;
	}	
}

// Checks to see if some interaction needs to take place.
void checkForInteraction() {
	int i;

	// If an animal is there, and hasn't been collect it, collect it.
	for (i=0; i<getNumberOfAnimals(); i++) {
		if (!hasAnimalBeenCollected(i)) {
			if (animals[i].X==user.locationX) {
				if (animals[i].Y==user.locationY) {
					collectAnimal(i);
					saveUserSettings();
					redrawWholeMap = true;
					return;
				}
			}
		}
	}

	// If an challenge is there, perform it.
	for (i=0; i<getNumberOfChallenges(); i++) {
		if (challenges[i].X==user.locationX) {
			if (challenges[i].Y==user.locationY) {
				performChallenge(i);
				saveUserSettings();
				redrawWholeMap = true;
				return;
			}
		}			
	}

	// If Benny (at the start) is there, interact with him.
	if (user.locationX==BSIDES_BENNY_LOCATION_X) {
		if (user.locationY==BSIDES_BENNY_LOCATION_Y+1) {
			interactWithBSidesBenny();
			redrawWholeMap = true;
			return;
		}
	}

	// If Benny (at the Petting Zoo) is there, interact with him.
	if (user.locationX==BSIDES_BENNY2_LOCATION_X) {
		if (user.locationY==BSIDES_BENNY2_LOCATION_Y+1) {
			interactWithBSidesBennyPettingZoo();
			redrawWholeMap = true;
			return;
		}
	}
}

// Plays the scripts for an interaction with Benny.
void interactWithBSidesBenny() {
	String strMessage;
	int keyPress;

	if (user.missionStatus==0) {
		if (getNumberOfAnimalsCollected()==(getNumberOfAnimals()-1)) {
			//Play Outro
			displayMessageScreen("CyberEchidna", "Cyber Echidna", "Ok, I've collected all the animals just as you asked.", true, true, true);
			keyPress = blockForKeyPress();
			displayMessageScreen("Person", "Benny", "Brilliant! And now to add the last animal ....... the Cyber Echidna! Muhahahahah!", true, true, true);
			keyPress = blockForKeyPress();
			displayMessageScreen("CyberEchidna", "Cyber Echidna", "Ohhhhh hell no! Taaakkeee this!!!", true, true, true);
			displayMessageScreen("CyberEchidna", "Cyber Echidna", "Pew! Pew!", true, true, true);
			delay(400);

			displayOutroAnimation();
			keyPress = blockForKeyPress();
			keyPress = blockForKeyPress();

			displayMessageScreen("CyberEchidna", "Cyber Echidna", "You're going to be a delightful echidna exhibit at the BSides petting zoo Benny.", true, true, true);
			keyPress = blockForKeyPress();
			displayMessageScreen("Echidna", "Benny", "I will get my revenge Cyber Echidna!!!", true, true, true);
			keyPress = blockForKeyPress();

			collectAnimal(13); // Collect the Echidna.
			user.missionStatus = 1;
		} else {
			// Come back when you've ....
			strMessage = "You have only collected ";
			strMessage += getNumberOfAnimalsCollected();
			strMessage += " out of ";
			strMessage += getNumberOfAnimals();
			strMessage += " animals.";
			displayMessageScreen("Person", "Benny", strMessage, true, true, true);
			keyPress = blockForKeyPress();

			strMessage = "Come back once you have collected all but one.";
			displayMessageScreen("Person", "Benny", strMessage, true, true, true);
			keyPress = blockForKeyPress();
		}
	} else return;	// No interaction with Benny after he has been collected.

	user.locationY = user.locationY + 1;
	saveUserSettings();
}

// Plays the scripts for interacting with Benny at the Petting Zoo.
void interactWithBSidesBennyPettingZoo() {
	String strMessage;
	int keyPress;

	if (user.missionStatus==0) {
		if (getNumberOfAnimalsCollected()<getNumberOfAnimals()) {
			displayMessageScreen("Person", "Benny", "Welcome to the BSides petting zoo.", true, true, true);
			keyPress = blockForKeyPress();
			displayMessageScreen("Null", "Benny", "Feel free to take a look around ... and make yourself at home. Hehehehe {chuckles under breath}", true, true, true);
			keyPress = blockForKeyPress();
			keyPress = blockForKeyPress();
		}
	}

	user.locationY = user.locationY + 1;
	saveUserSettings();
}

// Sets up the Animal Locations based on whether they've been collected or not.
void relocateAnimalsToTheirLocations() {
	int i;
	for (i=0; i<getNumberOfAnimals(); i++) {
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
bool hasAnimalBeenCollected(int pos) {
	if ((pos<0) || (pos>=getNumberOfAnimals())) return false;

	if ((user.AnimalsCollected & ((uint16_t) pow(2, pos))) > 0) return true;
	return false;
}

// Collects the animal if it hasn't been collected.
void collectAnimal(int pos) {
	int keyPress;
	String strMessage;

	if ((pos<0) || (pos>=getNumberOfAnimals())) return;

	// Don't bother if the animal has been collected.
	if (hasAnimalBeenCollected(pos)) return;

	// Set the flag for the animal being collected.
	user.AnimalsCollected |= ((uint16_t) pow(2, pos));

	strMessage = "You have collected the ";
	strMessage += animals[pos].Name;
	strMessage += ". | ";
	strMessage += getNumberOfAnimalsCollectedString();

  displayMessageScreen(animals[pos].ID, animals[pos].Name, strMessage, true, true, true);
  keyPress = blockForKeyPress();

	// Move the animal to the petting zoo.
	animals[pos].X = animals[pos].CapturedX;
	animals[pos].Y = animals[pos].CapturedY;

	// If all animals have been collected, play the end-of-game animation.
	if (getNumberOfAnimalsCollected()==getNumberOfAnimals()) {
		playGameCompletionAnimation = true;
	}
}

// Checks for game completion flag, and if true, display end-of-game animation.
void checkForGameCompletion() {
	if (playGameCompletionAnimation) {
		playEndOfGameAnimation();
		playGameCompletionAnimation = false;
	}
}

// Checks to see if there is an object at x, y.
bool isThereAnObject(int x, int y) {
	int tileID;
	int tileRow;

	if ((x<0) || (x>=MAP_SIZE_WIDTH)) return false;
	if ((y<0) || (y>=MAP_SIZE_HEIGHT)) return false;

	if ((x==BSIDES_BENNY_LOCATION_X) && (y==BSIDES_BENNY_LOCATION_Y)) return true;
	if ((x==BSIDES_BENNY2_LOCATION_X) && (y==BSIDES_BENNY2_LOCATION_Y)) return true;

	tileID = gameMap[y][x];
	if (tileID == -1) return false;		// A blank tile has no object.

	// Tiles in the tile map in the top-right hand corner have no object.
	if ((tileID%(TILEMAP_WIDTH/TILE_SIZE)) >= TILE_FREEZONE_COLUMN) {
		tileRow = tileID / (TILEMAP_WIDTH/TILE_SIZE);
		if (tileRow<=TILE_FREEZONE_ROW) return false;
	}

	return true;
}

// Returns the number of animals to collect.
int getNumberOfAnimals() {
	return sizeof(animals)/sizeof(animals[0]);
}

// Returns the number of animals collected.
int getNumberOfAnimalsCollected() {
	uint16_t iAnimals;
  uint16_t numAnimals;
	
	numAnimals = 0;
	iAnimals = user.AnimalsCollected;
  while (iAnimals) {
  	numAnimals += (iAnimals & 1);
    iAnimals >>= 1;
  }

  return numAnimals;
}