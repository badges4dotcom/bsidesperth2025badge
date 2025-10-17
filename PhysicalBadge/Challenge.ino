
uint8_t offlineChallengeSequence[MAX_CHALLENGE_SEQUENCE];			// Holds the sequence of button presses for the offline challenges;.

// Generates a random sequence of button presses required for the challenge sequence.
void generateOfflineChallengeSequence(int length) {
	for (int i=0; i<MAX_CHALLENGE_SEQUENCE; i++) {
		if (i<length) offlineChallengeSequence[i] = random(1, 4);
		else offlineChallengeSequence[i] = 0;
	}
}

// Displays the offline challenge introduction, generates the sequence, and then initiates the offline challenge.
bool startOfflineChallenge(int pos) {
	int keyPress;
	String strMessage;

	strMessage = "The offline challenge is to get ";
	strMessage += challenges[pos].OfflineKPReq;
	strMessage += " specific button presses in ";
	strMessage += challenges[pos].OfflineKPTL;
	strMessage += " seconds.";

	displayMessageScreen(challenges[pos].ID, challenges[pos].Name, strMessage, true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();

	generateOfflineChallengeSequence(challenges[pos].OfflineKPReq);
	return performOfflineChallenge(challenges[pos].OfflineKPReq, challenges[pos].OfflineKPTL);
}

// Displays the online challenge message and then initiates the online challenge.
bool startOnlineChallenge(int pos) {
	int keyPress;

	displayMessageScreen(challenges[pos].ID, challenges[pos].Name, "You will have 2 minutes to complete the challenge. A request to the server will be sent every 30 seconds to confirm success/failure.", true, true, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();
	displayMessageScreen(challenges[pos].ID, challenges[pos].Name, "Press [A] to start the challenge.", true, false, true);
	keyPress = blockForKeyPress();
	keyPress = blockForKeyPress();

	return performOnlineChallenge(pos, 120);
}

// Displays the text of sequence progress at the top of the offline challenge sequence.
void displaySequenceProgress(int positionInSequence, int difficulty) {
	String strMessage;

	strMessage = positionInSequence;
	strMessage = strMessage + "/";
	strMessage = strMessage + difficulty;
	strMessage = strMessage + " completed";

	tft.fillRect(0, 0, SCREEN_WIDTH, 10, ST77XX_BLACK);
	tft.setCursor(35, 0);
	tft.print(strMessage);
}

// Displays the sequence on the screen.
void displaySequence(int positionInSequence) {
	int xStartPos, yStartPos;
	int x, y;

	int iconsPerWidth;
	int seqPos, seqPosMod;
	int iconColour;

	xStartPos = ICON_SIZE / 2;
	yStartPos = (SCREEN_HEIGHT / 2) - (2.5 * ICON_SIZE);

	iconsPerWidth = SCREEN_WIDTH / (ICON_SIZE * 2);

	// If its the first item, clear the screen.
	if ((positionInSequence % (2*iconsPerWidth)) == 0) tft.fillRect(0, yStartPos, SCREEN_WIDTH, (2*ICON_SIZE)*2, ST77XX_BLACK);
	seqPos = (positionInSequence / (2*iconsPerWidth));
	seqPos = seqPos * 2 * iconsPerWidth;

	for (y=0; y<2; y++) {
		for (x=0; x<iconsPerWidth; x++) {
			if (positionInSequence>seqPos) iconColour = ST77XX_GREEN;
			else iconColour = ST77XX_WHITE;

			if (offlineChallengeSequence[seqPos]>0) tft.drawRect(xStartPos + x*(2*ICON_SIZE), yStartPos + y*(2*ICON_SIZE), ICON_SIZE, ICON_SIZE, iconColour);

			switch (offlineChallengeSequence[seqPos]) {
				case 1:
					tft.fillRect(xStartPos + x*(2*ICON_SIZE), yStartPos + y*(2*ICON_SIZE), ICON_SIZE/2, ICON_SIZE/2, iconColour);															// Top Left
					break;
				case 2:
					tft.fillRect(xStartPos + x*(2*ICON_SIZE)+(ICON_SIZE/2), yStartPos + y*(2*ICON_SIZE), ICON_SIZE/2, ICON_SIZE/2, iconColour);								// Top Right
					break;
				case 3:
					tft.fillRect(xStartPos + x*(2*ICON_SIZE)+(ICON_SIZE/2), yStartPos + y*(2*ICON_SIZE)+(ICON_SIZE/2), ICON_SIZE/2, ICON_SIZE/2, iconColour);	// Bottom Right
					break;
				case 4:
					tft.fillRect(xStartPos + x*(2*ICON_SIZE), yStartPos + y*(2*ICON_SIZE)+(ICON_SIZE/2), ICON_SIZE/2, ICON_SIZE/2, iconColour);								// Bottom Left
					break;
			}

			seqPos++;
		}
	}
}

// Checks fo  the correct button press. If correct, it iterates to next sequence position. If not, set it back
// to the beginning.
uint8_t checkForCorrectButtonPress(uint8_t positionInSequence) {
	int keyPress;
	
	keyPress = checkForKeyPress();
  if ((keyPress & UP_KEY_REGISTER) > 0) {
		if (offlineChallengeSequence[positionInSequence] == 1) return positionInSequence + 1;
		else return 0;
	}
  if ((keyPress & A_KEY_REGISTER) > 0) {
		if (offlineChallengeSequence[positionInSequence] == 2) return positionInSequence + 1;
		else return 0;
	}
  if ((keyPress & B_KEY_REGISTER) > 0) {
		if (offlineChallengeSequence[positionInSequence] == 3) return positionInSequence + 1;
		else return 0;
	}
  if ((keyPress & DOWN_KEY_REGISTER) > 0) {
		if (offlineChallengeSequence[positionInSequence] == 4) return positionInSequence + 1;
		else return 0;
	}

	return positionInSequence;
}

// Runs the main loop for the offline challenge.
bool performOfflineChallenge(int difficulty, int time) {
	unsigned long startTime, curTime;
	unsigned int secRemaining;
	uint8_t positionInSequence, lastPositionInSequence;
	bool challengeCompleted;

	initialiseScreenAndText();

	lastPositionInSequence = positionInSequence = 0;
	displaySequence(positionInSequence);
	displaySequenceProgress(positionInSequence, difficulty);

	challengeCompleted = false;
	startTime = curTime = millis();
	while (((curTime-startTime)/1000)<time) {	// While still in the permitted time.
		if (lastPositionInSequence!=positionInSequence) {						// If the user has progressed with the sequence, update the screen/status.
			displaySequence(positionInSequence);
			displaySequenceProgress(positionInSequence, difficulty);
		}
		secRemaining = displayProgressBar(time, startTime, curTime);// Update the progress bar.
		lastPositionInSequence = positionInSequence;

		delay(100);
		positionInSequence = checkForCorrectButtonPress(positionInSequence);	// Check for button press.
		curTime = millis();

		if (positionInSequence>=difficulty) {		// If the user has got to the end of the sequence, exit the roop.
			challengeCompleted = true;
			break;
		}
	}

	return challengeCompleted;
}

int displayHint(int curHintPos, int pos, unsigned int secRemaining) {
	int iHintPos;

	// Find where in the list the current hint is.
	iHintPos = -1;
	for (int i=0; i<MAX_DIALOG_LINES; i++) {
		if (secRemaining<=challenges[pos].Hints[i].TimeDisplayed) {
			iHintPos = i;
		}
	}

	// Update the hint on screen if it has changed.
	if (iHintPos!=-1) {
		if (curHintPos!=iHintPos) {
			tft.fillRect(0, 20, SCREEN_WIDTH, 60, ST77XX_BLACK);
			if (challenges[pos].Hints[iHintPos].HintMessage.length()>26) displayWrappedText(challenges[pos].Hints[iHintPos].HintMessage, 26, 0, 20, false, false);
			else {
				tft.setCursor(0, 20);
				tft.print(challenges[pos].Hints[iHintPos].HintMessage);
			}
		}
	}

	return iHintPos;
}

// Performs the main online challenge loop.
bool performOnlineChallenge(int pos, int time) {
	unsigned long startTime, curTime;
	unsigned int secRemaining;
	bool challengeCompleted;
	int iHintPos;
	int keyPress;

	initialiseScreenAndText();
	tft.setCursor(30, SCREEN_HEIGHT-10);
	tft.print("Hold [B] to exit");	

	displayWrappedText("FYI: These challenges may stall with bad connectivity to the server", 26, 0, 20, false, false);

	iHintPos = -1;
	challengeCompleted = false;
	startTime = curTime = millis();
	while (((curTime-startTime)/1000)<time) {
		// Update on-screen elements.
		secRemaining = displayProgressBar(time, startTime, curTime);
		iHintPos = displayHint(iHintPos, pos, secRemaining);

		// If its time to poll for an update, do it.
		if ((secRemaining % CHALLENGE_POLL_TIME) == 0) {
			challengeCompleted |= sendChallengeResponse(pos, secRemaining);
		}

		// If the challenge has been completed, leave.
		if (challengeCompleted) break;

		// Check to see if the user wants to exit.
		keyPress = checkForKeyPress();
		if ((keyPress & B_KEY_REGISTER) > 0) {
			return false;
		}

		// Update the time, and sleep for 0.5sec.
		curTime = millis();
		delay(500);
	}
	if (!challengeCompleted) challengeCompleted |= sendChallengeResponse(pos, time);	// Check one last time for success.

	return challengeCompleted;
}

// Display the question of whether its an online challenge or offline challenge to the user.
bool onlineChallengeOrOfflineChallenge(struct Challenge *c) {
	int keyPress;
	
	displayMessageScreen(c->ID, c->Name, "Would you like to play the online challenge [A], or offline challenge [B]?", true, false, false);
	while (true) {
		keyPress = blockForKeyPress();
		if ((keyPress & A_KEY_REGISTER) > 0) return true;
		if ((keyPress & B_KEY_REGISTER) > 0) return false;
	}
}

// Checks to see if hte user wants to perform the challenge a second tim.
bool checkToRepeatChallenge(struct Challenge *c) {
	int keyPress;
	
	displayMessageScreen(c->ID, c->Name, "It appears you have already completed this challenge. Would you like to attempt it again? Yes[A], No[B]?", true, false, false);
	while (true) {
		keyPress = blockForKeyPress();
		if ((keyPress & A_KEY_REGISTER) > 0) return true;
		if ((keyPress & B_KEY_REGISTER) > 0) return false;
	}
}

// Plays the outro dialog after a challenge has been attempted.
void playOutroDialog(bool onlineChallenge, int pos, bool success) {
	Challenge c;
	int keyPress;
	int i;
	String strTitle;

	c = challenges[pos];

	if (success) {
		for (i=0; i<MAX_DIALOG_LINES; i++) {
			if ((((c.SuccessMessages[i].ChallengeType & 1)==1) && onlineChallenge) || (((c.SuccessMessages[i].ChallengeType & 2)==2) && !onlineChallenge)) {
				if (c.SuccessMessages[i].Message.length()>0) {
					if (strncmp(c.SuccessMessages[i].ID, "Null", strlen(c.SuccessMessages[i].ID))==0) strTitle = c.Name;
					else if (strncmp(c.SuccessMessages[i].ID, "CyberEchidna", strlen(c.SuccessMessages[i].ID)) == 0) strTitle = "Cyber Echidna";
					else strTitle = c.Name;

					displayMessageScreen(c.SuccessMessages[i].ID, strTitle, c.SuccessMessages[i].Message, true, true, true);
					keyPress = blockForKeyPress();
					keyPress = blockForKeyPress();
				}
			}
		}
	} else {
		for (i=0; i<MAX_DIALOG_LINES; i++) {
			if ((((c.FailureMessages[i].ChallengeType & 1)==1) && onlineChallenge) || (((c.FailureMessages[i].ChallengeType & 2)==2) && !onlineChallenge)) {
				if (c.FailureMessages[i].Message.length()>0) {
					if (strncmp(c.FailureMessages[i].ID, "Null", strlen(c.FailureMessages[i].ID))==0) strTitle = c.Name;
					else if (strncmp(c.FailureMessages[i].ID, "CyberEchidna", strlen(c.FailureMessages[i].ID))==0) strTitle = "Cyber Echidna";
					else strTitle = c.Name;

					displayMessageScreen(c.FailureMessages[i].ID, strTitle, c.FailureMessages[i].Message, true, true, true);
					keyPress = blockForKeyPress();
					keyPress = blockForKeyPress();
				}
			}
		}		
	}
}

// Main function for running the challenges.
void performChallenge(int pos) {
	int keyPress;
	int i;
	Challenge c;
	bool onlineChallenge;

	c = challenges[pos];

	// Check with user if they want an online or offline challenge.
	onlineChallenge = onlineChallengeOrOfflineChallenge(&c);

	if (onlineChallenge) {
		if (!isUserOnlineWithWiFi()) {					// Check if user is online with WiFi, if not, alert them.
			displayWiFiOfflineAlert();
			user.locationX = user.locationX + 1;
			return;
		}

		if (!hasValidPasscode()) {								// If the user doesn't have a valid passcode, register with the server.
			displayDeviceRegistrationAlert();
			registerDevice();
			if (!hasValidPasscode()) {
				displayDeviceRegistrationError();
				user.locationX = user.locationX + 1;
				return;
			}
		}
	}

	// Play Introduction.
	for (i=0; i<MAX_DIALOG_LINES; i++) {
		if ((((c.IntroMessages[i].ChallengeType & 1)==1) && onlineChallenge) || (((c.IntroMessages[i].ChallengeType & 2)==2) && !onlineChallenge)) {
			if (c.IntroMessages[i].Message.length()>0) {
				displayMessageScreen(c.IntroMessages[i].ID, c.Name, c.IntroMessages[i].Message, true, true, true);
				keyPress = blockForKeyPress();
				keyPress = blockForKeyPress();
			}
		}
	}
	
	// Check if the challenge has been completed.
	if (hasChallengeBeenCompleted(onlineChallenge, pos)) {
		if (!checkToRepeatChallenge(&c)) {
			user.locationX = user.locationX + 1;
			return;
		}
	}

	// Perform the online or offline challenge, based on user's request.
	if (!onlineChallenge) {
		if (startOfflineChallenge(pos)) {
			markChallengeAsCompleted(onlineChallenge, pos);
			playOutroDialog(onlineChallenge, pos, true);
			collectAnimal(c.AssociatedAnimalPos);
		} else {
			playOutroDialog(onlineChallenge, pos, false);
		}
	} else {
		if (startOnlineChallenge(pos)) {
			markChallengeAsCompleted(onlineChallenge, pos);
			playOutroDialog(onlineChallenge, pos, true);
			collectAnimal(c.AssociatedAnimalPos);
		} else {
			playOutroDialog(onlineChallenge, pos, false);
		}		
	}

	// Bit of a lazy hack; move the player one to the right after the challenge so
	// as to not trigger the challenge again.
	user.locationX = user.locationX + 1;
}

// Function used to send web request to server to check for success for the Online challenge.
bool sendChallengeResponse(int pos, int timeRemaining) {
  JsonDocument docOut;
  JsonDocument docIn;
  String strOutput;
  String strInput;
  DeserializationError jsonError;

	docOut["user"] = generateUserJsonDocument();
	docOut["challenge"] = generateChallengeJsonDocument(pos, timeRemaining);
	serializeJson(docOut, strOutput);
	strInput = sendWebRequest(GAME_WEB_URL, 8080, "/challenge.php", GAME_WEB_URL, strOutput); //TODO: Don't forget!!!! Update to challenge2.php for HH Challenge.
	jsonError = deserializeJson(docIn, strInput);

	if (!jsonError) {
    if (jsonElementExists(docIn, "Response") && jsonElementExists(docIn, "Challenge")) {
      if (strcmp(docIn["Response"], "success")==0) {
        if (strcmp(docIn["Challenge"], "success")==0) {
					displayResponseStatus(ST77XX_GREEN);
					return true;
				} else displayResponseStatus(ST77XX_MAGENTA);
			} else displayResponseStatus(ST77XX_YELLOW);
		} else displayResponseStatus(ST77XX_ORANGE);
	} else displayResponseStatus(ST77XX_RED);

	return false;
}

// Generates the info required for the Json information.
JsonDocument generateChallengeJsonDocument(int pos, int timeRemaining) {
  JsonDocument docChallenge;

  docChallenge["ChallengeID"] = pos;
  docChallenge["TimeRemaining"] = timeRemaining;
	docChallenge["GPIO"] = generateGPIOJsonInt();
	docChallenge["SDCard"] = generateSDCardDocument();

	return docChallenge;
}

// Generates the integer for the GPIO.
uint32_t generateGPIOJsonInt() {
	uint32_t iGPIOs;
	int counter;
	int arrSize;

	iGPIOs = 0;
	counter = 1;
	arrSize = sizeof(available_gpio) / sizeof(available_gpio[0]);

	for (int i=arrSize-1; i>=0; i--) {
		if (digitalRead(available_gpio[i])==HIGH) iGPIOs += counter;
		counter = counter << 1;
	}

	return iGPIOs;
}

//Generates the SD Card file for the SD Cornelius challenge.
JsonDocument generateSDCardDocument() {
	JsonDocument sdCardInfo;

	sdCardInfo["memoriesFile"] = getSDCardFile("memories.txt", "Sam D. Cornelius's memories: SDC_CHALLENGE_COMPLETE=0");

	return sdCardInfo;
}

// Marks a challenge as being completed.
void markChallengeAsCompleted(bool onlineChallenge, int pos) {
	int keyPress;

	// Set the flag for the challenge being completed.
	if (onlineChallenge) user.OnlineChallengesCompleted |= ((uint16_t) pow(2, pos));
	else user.OfflineChallengesCompleted |= ((uint16_t) pow(2, pos));
}

// Checks to see if a challenge has been completed.
bool hasChallengeBeenCompleted(bool isOnlineChallenge, int pos) {
	uint8_t challengeRegister;

	if (isOnlineChallenge) challengeRegister = user.OnlineChallengesCompleted;
	else challengeRegister = user.OfflineChallengesCompleted;
	
	if ((challengeRegister & ((uint16_t) pow(2, pos))) > 0) return true;

	return false;
}

int getNumberOfChallenges() {
	return sizeof(challenges)/sizeof(challenges[0]);
}

// Gets the number of challenges completed.
int getNumberOfChallengesCompleted(bool isOnlineChallenge) {
	uint16_t iChallenges;
  uint16_t numChallenges;
	uint8_t challengeRegister;
	
	if (isOnlineChallenge) challengeRegister = user.OnlineChallengesCompleted;
	else challengeRegister = user.OfflineChallengesCompleted;

	numChallenges = 0;
	iChallenges = challengeRegister;
  while (iChallenges) {
  	numChallenges += (iChallenges & 1);
    iChallenges >>= 1;
  }

  return numChallenges;
}