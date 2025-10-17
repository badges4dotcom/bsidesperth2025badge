// ---- Status Screens ----
function displayStatusOneScreen(ctx) {
    let strMessage = getNumberOfAnimalsCollectedString() + " | " +
                     getNumberOfChallengesCompletedString(true);

    displayMessageScreen("Person", "Status (1/3)", strMessage, false, false, true);
}

function displayStatusTwoScreen(ctx) {
    let strMessage = getNumberOfChallengesCompletedString(false) + " | " +
                     "Passcode: " + getUserPasscode();

    displayMessageScreen("Person", "Status (2/3)", strMessage, false, false, true);
}

function displayStatusThreeScreen(ctx) {
    let strMessage = "UUID: " + getUserUUID() + " | ";

    if (isWiFiConnected()) {
        strMessage += "WiFi: Connected | IP Addr: " + getLocalIP();
    } else {
        strMessage += "WiFi: Not Connected";
    }

    displayMessageScreen("Person", "Status (3/3)", strMessage, false, false, true);
}

// ---- Helpers ----
function getNumberOfAnimalsCollectedString() {
    return `Animals Collected (${getNumberOfAnimalsCollected()}/${getNumberOfAnimals()})`;
}

function getNumberOfChallengesCompletedString(isOnlineChallenge) {
    const prefix = isOnlineChallenge ? "Online" : "Offline";
    return `${prefix} Challenges Completed (${getNumberOfChallengesCompleted(isOnlineChallenge)}/${getNumberOfChallenges()})`;
}

function getUserPasscode() {
    return (user.Passcode && user.Passcode.length > 0) ? user.Passcode : "Not set";
}

function getUserUUID() {
    if (!user.UUID) return "";
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        uuid += user.UUID[i];
        if (i === 7 || i === 11 || i === 15 || i === 19) uuid += "-";
    }
    return uuid;
}

function isWiFiConnected() {
    return false; 
}

function getLocalIP() {
     return "127.0.0.1";
}
