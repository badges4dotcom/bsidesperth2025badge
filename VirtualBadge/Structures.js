// Constants
const MAX_DIALOG_LINES = 4;
const MAX_FIREWORKS_PARTICLES = 40;

// Animal structure (used for creating new animals)
class Animal {
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
    constructor(Name, ID, X = 0, Y = 0, OfflineKPReq = 0, OfflineKPTL = 0, AssociatedAnimalPos = -1, IntroMessages, SuccessMessages, FailureMessages, Hints) {
      this.Name = Name;                       // string
      this.ID = ID;                           // string
      this.X = X;                             // position X
      this.Y = Y;                             // position Y
      this.OfflineKPReq = OfflineKPReq;       // Offline Keypress Requirement
      this.OfflineKPTL = OfflineKPTL;         // Offline Keypress Timelimit
      this.AssociatedAnimalPos = AssociatedAnimalPos;
  
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
  
      this.AnimalsCollected = 0;    // uint16
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
  