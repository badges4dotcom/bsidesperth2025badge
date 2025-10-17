// Holds the sequence of button presses for the offline challenges
let offlineChallengeSequence = new Array(MAX_CHALLENGE_SEQUENCE).fill(0);

// Generates a random sequence of button presses required for the challenge sequence
function generateOfflineChallengeSequence(length) {
  for (let i = 0; i < MAX_CHALLENGE_SEQUENCE; i++) {
    if (i < length) {
      // random int between 1 and 4 inclusive
      offlineChallengeSequence[i] = Math.floor(Math.random() * 4) + 1;
    } else {
      offlineChallengeSequence[i] = 0;
    }
  }
}

// Displays the offline challenge introduction, generates the sequence, and then initiates the offline challenge
async function startOfflineChallenge(pos) {
  let strMessage =
    "The offline challenge is to get " +
    challenges[pos].OfflineKPReq +
    " specific button presses in " +
    challenges[pos].OfflineKPTL +
    " seconds.";

  displayMessageScreen(challenges[pos].ID, challenges[pos].Name, strMessage, true, true, true);

  // Wait for user key press twice (to mimic blockForKeyPress)
  await blockForKeyPress();
  resetKeysPress();

  generateOfflineChallengeSequence(challenges[pos].OfflineKPReq);
  return performOfflineChallenge(challenges[pos].OfflineKPReq, challenges[pos].OfflineKPTL);
}

// Displays the online challenge message and then initiates the online challenge
function startOnlineChallenge(pos) {
}

// Displays the text of sequence progress at the top of the offline challenge sequence
function displaySequenceProgress(positionInSequence, difficulty) {
  let strMessage = `${positionInSequence}/${difficulty} completed`;

  // Replace these with your JS canvas drawing calls
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, SCREEN_WIDTH, 15);

  ctx.fillStyle = "white";
  ctx.font = "10px monospace";
  ctx.fillText(strMessage, 35, 5);
}

// Displays the sequence on the screen.
function displaySequence(positionInSequence) {
    const xStartPos = ICON_SIZE / 2;
    const yStartPos = (SCREEN_HEIGHT / 2) - (2.5 * ICON_SIZE);
    const iconsPerWidth = Math.floor(SCREEN_WIDTH / (ICON_SIZE * 2));
  
    // If its the first item, clear the screen.
    if (positionInSequence % (2 * iconsPerWidth) === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, yStartPos, SCREEN_WIDTH, (2 * ICON_SIZE) * 2);
    }
  
    let seqPos = Math.floor(positionInSequence / (2 * iconsPerWidth));
    seqPos = seqPos * 2 * iconsPerWidth;
  
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < iconsPerWidth; x++) {
        let iconColour = (positionInSequence > seqPos) ? "green" : "white";
        let seqVal = offlineChallengeSequence[seqPos];
  
        if (seqVal > 0) {
          // Draw outer box
          ctx.strokeStyle = iconColour;
          ctx.strokeRect(
            xStartPos + x * (2 * ICON_SIZE),
            yStartPos + y * (2 * ICON_SIZE),
            ICON_SIZE,
            ICON_SIZE
          );
  
          // Draw inside fill depending on sequence value
          ctx.fillStyle = iconColour;
          switch (seqVal) {
            case 1: // Top Left
              ctx.fillRect(
                xStartPos + x * (2 * ICON_SIZE),
                yStartPos + y * (2 * ICON_SIZE),
                ICON_SIZE / 2,
                ICON_SIZE / 2
              );
              break;
            case 2: // Top Right
              ctx.fillRect(
                xStartPos + x * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                yStartPos + y * (2 * ICON_SIZE),
                ICON_SIZE / 2,
                ICON_SIZE / 2
              );
              break;
            case 3: // Bottom Right
              ctx.fillRect(
                xStartPos + x * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                yStartPos + y * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                ICON_SIZE / 2,
                ICON_SIZE / 2
              );
              break;
            case 4: // Bottom Left
              ctx.fillRect(
                xStartPos + x * (2 * ICON_SIZE),
                yStartPos + y * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                ICON_SIZE / 2,
                ICON_SIZE / 2
              );
              break;
          }
        }
  
        seqPos++;
      }
    }
  }
  
  // Checks for the correct button press.
  function checkForCorrectButtonPress(positionInSequence, keyPress) {
    // Key mappings: adjust these to your real key inputs
    if ((keyPress & UP_KEY_REGISTER) > 0) {
      return (offlineChallengeSequence[positionInSequence] === 1)
        ? positionInSequence + 1 : 0;
    }
    if  ((keyPress & A_KEY_REGISTER) > 0) {
      return (offlineChallengeSequence[positionInSequence] === 2)
        ? positionInSequence + 1 : 0;
    }
    if  ((keyPress & B_KEY_REGISTER) > 0) {
      return (offlineChallengeSequence[positionInSequence] === 3)
        ? positionInSequence + 1 : 0;
    }
    if  ((keyPress & DOWN_KEY_REGISTER) > 0) {
      return (offlineChallengeSequence[positionInSequence] === 4)
        ? positionInSequence + 1 : 0;
    }
  
    return positionInSequence;
  }
  
  // Runs the main loop for the offline challenge.
  async function performOfflineChallenge(difficulty, time) {
    let seqRunning = true;

    initialiseScreenAndText();
  
    let positionInSequence = 0;
    let lastPositionInSequence = 0;
    displaySequence(positionInSequence);
    displaySequenceProgress(positionInSequence, difficulty);
  
    let challengeCompleted = false;
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      displayProgressBar(time, startTime, Date.now());

      if (((Date.now() - startTime) / 1000) >= time) {
        seqRunning = false;
        document.getElementById("btnUP").click();
      }
    }, 1000);
  
    while (seqRunning) {
      if (lastPositionInSequence !== positionInSequence) {
        displaySequence(positionInSequence);
        displaySequenceProgress(positionInSequence, difficulty);
      }
    
      lastPositionInSequence = positionInSequence;
  
      // Wait ~100ms for key press
      const keyPress = await blockForKeyPress();
      if (keyPress) {
        positionInSequence = checkForCorrectButtonPress(positionInSequence, keyPress);
        resetKeysPress();
      }
  
      if (positionInSequence >= difficulty) {
        challengeCompleted = true;
        break;
      }
    }
  
    // Stop the progress bar updates
    clearInterval(progressTimer);

    return challengeCompleted;
  }

  // === Display hint messages during online challenges ===
function displayHint(curHintPos, pos, secRemaining) {
    let iHintPos = -1;
  
    // Find where in the list the current hint is.
    for (let i = 0; i < MAX_DIALOG_LINES; i++) {
      if (secRemaining <= challenges[pos].Hints[i].TimeDisplayed) {
        iHintPos = i;
      }
    }
  
    // Update the hint on screen if it has changed.
    if (iHintPos !== -1 && curHintPos !== iHintPos) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 20, SCREEN_WIDTH, 60); // clear hint area
  
      const hintMsg = challenges[pos].Hints[iHintPos].HintMessage;
      if (hintMsg.length > 26) {
        displayWrappedText(hintMsg, 26, 0, 20, false, false);
      } else {
        ctx.fillStyle = "white";
        ctx.fillText(hintMsg, 0, 20);
      }
    }
  
    return iHintPos;
  }
  
  // === Performs the main online challenge loop ===
  async function performOnlineChallenge(pos, time) {
    initialiseScreenAndText();
  
    ctx.fillStyle = "white";
    ctx.fillText("Hold [B] to exit", 30, SCREEN_HEIGHT - 10);
  
    displayWrappedText(
      "FYI: These challenges may stall with bad connectivity to the server",
      26, 0, 20, false, false
    );
  
    let iHintPos = -1;
    let challengeCompleted = false;
    const startTime = Date.now();
  
    while (((Date.now() - startTime) / 1000) < time) {
      const curTime = Date.now();
      const secRemaining = displayProgressBar(time, startTime, curTime);
      iHintPos = displayHint(iHintPos, pos, secRemaining);
  
      // If its time to poll for an update, do it.
      if (secRemaining % CHALLENGE_POLL_TIME === 0) {
        challengeCompleted ||= await sendChallengeResponse(pos, secRemaining);
      }
  
      // If the challenge has been completed, leave.
      if (challengeCompleted) break;
  
      // Check to see if the user wants to exit.
      const keyPress = await blockForKeyPress(); // wait 0.5 sec
      if (((keyPress & A_KEY_REGISTER) > 0)|| ((keyPress & B_KEY_REGISTER) > 0)) {
        return false;
      }
      resetKeysPress();
    }
  
    // One last check
    if (!challengeCompleted) {
      challengeCompleted ||= await sendChallengeResponse(pos, time);
    }
  
    return challengeCompleted;
  }
  
  // === Online or offline challenge selection ===
  async function onlineChallengeOrOfflineChallenge(c) {
    displayMessageScreen(
      c.ID, c.Name,
      "Would you like to play the online challenge [A], or offline challenge [B]?",
      true, false, false
    );
  
    while (true) {
      const keyPress = await blockForKeyPress();
      if ((keyPress & A_KEY_REGISTER) > 0) return true;
      if ((keyPress & B_KEY_REGISTER) > 0) return false;
      resetKeysPress();
    }
  }
  
  // === Ask to repeat challenge ===
  async function checkToRepeatChallenge(c) {
    displayMessageScreen(
      c.ID, c.Name,
      "It appears you have already completed this challenge. Would you like to attempt it again? Yes[A], No[B]?",
      true, false, false
    );
  
    while (true) {
      const keyPress = await blockForKeyPress();
      if ((keyPress & A_KEY_REGISTER) > 0) return true;
      if ((keyPress & B_KEY_REGISTER) > 0) return false;
      resetKeysPress();
    }
  }
  
  // === Play outro dialog ===
  async function playOutroDialog(onlineChallenge, pos, success) {
    const c = challenges[pos];
  
    const messages = success ? c.SuccessMessages : c.FailureMessages;
  
    for (let i = 0; i < MAX_DIALOG_LINES; i++) {
      const msg = messages[i];
      if (!msg || msg.Message.length === 0) continue;
  
      const applies =
        ((msg.ChallengeType & 1) && onlineChallenge) ||
        ((msg.ChallengeType & 2) && !onlineChallenge);
  
      if (applies) {
        let strTitle;
        if (msg.ID.startsWith("Null")) strTitle = c.Name;
        else if (msg.ID.startsWith("CyberEchidna")) strTitle = "Cyber Echidna";
        else strTitle = c.Name;
  
        displayMessageScreen(msg.ID, strTitle, msg.Message, true, true, true);
        await blockForKeyPress();
        resetKeysPress();
      }
    }
  }

  // === Main function for running challenges ===
async function performChallenge(pos) {
    const c = challenges[pos];
  
    // Ask user: online or offline challenge?
    const onlineChallenge = await onlineChallengeOrOfflineChallenge(c);
  
    if (onlineChallenge) {
      displayMessageScreen(c.ID, c.Name, "This feature is unavailable in the virtual badge.", true, true, true);
      await blockForKeyPress();
      resetKeysPress();
      return;
    }
  
    // === Play introduction messages ===
    for (let i = 0; i < MAX_DIALOG_LINES; i++) {
      const msg = c.IntroMessages[i];
      if (!msg || msg.Message.length === 0) continue;
  
      const applies =
        ((msg.ChallengeType & 1) && onlineChallenge) ||
        ((msg.ChallengeType & 2) && !onlineChallenge);
  
      if (applies) {
        displayMessageScreen(msg.ID, c.Name, msg.Message, true, true, true);
        await blockForKeyPress();
        resetKeysPress();
      }
    }
  
    // === Check if the challenge has already been completed ===
    if (hasChallengeBeenCompleted(onlineChallenge, pos)) {
      const repeat = await checkToRepeatChallenge(c);
      if (!repeat) {
        user.locationY += 1;
        return;
      }
    }
  
    // === Perform challenge ===
    if (!onlineChallenge) {
      if (await startOfflineChallenge(pos)) {
        markChallengeAsCompleted(onlineChallenge, pos);
        await playOutroDialog(onlineChallenge, pos, true);
        collectItem(c.AssociatedItemPos);
      } else {
        await playOutroDialog(onlineChallenge, pos, false);
      }
    } else {
    }
  
    // Prevent retriggering immediately
    user.locationY += 1;
  }
   
  // === Mark a challenge as completed ===
  function markChallengeAsCompleted(onlineChallenge, pos) {
    if (onlineChallenge) {
      user.OnlineChallengesCompleted |= (1 << pos);
    } else {
      user.OfflineChallengesCompleted |= (1 << pos);
    }
  }
  
  // === Check if challenge has been completed ===
  function hasChallengeBeenCompleted(isOnlineChallenge, pos) {
    const challengeRegister = isOnlineChallenge
      ? user.OnlineChallengesCompleted
      : user.OfflineChallengesCompleted;
  
    return (challengeRegister & (1 << pos)) > 0;
  }
  
  // === Get number of challenges ===
  function getNumberOfChallenges() {
    return challenges.length;
  }
  
  // === Get number of challenges completed ===
  function getNumberOfChallengesCompleted(isOnlineChallenge) {
    let challengeRegister = isOnlineChallenge
      ? user.OnlineChallengesCompleted
      : user.OfflineChallengesCompleted;
  
    let numChallenges = 0;
    while (challengeRegister) {
      numChallenges += (challengeRegister & 1);
      challengeRegister >>= 1;
    }
    return numChallenges;
  }
  
  