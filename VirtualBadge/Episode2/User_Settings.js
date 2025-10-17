// ---- "EEPROM" replacement ----
// We'll persist user settings in localStorage as JSON
const STORAGE_KEY = "bsidesUserEpisode2";

// Identifier for checking initialization
const idBSides = ['B','S','I','D','E','S']; // "BSIDES"

// User object
let user = {
    UUID: [],
    Passcode: "",
    ItemsCollected: 0,
    OnlineChallengesCompleted: 0,
    OfflineChallengesCompleted: 0,
    missionStatus: 0,
    locationX: MAP_SIZE_WIDTH - 8,
    locationY: MAP_SIZE_HEIGHT-1,
    lastLocationX: MAP_SIZE_WIDTH - 7,
    lastLocationY: MAP_SIZE_HEIGHT-1,
    WiFiSSID: "",
    WiFiPassword: ""
};

// ---- Helpers ----
function checkUserSettings() {
    for (let i = 0; i < 6; i++) {
        if (user.UUID[i] !== idBSides[i]) {
            initialiseUserSettings(false);
            console.warn("Invalid user data; resetting.")
            return;
        }
    }
}

function readUserSettings() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            user = JSON.parse(data);
        } catch (err) {
            console.warn("Corrupt user data, resetting.");
            initialiseUserSettings(false);
            return;
        }
    }
    checkUserSettings();
}

function saveUserSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

async function initialiseUserSettings(displayMessage = true) {
    // Reset and generate new UUID
    user.UUID = [];
    for (let i = 0; i < 6; i++) user.UUID[i] = idBSides[i];
    user.UUID[6] = "?"; // reserved byte

    for (let i = 7; i < 32; i++) {
        let cIn = Math.floor(Math.random() * 52);
        if (cIn >= 26) {
            cIn = String.fromCharCode(cIn - 26 + 97); // a-z
        } else {
            cIn = String.fromCharCode(cIn + 65); // A-Z
        }
        user.UUID[i] = cIn;
    }

    user.Passcode = "";
    user.ItemsCollected = 0;
    user.OnlineChallengesCompleted = 0;
    user.OfflineChallengesCompleted = 0;
    user.missionStatus = 0;

    user.locationX = MAP_SIZE_WIDTH - 8;
    user.locationY = MAP_SIZE_HEIGHT-1;
    user.lastLocationX = MAP_SIZE_WIDTH - 7;
    user.lastLocationY = MAP_SIZE_HEIGHT-1;

    user.WiFiSSID = "";
    user.WiFiPassword = "";

    saveUserSettings();

    if (displayMessage) {
        displayMessageScreen(
            "Person",
            "Benny",
            "Your user settings have been reset.",
            true,
            true,
            true
        );

        await blockForKeyPress();
    }
}

function generateUserJsonDocument() {
    return {
        UUID: String.fromCharCode(...user.UUID),
        Passcode: user.Passcode,
        ItemsCollected: user.ItemsCollected,
        OnlineChallengesCompleted: user.OnlineChallengesCompleted,
        OfflineChallengesCompleted: user.OfflineChallengesCompleted
    };
}
