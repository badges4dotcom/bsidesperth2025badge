function color565ToHex(color565) {
    // Extract RGB565 components
    const r = (color565 >> 11) & 0x1F;  // 5 bits
    const g = (color565 >> 5) & 0x3F;   // 6 bits
    const b = color565 & 0x1F;          // 5 bits
  
    // Expand to 8 bits (scale 0–255)
    const r8 = Math.round((r * 255) / 31);
    const g8 = Math.round((g * 255) / 63);
    const b8 = Math.round((b * 255) / 31);
  
    // Format as hex string
    return (
      "#" +
      r8.toString(16).padStart(2, "0") +
      g8.toString(16).padStart(2, "0") +
      b8.toString(16).padStart(2, "0")
    ).toUpperCase();
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}// Constants
const MAX_DIALOG_LINES = 4;
const MAX_FIREWORKS_PARTICLES = 40;

// Item structure (used for creating new item)
class Item {
  constructor(Name, ID, InitialX, InitialY, CapturedX, CapturedY, X = 0, Y = 0) {
    this.Name = Name;       // string
    this.ID = ID;           // string
    this.InitialX = InitialX;
    this.InitialY = InitialY;
    this.CapturedX = CapturedX;
    this.CapturedY = CapturedY;
    this.X = X;             // current X position
    this.Y = Y;             // current Y position
  }
}

// Dialogue structure
class Dialogue {
    constructor(ID, Message, ChallengeType = 0) {
      this.ID = ID;                 // string
      this.Message = Message;       // string
      this.ChallengeType = ChallengeType; // bitwise: 1 = Online, 2 = Offline
    }
  }
  
  // Hint structure
  class Hint {
    constructor(TimeDisplayed = 0, HintMessage = "") {
      this.TimeDisplayed = TimeDisplayed; // time hint has been displayed
      this.HintMessage = HintMessage;     // string
    }
  }
  
  // Challenge structure
  class Challenge {
    constructor(Name, ID, X = 0, Y = 0, OfflineKPReq = 0, OfflineKPTL = 0, AssociatedItemPos = -1, IntroMessages, SuccessMessages, FailureMessages, Hints) {
      this.Name = Name;                       // string
      this.ID = ID;                           // string
      this.X = X;                             // position X
      this.Y = Y;                             // position Y
      this.OfflineKPReq = OfflineKPReq;       // Offline Keypress Requirement
      this.OfflineKPTL = OfflineKPTL;         // Offline Keypress Timelimit
      this.AssociatedItemPos = AssociatedItemPos;
  
      // Fixed-length arrays for messages and hints
      this.IntroMessages = IntroMessages;
      this.SuccessMessages = SuccessMessages;
      this.FailureMessages = FailureMessages;
      this.Hints = Hints;
    }
  }
  
  // Particle structure
class Particle {
    constructor(x = 0, y = 0, vX = 0, vY = 0, colour = 0, active = false, lifetime = 0) {
      this.x = x;           // position X
      this.y = y;           // position Y
      this.vX = vX;         // velocity X
      this.vY = vY;         // velocity Y
      this.colour = colour; // uint16 colour (can store as number)
      this.active = active; // boolean
      this.lifetime = lifetime; // frames remaining
    }
  }
  
  // Firework structure
  class Firework {
    constructor(numParticles = MAX_FIREWORKS_PARTICLES) {
      this.particles = Array(numParticles).fill(null).map(() => new Particle());
      this.active = false;
      this.numParticles = numParticles;
    }
  }
  
  // UserSettings structure
  class UserSettings {
    constructor() {
      this.UUID = "";               // string, 32 chars
      this.Passcode = "";           // string, 8 chars
  
      this.ItemsCollected = 0;    // uint16
      this.OnlineChallengesCompleted = 0;  // uint8
      this.OfflineChallengesCompleted = 0; // uint8
      this.MissionStatus = 0;       // uint8
  
      this.LocationX = 0;           // uint8
      this.LocationY = 0;
      this.LastLocationX = 0;
      this.LastLocationY = 0;
  
      this.WiFiSSID = "";            // string, 32 chars
      this.WiFiPassword = "";        // string, 32 chars
    }
  }
  
  // WiFiCredentials structure
  class WiFiCredentials {
    constructor(ssid = "", password = "", validPassword = false) {
      this.ssid = ssid;
      this.password = password;
      this.validPassword = validPassword; // boolean
    }
  }
  // Key input bitmasks
const UP_KEY_REGISTER = 1;
const DOWN_KEY_REGISTER = 2;
const A_KEY_REGISTER = 4;
const B_KEY_REGISTER = 8;

const NUM_KEYS = 4;

// TFT screen dimensions
const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 128;

// Tilemap constants
const TILE_SIZE = 16;             // Tile size (both width and height)
const TILEMAP_WIDTH = 208;        // Width in pixels for tilemap
const TILEMAP_HEIGHT = 144;       // Height in pixels for tilemap
const TILE_FREEZONE_COLUMN = 8;   // Columns in "free-zone"
const TILE_FREEZONE_ROW = 4;      // Rows in "free-zone"

// Map size in tiles
const MAP_SIZE_WIDTH = 100;
const MAP_SIZE_HEIGHT = 48;

// Text and menu constants
const MAX_LINE_LENGTH = 14;           // Max characters per line
const MAX_MENUITEMS_ONSCREEN = 4;     // Max menu items displayed
const MAX_CHALLENGE_SEQUENCE = 60;    // Max sequence items (offline challenge)
const MAX_WIFI_NETWORKS = 20;         // Max WiFi networks listed

// Icon size for offline challenge
const ICON_SIZE = 16;

// Benny's locations
const BSIDES_BENNY_LOCATION_X = 0;
const BSIDES_BENNY_LOCATION_Y = 40;
const BSIDES_BENNY2_LOCATION_X = 94;
const BSIDES_BENNY2_LOCATION_Y = 43;

// Fireworks / particles
const MAX_FIREWORKS = 5;
const PARTICLE_LIFETIME = 30;

const items = [
  new Item("PKI Certificate", "PKICertificate", 6, 12, 2, 45),
  new Item("Hardware Security Module", "HSM", 61, 6, 3, 45),
  new Item("Crypto Wallet", "CryptoWallet", 67, 46, 4, 45),
  new Item("Floppy Disk", "FloppyDisk", 1, 5, 5, 45),
  new Item("Laser Pointer", "LaserPointer", 45, 23, 6, 45),
  new Item("Credit Card", "CreditCard", 64, 1, 7, 45),
  new Item("LCD Screen", "LCDScreen", 1, 34, 8, 45),
  new Item("ESP32", "ESP32", 85, 20, 9, 45),
  new Item("High Powered GPU", "HighPoweredGPU", 91, 34, 2, 47),
  new Item("BSides Perth 2025 Badge", "Badge", 99, 32, 3, 47),
  new Item("Prism", "Prism", 97, 24, 4, 47),
  new Item("Flux Capacitor", "FluxCapacitor", -8, -8, 5, 47),
  new Item("2x AA Batteries", "Batteries", -8, -8, 6, 47),
  new Item("486 Computer", "486Computer", -8, -8, 7, 47),
  new Item("Instruction Manual", "Manual", -8, -8, 8, 47),
  new Item("Game Controller", "GameController", -8, -8, 9, 47)
];

const challenges = [
  new Challenge(
    "Peter", "Person6", 3, 22, 50, 30, 11,
    [
      new Dialogue("Person6", "Hi there, my name is Peter.", 3),
      new Dialogue("Null", "Have you heard the rumour?", 3),
      new Dialogue("Null", "Benny is building some kind of supercomputer.", 3),
      new Dialogue("Null", "Anyway, are you ready to challenge me?", 3)
    ],
    [
      new Dialogue("Person6", "Oh, you got the challenge.", 3),
      new Dialogue("Null", "I've misplaced my credit card. Have you seen it?", 3),
      new Dialogue("CyberEchidna", "Hmmmm.....no.", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Dialogue("Person6", "Better luck next time.", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Hint(100, ""),
      new Hint(80, ""),
      new Hint(60, ""),
      new Hint(20, "")
    ]
  ),
  new Challenge(
    "Joe", "Person5", 57, 27, 42, 30, 12,
    [
      new Dialogue("Person5", "Why hello there.", 3),
      new Dialogue("Null", "Neat badge. Where did you get that?", 3),
      new Dialogue("CyberEchidna", "Oh, this thing? From the BSides Perth 2025 conference.", 3),
      new Dialogue("Person5", "Nice, I'm jelly.", 3)
    ],
    [
      new Dialogue("Person5", "Good one! You have completed my challenge.", 3),
      new Dialogue("Null", "It must have been the luck of the badge.", 3),
      new Dialogue("CyberEchidna", "Yep, it's the best.", 3),
      new Dialogue("Person5", "Good luck out there Cyber Echidna.", 3)
    ],
    [
      new Dialogue("Person5", "No luck this time.", 3),
      new Dialogue("Null", "Maybe next time.", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Hint(100, ""),
      new Hint(80, ""),
      new Hint(60, ""),
      new Hint(40, "")
    ]
  ),
  new Challenge(
    "Elena", "Person3", 33, 46, 28, 30, 13,
    [
      new Dialogue("Person3", "Oh, hi!", 3),
      new Dialogue("Null", "Aren't you a cute widdle Cyber Echidna?", 3),
      new Dialogue("CyberEchidna", "Let's just get the challenge over and done with.", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Dialogue("Person3", "Well done on completing my challenge.", 3),
      new Dialogue("Null", "Good luck on finding those items.", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Dialogue("Person3", "No luck with the challenge this time.", 3),
      new Dialogue("Null", "Looking forward to seeing you next time cute widdle Cyber Echidna.", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Hint(100, ""),
      new Hint(80, ""),
      new Hint(60, ""),
      new Hint(20, "")
    ]
  ),
  new Challenge(
    "Bob", "Person7", 15, 5, 20, 30, 14,
    [
      new Dialogue("Person7", "Remember me Cyber Echidna??!.", 3),
      new Dialogue("Null", "You collected me up, and took me to the BSides petting zoo.", 3),
      new Dialogue("Null", "That was over 12 years ago.", 3),
      new Dialogue("Null", "Now you're going to pay with this challenge.", 3)
    ],
    [
      new Dialogue("Person7", "Oh, you won this challenge.", 3),
      new Dialogue("Person7", "I forgive you Cyber Echidna for what happened 12 years ago.", 3),
      new Dialogue("Null", "I was only in the petting zoo until you left, and then I snuck out anyway.", 3),
      new Dialogue("CyberEchidna", "Kthxbye., ", 3)
    ],
    [
      new Dialogue("Person7", "You didn't get the challenge this time.", 3),
      new Dialogue("Null", "Maybe its time I take you to the BSides petting zoo.", 3),
      new Dialogue("Null", "Hmmm, its late in the day, maybe next time.", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Hint(100, ""),
      new Hint(80, ""),
      new Hint(60, ""),
      new Hint(10, "")
    ]
  ),
  new Challenge(
    "Cynthia", "Person2", 68, 14, 16, 30, 15,
    [
      new Dialogue("Person2", "My name is Cynthia. Welcome to my home.", 3),
      new Dialogue("Null", "So you're the Cyber Echidna everyone is talking about?", 3),
      new Dialogue("Null", "I thought you were a folklore.", 3),
      new Dialogue("Null", "Well, anyway, let's see if you're as good as they say you are.", 3)
    ],
    [
      new Dialogue("Person2", "Goodness gracious.", 3),
      new Dialogue("Null", "The folklore of 'Cyber Echidna' was true!", 3),
      new Dialogue("Null", "Take this item as a tribute.", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Dialogue("Person2", "No luck with the challenge this time.", 3),
      new Dialogue("Null", "Y'all come back now.", 3),
      new Dialogue("Null", "", 3),
      new Dialogue("Null", "", 3)
    ],
    [
      new Hint(100,""),
      new Hint(80,""),
      new Hint(40,""),
      new Hint(10,"")
    ]
  )
];


const gameMap = [
[-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,13,14,15,16,17,-1,-1,-1,-1,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,44,45,46],
[-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,26,27,28,29,30,-1,-1,-1,-1,34,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,36,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59],
[-1,-1,91,92,79,79,79,79,79,80,-1,-1,39,40,41,42,43,-1,44,45,46,34,35,25,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,49,-1,-1,-1,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72],
[-1,-1,104,105,105,105,105,105,105,106,-1,-1,52,53,54,55,56,60,57,58,59,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,65,66,67,68,69,73,70,71,72,34,35,36,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,-1,-1,-1,-1,-1,-1,-1,78,79,79,79,79,79,79,80,-1,-1,-1,-1,-1,78,80,-1,-1,78,79,79,80,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,106,-1,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,92,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,92,105,105,105,105,92,93,-1,-1,-1,-1,-1,91,93,-1,-1,104,105,92,93,-1,21,22,23,-1],
[-1,-1,-1,-1,70,71,72,-1,-1,-1,-1,21,22,22,22,22,22,22,22,22,22,11,35,12,23,-1,-1,-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,44,45,46,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,34,35,36,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,35,35,35,35,35,35,35,35,35,35,35,36,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,57,58,59,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,34,35,36,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,47,48,48,48,48,48,48,48,48,48,48,48,48,49,78,80,-1,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,92,93,0,1,2,3,4,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,70,71,72,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,34,35,36,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,91,92,105,105,105,105,105,105,105,105,105,105,105,105,105,105,106,13,14,15,16,17,-1,-1,-1,-1,91,92,79,80,-1,-1,91,93,-1,-1,-1,-1,-1,91,92,79,79,79,79,92,93,-1,34,35,36,-1],
[79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,92,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72,-1,-1,-1,-1,104,106,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,26,27,28,29,30,-1,-1,-1,-1,104,105,105,106,-1,-1,104,106,-1,-1,-1,-1,-1,104,105,105,105,105,105,105,106,-1,34,35,36,-1],
[105,105,105,105,105,105,105,105,105,105,105,105,92,92,105,105,105,105,105,105,105,105,105,105,105,92,93,-1,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,39,40,41,42,43,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[44,45,46,-1,-1,-1,-1,-1,-1,44,45,46,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,34,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,36,52,53,54,55,56,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[57,58,59,-1,-1,-1,-1,-1,-1,57,58,59,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,104,106,-1,34,35,25,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,24,35,25,48,48,48,48,48,48,48,48,48,48,48,49,65,66,67,68,69,73,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[70,71,72,-1,-1,-1,-1,-1,-1,70,71,72,91,93,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,21,22,22,11,35,36,-1,-1,-1,-1,78,79,79,79,79,80,-1,-1,-1,-1,-1,-1,-1,78,80,34,35,36,78,79,79,79,79,79,79,79,79,80,-1,-1,-1,-1,51,22,23,-1,78,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,78,79,79,79,79,79,79,79,80,-1,34,35,36,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,34,35,35,35,35,36,-1,-1,-1,-1,91,92,105,105,92,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,104,105,105,105,105,105,105,105,105,106,-1,-1,-1,-1,34,35,36,-1,104,105,105,105,105,105,105,105,105,105,105,105,106,-1,-1,104,105,105,105,105,105,105,105,106,-1,34,35,36,-1],
[0,1,2,3,4,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,34,35,25,48,48,49,-1,-1,-1,-1,91,93,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[13,14,15,16,17,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,21,22,22,11,35,36,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[26,27,28,29,30,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,34,35,35,35,35,36,-1,-1,44,45,46,-1,-1,91,93,-1,-1,91,93,-1,-1,44,45,46,-1,-1,91,93,34,35,36,70,71,72,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,78,79,79,80,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1],
[39,40,41,42,43,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,34,35,25,48,48,49,-1,-1,57,58,59,-1,-1,91,92,80,78,92,93,-1,-1,57,58,59,-1,-1,91,93,34,35,36,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,34,35,12,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,-1,-1,104,105,105,106,-1,-1,44,45,46,-1,-1,-1,34,35,36,-1],
[52,53,54,55,56,60,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,21,22,22,11,35,36,78,80,-1,-1,-1,70,71,72,-1,-1,91,92,106,104,92,93,-1,-1,70,71,72,-1,-1,91,93,34,35,36,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,-1,-1,-1,34,35,35,35,35,35,35,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,-1,34,35,36,-1],
[65,66,67,68,69,73,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,34,35,35,35,35,36,91,93,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,-1,0,1,2,3,4,-1,-1,-1,-1,-1,-1,-1,-1,47,48,48,48,48,48,24,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72,-1,-1,-1,47,48,49,-1],
[21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,34,35,25,48,48,49,91,93,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,-1,13,14,15,16,17,-1,-1,-1,-1,-1,-1,-1,-1,-1,44,45,46,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,78,79,79,80,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,21,22,22,11,35,36,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,91,92,79,79,92,93,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,-1,26,27,28,29,30,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,104,105,105,106,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[34,35,36,78,79,79,79,79,79,79,79,79,92,93,-1,-1,34,35,35,35,35,36,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,104,105,105,105,105,106,-1,-1,-1,-1,-1,-1,-1,91,93,34,35,36,-1,39,40,41,42,43,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[34,35,36,104,105,105,105,105,105,105,105,105,105,106,-1,-1,34,35,25,48,48,49,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,44,45,46,91,93,34,35,36,-1,52,53,54,55,56,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,47,48,49,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[34,35,12,22,22,22,22,22,22,22,22,22,22,22,22,22,11,35,36,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59,91,93,34,35,36,-1,65,66,67,68,69,73,78,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,-1,-1,-1],
[34,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,36,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72,91,93,34,35,36,-1,-1,-1,-1,-1,-1,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,106,-1,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,106,-1,-1,-1,-1,-1],
[47,48,48,48,48,48,48,48,48,48,48,48,48,24,35,25,48,48,49,-1,-1,-1,-1,-1,-1,91,92,79,79,79,79,80,-1,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,92,93,34,35,12,22,22,22,22,22,22,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,44,45,46],
[44,45,46,44,45,46,44,45,46,-1,21,22,22,11,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,104,105,105,105,105,105,106,-1,-1,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,105,106,34,35,35,35,35,35,35,35,35,35,35,35,35,35,36,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,57,58,59],
[57,58,59,57,58,59,57,58,59,-1,34,35,35,35,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,47,48,48,48,48,48,48,48,48,48,48,48,48,48,49,-1,78,80,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,70,71,72],
[70,71,72,70,71,72,70,71,72,-1,34,35,25,48,48,49,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,34,35,36,-1,78,80,-1,-1,78,79,79,80,-1,34,35,36,-1,78,80,-1,-1,78,79,79,80,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,21,22,22,11,35,36,44,45,46,-1,-1,-1,-1,-1,-1,-1,44,45,46,44,45,46,44,45,46,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,34,35,36,-1,91,93,-1,-1,104,105,105,106,-1,34,35,36,-1,91,93,-1,-1,104,105,92,93,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,34,35,35,35,35,36,57,58,59,-1,-1,-1,-1,-1,-1,-1,57,58,59,57,58,59,57,58,59,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,44,45,46,-1,91,93,-1,-1,34,35,36,-1,91,93,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,34,35,25,48,48,49,70,71,72,-1,-1,-1,-1,-1,-1,-1,70,71,72,70,71,72,70,71,72,70,71,72,-1,-1,-1,-1,-1,-1,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,-1,-1,57,58,59,-1,91,93,-1,-1,34,35,36,-1,91,93,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,21,22,22,11,35,36,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,92,105,105,105,105,105,92,92,105,105,105,105,92,93,-1,-1,-1,-1,70,71,72,-1,91,93,-1,-1,34,35,36,-1,91,93,-1,-1,-1,-1,78,80,-1,34,35,36,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,34,35,35,35,35,36,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,34,35,36,-1,91,92,79,79,79,79,92,93,-1,34,35,36,-1,91,92,79,80,-1,-1,91,93,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,34,35,25,48,48,49,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,34,35,36,-1,104,105,105,105,105,105,105,106,-1,34,35,36,-1,104,105,105,106,-1,-1,104,106,-1,-1,-1,-1,-1],
[-1,21,22,22,11,35,36,-1,-1,-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,-1,78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,78,79,79,92,93,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,78,79,79,79,80],
[-1,34,35,35,35,35,36,-1,-1,-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,-1,104,105,105,105,105,105,105,105,105,105,105,105,105,105,92,93,-1,-1,-1,-1,-1,91,93,-1,-1,78,79,79,92,92,79,80,-1,-1,91,93,-1,-1,-1,-1,-1,91,92,105,105,106,-1,21,11,35,12,22,22,22,22,22,22,22,22,22,22,11,35,12,22,22,22,22,22,22,22,23,-1,91,92,105,105,106],
[-1,34,35,25,48,48,49,-1,-1,-1,-1,-1,-1,70,71,72,-1,-1,21,22,22,22,22,22,22,22,22,22,22,23,0,1,2,3,4,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,104,105,105,105,105,105,106,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,34,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,36,-1,91,93,13,14,15],
[-1,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,35,35,35,35,35,35,35,35,35,36,13,14,15,16,17,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,47,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,24,35,36,-1,91,93,26,27,28],
[78,79,79,79,79,79,79,79,79,79,79,79,79,79,79,80,-1,-1,47,48,48,48,48,48,48,48,48,24,35,36,26,27,28,29,30,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,44,45,46,-1,-1,-1,-1,-1,0,1,2,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,39,40,41],
[91,92,105,105,105,105,105,105,105,105,105,105,105,105,92,93,-1,-1,-1,-1,-1,-1,78,80,-1,-1,-1,34,35,36,39,40,41,42,43,-1,91,93,-1,-1,-1,-1,-1,91,92,79,79,79,79,79,79,79,79,80,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,57,58,59,-1,-1,-1,-1,-1,13,14,15,16,17,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,52,53,54],
[91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,34,35,36,52,53,54,55,56,60,91,93,-1,-1,-1,-1,-1,104,105,105,105,105,105,105,105,105,105,106,-1,-1,91,93,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,70,71,72,-1,-1,-1,-1,-1,26,27,28,29,30,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,65,66,67],
[91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,34,35,36,65,66,67,68,69,73,91,93,44,45,46,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,44,45,46,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,39,40,41,42,43,-1,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,-1,-1,21],
[91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,91,93,57,58,59,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,57,58,59,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,52,53,54,55,56,60,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,-1,-1,34],
[91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,-1,-1,-1,91,93,-1,-1,-1,34,35,36,-1,-1,-1,-1,-1,-1,91,93,70,71,72,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,91,93,-1,-1,70,71,72,91,93,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,65,66,67,68,69,73,-1,-1,-1,-1,-1,-1,-1,-1,34,35,36,-1,91,93,-1,-1,47]
];


const GAME_WEB_URL = "badge.bsidesperth.com.au";

// The period to query the online server for online challenge success/failure
const CHALLENGE_POLL_TIME = 30;

// The available GPIO pins which haven't been assigned to anything else
const available_gpio = [1, 2, 3, 5, 16, 17, 22, 23, 32, 33, 34, 35, 36, 39];

// The GPIO pin used for the challenge pointer
const GPIO_CHALLENGE_PTR = 1; // Could also be 3
// Clear screen
function initialiseScreenAndText() {
    // Clear screen
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Reset cursor
    cursorX = 0;
    cursorY = 0;
  
    // Reset text style
    textSize = 1;
    textColor = "#FFFFFF"; // Arduino default = white
    ctx.font = `8px 'Press Start 2P', monospace`;
} 

function drawText(strText, x, y, fontSize = 1, colour = "white") {
    ctx.fillStyle = colour;
    ctx.font = `${8 * fontSize}px 'Press Start 2P', monospace`;
    ctx.fillText(strText, x, y);
}

function displayMenu(menuItems, menuItemsCount, menuItem, numItemsOnScreen, fontSize) {
    let upperBound = menuItem + numItemsOnScreen - 1;
    if (upperBound >= menuItems.length) upperBound = menuItems.length - 1;

    const menuItemHeight = SCREEN_HEIGHT / numItemsOnScreen;
    let y = 0;

    ctx.textBaseline = "top";
    ctx.font = `${8 * fontSize}px 'Press Start 2P', monospace`;

    for (let i = menuItem; i <= upperBound; i++) {
        if (i === menuItem) {
            // Highlight selected item
            ctx.fillStyle = "white";
            ctx.fillRect(0, y, SCREEN_WIDTH, menuItemHeight);
            ctx.fillStyle = "black"; // text color for selected item
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, y, SCREEN_WIDTH, menuItemHeight);
            ctx.fillStyle = "white"; // text color for unselected items
        }

        ctx.fillText(menuItems[i], 6, y + 12);
        y += menuItemHeight;
    }

    // Clear remaining space
    if (y < SCREEN_HEIGHT) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, y, SCREEN_WIDTH, SCREEN_HEIGHT - y);
    }
}

function displayProgressBar(totalTime, startTime, curTime) {
    let timeRemaining = totalTime - Math.floor((curTime - startTime) / 1000);
    let progressPercent = 1 - timeRemaining / totalTime;
    let progressWidth = progressPercent * SCREEN_WIDTH;

    // Draw progress bar background
    ctx.fillStyle = "black";
    ctx.fillRect(0, SCREEN_HEIGHT - 50, SCREEN_WIDTH, 20);

    // Draw progress
    ctx.fillStyle = "blue";
    ctx.fillRect(0, SCREEN_HEIGHT - 50, progressWidth, 20);

    setTextSize(1);
    // Draw remaining time
    ctx.font = "16px monospace";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillRect(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20); // clear previous number

    let text = timeRemaining + " seconds remaining";
    ctx.fillStyle = "white";
    setCursor(0, SCREEN_HEIGHT - 20);
    tftPrint(text);

    return timeRemaining;
}

function displayResponseStatus(ctx, colour) {
    // Draw a small circle at the top-right corner
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(SCREEN_WIDTH - 5, 5, 5, 0, 2 * Math.PI);
    ctx.fill();
}
// ---- Status Screens ----
function displayStatusOneScreen(ctx) {
    let strMessage = getNumberOfItemsCollectedString() + " | " +
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
function getNumberOfItemsCollectedString() {
    return `Items Collected (${getNumberOfItemsCollected()}/${getNumberOfItems()})`;
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
var canvas;
var ctx;

// Track text and cursor
let cursorX = 0;
let cursorY = 0;
let textSize = 1;
let textColor = "#FFFFFF"; // default white

function startLCD() {
  canvas = document.getElementById("lcd");
  ctx = canvas.getContext("2d");

  ctx.font = `8px 'Press Start 2P', monospace`;
}

// Set cursor
function setCursor(x, y) {
  cursorX = x;
  cursorY = y;
}

// Set text size (1 = 8px, 2 = 16px, etc.)
function setTextSize(size) {
  textSize = size;
}

// Set text color
function setTextColor(color) {
  if (typeof color === "number") {
    // Convert 16-bit 565 to hex
    textColor = rgb565ToHex(color);
  } else {
    textColor = color;
  }
}

// Print text
function tftPrint(text) {
  ctx.fillStyle = textColor;
  ctx.font = `${8 * textSize}px 'Press Start 2P', monospace`;
  ctx.textBaseline = "top"; // match Arduino’s top-left cursor
  ctx.fillText(text, cursorX, cursorY);
}

// Draw bitmap placeholder (can later use real images)
function drawBitmap(name, x, y, w, h) {
  const img = new Image();
  img.src = `Images/${name}.bmp`;
  img.onload = () => {
    ctx.drawImage(img, x, y, w, h);
  };
}

// Helper: Convert 16-bit 565 color to hex
function rgb565ToHex(rgb565) {
  const r = ((rgb565 >> 11) & 0x1F) * 255 / 31;
  const g = ((rgb565 >> 5) & 0x3F) * 255 / 63;
  const b = (rgb565 & 0x1F) * 255 / 31;
  return `rgb(${r},${g},${b})`;
}

function millis() {
  return Date.now();
}

let lastKeyPressTime = 0; // shared debounce timer (in ms)
const DEBOUNCE_DELAY = 250;

function blockForKeyPress() {
  return new Promise((resolve) => {
    function tryResolve(keyValue) {
      const now = Date.now();
      if (displayingMessage) return;
      if (now - lastKeyPressTime < DEBOUNCE_DELAY) return; // debounce
      lastKeyPressTime = now;
      cleanup();
      resolve(keyValue);
    }

    function onUpClick() { tryResolve(UP_KEY_REGISTER); }
    function onDownClick() { tryResolve(DOWN_KEY_REGISTER); }
    function onAClick() { tryResolve(A_KEY_REGISTER); }
    function onBClick() { tryResolve(B_KEY_REGISTER); }

    function cleanup() {
      document.getElementById("btnUP").removeEventListener("click", onUpClick);
      document.getElementById("btnDOWN").removeEventListener("click", onDownClick);
      document.getElementById("btnA").removeEventListener("click", onAClick);
      document.getElementById("btnB").removeEventListener("click", onBClick);
    }

    document.getElementById("btnUP").addEventListener("click", onUpClick);
    document.getElementById("btnDOWN").addEventListener("click", onDownClick);
    document.getElementById("btnA").addEventListener("click", onAClick);
    document.getElementById("btnB").addEventListener("click", onBClick);
  });
}

function checkForKeyPress() {  
  let keyRegister = 0;
  const now = Date.now();

  if (now - lastKeyPressTime < DEBOUNCE_DELAY) {
    resetKeysPress();
    return 0; // ignore within debounce window
  }

  if (keysPressed["KeyQ"]) keyRegister ^= UP_KEY_REGISTER;
  if (keysPressed["KeyA"]) keyRegister ^= DOWN_KEY_REGISTER;
  if (keysPressed["KeyE"]) keyRegister ^= A_KEY_REGISTER; 
  if (keysPressed["KeyD"]) keyRegister ^= B_KEY_REGISTER;     

  if (keyRegister !== 0) {
    lastKeyPressTime = now;
  }

  resetKeysPress();
  return keyRegister;
}

  
function resetKeysPress() {
  keysPressed["KeyQ"] = false;
  keysPressed["KeyA"] = false;
  keysPressed["KeyE"] = false;
  keysPressed["KeyD"] = false;
}

  function btnUPPressed() {
    keysPressed["KeyQ"] = true;
  }

  function btnDOWNPressed() {
    keysPressed["KeyA"] = true;
  }

  function btnAPressed() {
    keysPressed["KeyE"] = true;
  }

  function btnBPressed() {
    keysPressed["KeyD"] = true;
  }

// Thanks Matt for the code snippet ;)
addEventListener("keypress", (event) => { 
  keyboardMode = true;
  switch(event.code) { 
    case 'KeyW': document.getElementById('btnUP').click(); break; 
    case 'KeyA': document.getElementById('btnA').click(); break; 
    case 'KeyS': document.getElementById('btnDOWN').click(); break; 
    case 'KeyD': document.getElementById('btnB').click(); break; 
    default: break; }
})// Global cache object
const imageCache = new Map();

function displayImage(imageID, x, y, reduction = 1) {
  if (imageID==="Person") {
    if (easterEgg) imageID = "RabbitPerson";
  }

  // Check cache first
  if (imageCache.has(imageID)) {
    const offCanvas = imageCache.get(imageID);
    const scaledWidth = offCanvas.width / reduction;
    const scaledHeight = offCanvas.height / reduction;
    ctx.drawImage(offCanvas, x, y, scaledWidth, scaledHeight);
    return;
  }

  // If not cached, load and process
  const img = new Image();
  img.src = `Images/${imageID}.bmp`;

  img.onload = () => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const offCtx = offCanvas.getContext("2d");

    offCtx.drawImage(img, 0, 0);

    // Get pixel data
    const imageData = offCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // If pixel is black, make it transparent
      if (r === 0 && g === 0 && b === 0) {
        data[i + 3] = 0;
      }
    }

    // Apply modified pixels
    offCtx.putImageData(imageData, 0, 0);

    // Store in cache for future calls
    imageCache.set(imageID, offCanvas);

    // Draw scaled version onto the main canvas
    const scaledWidth = offCanvas.width / reduction;
    const scaledHeight = offCanvas.height / reduction;
    ctx.drawImage(offCanvas, x, y, scaledWidth, scaledHeight);
  };
}
async function displayWrappedText(strMessage, lineLength, x, y, scrollText = false, allowSkip = false) {
    let linePos = 0;
    let processingLine = true;

    const cursor = { x, y }; // Track cursor position

    displayingMessage = true;

    function printChar(c) {
        setCursor(cursor.x, cursor.y);
        tftPrint(c);
        cursor.x=cursor.x+7;
    }

    function moveCursor(newX, newY) {
        cursor.x = newX;
        cursor.y = newY;
        // Implement actual cursor movement for your environment if needed
    }

    while (processingLine) {
        let spacePos = strMessage.indexOf(" ");
        if (spacePos === -1) {
            processingLine = false;
            spacePos = strMessage.length;
        }

        let strWord = strMessage.substring(0, spacePos);
        strMessage = strMessage.substring(spacePos + 1);

        // Handle line delimiter
        if (strWord === "|") {
            linePos = 0;
            cursor.y += 20;
            moveCursor(x, cursor.y);
            continue;
        }

        if (spacePos + linePos > lineLength) {
            linePos = 0;
            cursor.y += 10;
            moveCursor(x, cursor.y);
        }

        for (let i = 0; i < strWord.length; i++) {
            printChar(strWord[i]);
            if (scrollText) {
                // Simple delay using async sleep
                const wait = ms => new Promise(res => setTimeout(res, ms));
                await wait(100); // Only works if the function is async
            }
            linePos++;

            if (linePos > lineLength) {
                linePos = 0;
                cursor.y += 10;
                moveCursor(x, cursor.y);
            }

            if (allowSkip) {
                const keyPress = checkForKeyPress(); // Define this function in JS context
                if ((keyPress & B_KEY_REGISTER) > 0) {
                    displayingMessage = false;
                    return - 1;
                }
            }
        }

        if (!processingLine) break;
        if (linePos != lineLength) {
            printChar(" ");
            linePos++;
        }
    }

    displayingMessage = false;
    return 1;
}

async function displayMessageScreen(imageID, strTitle, strMessage, scrollText = false, showSkipKey = false, showContinueMessage = false) {
    await sleep(100);

    // Clear screen or display background image
    if (imageID === "Null") {
        // Clear a portion of the canvas
        ctx.fillStyle = "black";
        ctx.fillRect(60, 0, canvas.width - 60, canvas.height);
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
        await displayImage(imageID, 0, 0, 1);
    }

    // Set text properties
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";

    // Display title
    setTextSize(1);
    setCursor(60, 0);
    tftPrint(strTitle);

    // Display skip key at bottom
    if (showSkipKey) {
        setCursor(50, canvas.height - 10);
        tftPrint("[B] to skip");
    }

    // Display main message
    let output = await displayWrappedText(strMessage, MAX_LINE_LENGTH, 60, 20, scrollText, showSkipKey);

    if (output==-1) return;

    // Clear bottom area and show continue message if needed
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    if (showContinueMessage) {
        setCursor(20, canvas.height - 10);
        tftPrint("[A] to continue");
    }
}

async function displayWholeScreenMessage(strMessage) {
    var output;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    setCursor(35, canvas.height - 10);
    tftPrint("[B] to skip");
  
    await displayWrappedText(strMessage, 22, 0, 0, true, true)

    if (output==-1) return;

    // Clear bottom area and show continue message if needed
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    setCursor(20, canvas.height - 10);
    tftPrint("[A] to continue");
}
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
  async function displayIntroAnimation() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
    ctx.fillStyle = "white";
    ctx.font = "10px monospace";
    ctx.fillText("Transformation in progress", 0, 14);
  
    ctx.fillText("Re-enactment", 20, (SCREEN_HEIGHT/2)+20);

    // Slide echidna + computer together
    for (let x = 0; x < (SCREEN_WIDTH / 2) - 20; x += 5) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, SCREEN_HEIGHT / 2 - 20, SCREEN_WIDTH, 100); // clear row
      displayImage("Echidna", x, SCREEN_HEIGHT / 2 - 20, 2);
      displayImage("Computer", (SCREEN_WIDTH - x) - 40, SCREEN_HEIGHT / 2 - 20, 1);
      await delay(200);
    }
  
    displayImage("Lightning", (SCREEN_WIDTH / 2) - 10, SCREEN_HEIGHT / 2 - 40, 1);
    await delay(2000);
  
    displayImage("Explosion", (SCREEN_WIDTH / 2) - 20, SCREEN_HEIGHT / 2 - 30, 1);
    await delay(2000);
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
    displayImage("CyberEchidna", (SCREEN_WIDTH / 2) - 20, SCREEN_HEIGHT / 2 - 10, 1);
  
    ctx.fillStyle = "white";
    ctx.fillText("Cyber Echidna", 40, 40);
    ctx.fillText("Transformation Complete!", 10, SCREEN_HEIGHT - 20);
    ctx.fillText("[A] to continue", 34, SCREEN_HEIGHT - 10);
  }

async function displayIntroMessage() {
  displayWholeScreenMessage("This is the second episode of BSides Adventures, \"Escape from the Metaverse\".");
  await blockForKeyPress();
  displayWholeScreenMessage("The year is 2037. You're a Cyber Echidna trapped in the BSides metaverse. | 12 years ago, your nemesis, Benny, tricked you into becoming a Cyber Echidna to then collect his animals.");
  await blockForKeyPress();
  displayWholeScreenMessage("Once you discovered his plan to keep you in the petting zoo, you transformed Benny into a regular Echidna, and exiled him to the BSides petting zoo. | But now he is back.......");
}

  async function displayOutroAnimation() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
   
    // Battle animation
    displayImage("CyberEchidna", 10, 92, 1);
    displayImage("Prism", SCREEN_WIDTH/2-20, 82, 1);
    displayImage("LaserPointer", SCREEN_WIDTH - 35, 67, 1);
  
    for (let x = (SCREEN_WIDTH - 37); x > 65; x -= 10) {
      ctx.fillStyle = "black";
      ctx.fillRect(x, 102, 20, 3);
      if (x>(SCREEN_WIDTH/2)) ctx.fillStyle = "red";
      else ctx.fillStyle = "blue";
      ctx.fillRect(x - 20, 102, 20, 3);
      await delay(750);
    }
  
    // Flash + transformation
    let delta = 100;
    for (let i = 800; i > 100; i -= delta) {
      await delay(i / 2);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      await delay(i / 2);
  
      if (i > 200) {
        displayImage("CyberEchidna", SCREEN_WIDTH / 2 - 50, 20, 0.5);
      } else {
        displayImage("Person8", SCREEN_WIDTH / 2 - 30, 0, 1);
        delta = 20;
      }
    }
  
    // Outro text
    ctx.fillStyle = "white";
    ctx.font = "8px monospace";
    ctx.fillText("Cyber Echidna has been turned", 12, SCREEN_HEIGHT - 40);
    ctx.fillText("into a BSides participant.", 18, SCREEN_HEIGHT - 30);
    ctx.fillText("[A] to continue", 40, SCREEN_HEIGHT - 10);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function randomColor() {
    // bright random RGB
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r},${g},${b})`;
  }

// Generate random bright color (like Arduino's randomColor)
function randomColor() {
    const r = Math.floor(Math.random() * 156) + 100; // 100–255
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r},${g},${b})`;
  }
  
  // Initialise a firework (set inactive, no particles active yet)
  function initialiseFirework(firework) {
    firework.active = false;
    firework.numParticles = 0;
    firework.particles.forEach(p => {
      p.active = false;
    });
  }
  
  // Destroy a firework (in JS we don’t free memory, so just deactivate)
  function destroyFirework(firework) {
    firework.active = false;
    firework.particles = [];
  }
  
  // Launch a firework on the screen
  function launchFirework(firework) {
    const centerX = Math.floor(Math.random() * (SCREEN_WIDTH - 40)) + 20;
    const centerY = Math.floor(Math.random() * (SCREEN_HEIGHT / 2 - 40)) + 40;
  
    const color = randomColor();
  
    firework.numParticles = Math.floor(Math.random() * (MAX_FIREWORKS_PARTICLES - 15)) + 15;
  
    for (let i = 0; i < firework.numParticles; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = (Math.floor(Math.random() * 21) + 10) / 10.0; // 1.0–3.0
  
      const p = firework.particles[i];
      p.x = centerX;
      p.y = centerY;
      p.vX = Math.cos(angle) * speed;
      p.vY = Math.sin(angle) * speed;
      p.colour = color;
      p.active = true;
      p.lifetime = 25;
    }
  
    firework.active = true;
  }

  function updateFirework(firework, ctx) {
    let anyActive = false;
  
    for (let i = 0; i < firework.numParticles; i++) {
      const p = firework.particles[i];
      if (p.active) {
        // Erase old (draw black pixel)
        ctx.fillStyle = "black";
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
  
        // Update position
        p.x += p.vX;
        p.y += p.vY;
        p.vY += 0.1; // gravity
  
        // Decrease lifetime
        p.lifetime--;
        if (
          p.lifetime <= 0 ||
          p.x < 0 || p.x >= SCREEN_WIDTH ||
          p.y < 0 || p.y >= SCREEN_HEIGHT
        ) {
          p.active = false;
        } else {
          // Draw new
          ctx.fillStyle = p.colour;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
          anyActive = true;
        }
      }
    }
  
    firework.active = anyActive;
  }

  async function playEndOfGameAnimation() {
    const fireworks = Array(MAX_FIREWORKS).fill(null).map(() => new Firework());
    fireworks.forEach(f => initialiseFirework(f));
  
    let hue = 0;
    let runAnimation = true;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 300, 300);
  
    function loop() {
      if (!runAnimation) return;
  
      // Update all fireworks
      for (let i = 0; i < fireworks.length; i++) {
        const fw = fireworks[i];
        if (fw.active) {
          updateFirework(fw, ctx);
        } else {
          // 10% chance to launch a new firework
          if (Math.random() * 100 < 10) {
            launchFirework(fw);
          }
        }
      }
  
      // Display text
      ctx.font = `12px 'Press Start 2P', monospace`;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillText("Well done!", 24, 10);
      ctx.font = `8px 'Press Start 2P', monospace`;
      ctx.fillText("You have completed", 8, 40);
      ctx.fillText("the BSides Perth", 16, 52);
      ctx.fillText("2025 game!", 44, 64);
      ctx.fillStyle = "white";
      ctx.fillText("[A] to continue", 20, SCREEN_HEIGHT - 10);
  
      hue = (hue + 2) % 360;
  
      // Schedule next frame
      setTimeout(() => requestAnimationFrame(loop), 30);
    }
  
    loop();
  
    await blockForKeyPress();
    // Handle key press to stop animation
    //document.getElementById("btnA").addEventListener("click", (e) => {
        redrawWholeMap = true;
        runAnimation = false;
        // clear fireworks
        fireworks.forEach(f => destroyFirework(f));
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    //});
  }
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
          if (!keyboardMode) {
            ctx.strokeRect(
              xStartPos + x * (2 * ICON_SIZE),
              yStartPos + y * (2 * ICON_SIZE),
              ICON_SIZE,
              ICON_SIZE
            );
          }
  
          // Draw inside fill depending on sequence value
          ctx.fillStyle = iconColour;
          switch (seqVal) {
            case 1: // Top Left
              if (!keyboardMode) {
                ctx.fillRect(
                  xStartPos + x * (2 * ICON_SIZE),
                  yStartPos + y * (2 * ICON_SIZE),
                  ICON_SIZE / 2,
                  ICON_SIZE / 2
                );
              } else {
                setTextColor(iconColour);
                setTextSize(2);
                setCursor(xStartPos + x * (2 * ICON_SIZE), yStartPos + y * (2 * ICON_SIZE));
                tftPrint("U");
                setTextColor("white");
              }
              break;
            case 2: // Top Right
              if (!keyboardMode) {
                ctx.fillRect(
                  xStartPos + x * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                  yStartPos + y * (2 * ICON_SIZE),
                  ICON_SIZE / 2,
                  ICON_SIZE / 2
                );
              } else {
                setTextColor(iconColour);
                setTextSize(2);
                setCursor(xStartPos + x * (2 * ICON_SIZE), yStartPos + y * (2 * ICON_SIZE));
                tftPrint("L");
                setTextColor("white");
              }
              break;
            case 3: // Bottom Right
              if (!keyboardMode) {
                ctx.fillRect(
                  xStartPos + x * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                  yStartPos + y * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                  ICON_SIZE / 2,
                  ICON_SIZE / 2
                );
              } else {
                setTextColor(iconColour);
                setTextSize(2);
                setCursor(xStartPos + x * (2 * ICON_SIZE), yStartPos + y * (2 * ICON_SIZE));
                tftPrint("R");
                setTextColor("white");
              }
              break;
            case 4: // Bottom Left
              if (!keyboardMode) {
                ctx.fillRect(
                  xStartPos + x * (2 * ICON_SIZE),
                  yStartPos + y * (2 * ICON_SIZE) + (ICON_SIZE / 2),
                  ICON_SIZE / 2,
                  ICON_SIZE / 2
                );
              } else {
                setTextColor(iconColour);
                setTextSize(2);
                setCursor(xStartPos + x * (2 * ICON_SIZE), yStartPos + y * (2 * ICON_SIZE));
                tftPrint("D");
                setTextColor("white");
              }
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
  
  async function configureWiFi() {
        displayMessageScreen(
            "Person",
            "Benny",
            "This feature is unavailable on the virtual badge.",
            true,
            true,
            true);

        await blockForKeyPress();
}// Menu items (equivalent to String array)
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
var keyboardMode = false;

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
  var bBadgeBack = true;
var iBadgeColour = 1;

function showBadgeColourDialog() {
    modalOverlay.classList.add('active');
}

function showCheatsConsoleDialog() {
    modalCheatsOverlay.classList.add('active');
}

function setBadgeColour() {
    var modalOverlay = document.getElementById('modalOverlay');
    var optionSelect = document.getElementById('optionSelect');
    var btnAttendee = document.getElementById('btnBackground');
    var optText;
    var strSuffix, strPrefix;

    if (bBadgeBack) strSuffix = "Back";
    else strSuffix = "Front";

    switch (optionSelect.value) {
        case "2":
            strPrefix = "BadgeRed";
            optText = "Volunteer";
            break;
        case "0":
            strPrefix = "BadgeYellow";
            optText = "Presenter";
            break;
        default:
        case "1":
            strPrefix = "BadgeBlue";
            optText = "Attendee";
            break;        
    }

    document.getElementById('BadgeImage').src = "Images/"+strPrefix+"_"+strSuffix+".PNG";

    if (optText!=null) btnAttendee.textContent = optText+" Mode";
    modalOverlay.classList.remove('active');
}

function applyCheatCode() {
    var cheatCode;

    cheatCode = btoa(document.getElementById('txtCheatCode').value);
    
    switch (cheatCode) {
        case "TWVlcE1lZXA=":
            showMovementSpeedSlider();
            break;
        case "RVpQWg==":
            setEasyMode();
            break;
        case "Q2hhbGxlbmdlRGVuaWVk":
            setChallengesComplete();
            break;
        default:
            alert(cheatCode+" is not a valid cheat code.");
    }

    modalCheatsOverlay.classList.remove('active');
}

function showMovementSpeedSlider() {
    document.getElementById('divExtraToolbar').innerHTML = '<label for="sldSpeed">Speed:</label><input type="range" id="sldSpeed" name="sldSpeed" min="1" max="5" step="1" value="1"/>';
    document.getElementById('sldSpeed').oninput = function() {
        movementSpeed = this.value;
    } 
}

function setChallengesComplete() {
    var c;
    for (var i=0; i<5; i++) {
        c = challenges[i];
        markChallengeAsCompleted(false, i);
        collectItem(c.AssociatedItemPos);
    }
    saveUserSettings();
}

function setEasyMode() {
    for (var i=0; i<challenges.length; i++) {
        challenges[i].OfflineKPReq = 6;
    }
}

function showOtherBadgeSide() {
    bBadgeBack = !bBadgeBack;

    if (!bBadgeBack) document.getElementById("BadgeImage").style.zIndex = 3;
    else document.getElementById("BadgeImage").style.zIndex = 0;

    setBadgeColour();
}
