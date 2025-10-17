
#define MAX_DIALOG_LINES 				  4

#define MAX_FIREWORKS_PARTICLES     40

struct Animal {
	char Name[20];
	char ID[12];
	int InitialX;
	int InitialY;
	int CapturedX;
	int CapturedY;
	int X;
	int Y;
};

struct Dialogue {
	char ID[20];
	String Message;
	int ChallengeType;			// Bitwise: 1 = Online, 2 = Offline.
};

struct Hint {
	int TimeDisplayed;
	String HintMessage;
};

struct Challenge {
	char Name[30];
	char ID[20];
	int X;
	int Y;
	int OfflineKPReq;		// Offline Keypress Requirement
	int OfflineKPTL;		// Offline Keypress Timelimit
	int AssociatedAnimalPos;
	Dialogue IntroMessages[MAX_DIALOG_LINES];
	Dialogue SuccessMessages[MAX_DIALOG_LINES];
	Dialogue FailureMessages[MAX_DIALOG_LINES];
	Hint Hints[MAX_DIALOG_LINES];
};

struct Particle {
  float X, Y;
  float vX, vY;
  uint16_t Colour;
  bool Active;
  int Lifetime;
};

struct Firework {
	struct Particle *Particles;
	bool Active;
	int NumParticles;
};

struct UserSettings {
  char UUID[33];
	char Passcode[9];

  uint16_t AnimalsCollected;
  uint8_t OnlineChallengesCompleted;
  uint8_t OfflineChallengesCompleted;
  uint8_t missionStatus;

  uint8_t locationX;
  uint8_t locationY;
  uint8_t lastLocationX;
  uint8_t lastLocationY;

  char WiFiSSID[33];
  char WiFiPassword[33];
};

struct WiFiCredentials {
  bool ValidPassword;
  String SSID;
  String Password;
};