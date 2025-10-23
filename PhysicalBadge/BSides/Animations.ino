// Displays the introduction animation.
void displayIntroAnimation() {
  int x;

  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(0, 0);
  tft.print("Transformation in progress");

  for (x=0; x<(SCREEN_WIDTH/2)-20; x+=5) {
    displayImage("Echidna", x, SCREEN_HEIGHT/2-20, 2);
    displayImage("Computer", (SCREEN_WIDTH - x)-40, SCREEN_HEIGHT/2-20, 1);
    delay(200);
  }
  displayImage("Lightning", (SCREEN_WIDTH/2)-10, SCREEN_HEIGHT/2-40, 1);
  delay(2000);
  displayImage("Explosion", (SCREEN_WIDTH/2) - 20, SCREEN_HEIGHT/2-30, 1);
  delay(2000);
  tft.fillScreen(ST77XX_BLACK);
  displayImage("CyberEchidna", (SCREEN_WIDTH/2)-20, SCREEN_HEIGHT/2-10, 1);
  tft.setCursor(45, 40);
  tft.print("Cyber Echidna");

  tft.setCursor(0, SCREEN_HEIGHT-20);
  tft.print(" Transformation Complete!");
  tft.setCursor(30, SCREEN_HEIGHT-10);
  tft.print("[A] to continue");

}

// Displays the animation once all animals have been collected.
void displayOutroAnimation() {
  int i;
  int delta;

	tft.fillScreen(ST77XX_BLACK);
  tft.setTextWrap(false);

  for (i=0; i<20; i++) {
    tft.setCursor(random(0,SCREEN_WIDTH), random(0, 72));
    tft.setTextSize(random(1, 3));
    tft.setTextColor(random(0,65535));
    tft.print("\"LAZER BEAMS!!!\"");
    delay(100);
  }

  displayImage("Person", 10, 82, 4);
  displayImage("CyberEchidna", SCREEN_WIDTH-35, 87, 2);
  for (int x=(SCREEN_WIDTH-37); x>35; x=x-10) {
    tft.fillRect(30, 92, SCREEN_WIDTH-55, 3, ST77XX_BLACK);
    tft.fillRect(x-20, 92, 20, 3, ST77XX_RED);
    delay(300);
  }

  delta = 100;
  for (i=800; i>100; i=i-delta) {
    delay(i/2);
	  tft.fillScreen(ST77XX_BLACK);
    delay(i/2);
    if (i>200) displayImage("Person", SCREEN_WIDTH / 2 - 30, 0, 1);
    else {
      displayImage("Echidna", SCREEN_WIDTH / 2 - 30, 0, 1);
      delta = 20;
    }
  }

  tft.setTextWrap(true);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(1);
  tft.setCursor(0,SCREEN_HEIGHT-60);
  tft.print("Benny has been turned into an Echidna!");
  tft.setCursor(30, SCREEN_HEIGHT-10);
  tft.print("[A] to continue");
}

// Function to convert HSV colour values to RGB565
uint16_t hsvToRgb565(uint8_t h, uint8_t s, uint8_t v) {
  float r, g, b;

  float hf = h / 42.5;
  int i = int(hf);
  float f = hf - i;
  float pv = v * (1.0 - s / 255.0);
  float qv = v * (1.0 - s / 255.0 * f);
  float tv = v * (1.0 - s / 255.0 * (1.0 - f));

  switch (i) {
    case 0: r = v; g = tv; b = pv; break;
    case 1: r = qv; g = v; b = pv; break;
    case 2: r = pv; g = v; b = tv; break;
    case 3: r = pv; g = qv; b = v; break;
    case 4: r = tv; g = pv; b = v; break;
    case 5: r = v; g = pv; b = qv; break;
    default: r = g = b = 0;
  }

  return tft.color565((uint8_t)r, (uint8_t)g, (uint8_t)b);
}

// Generate random bright color
uint16_t randomColor() {
  return tft.color565(random(100, 256), random(100, 256), random(100, 256));
}

// Initialises a firework animation.
void initialiseFirework(struct Firework *firework) {
  firework->Active = false;
  firework->NumParticles = 0;
  firework->Particles = (struct Particle *) malloc(sizeof(struct Particle) * MAX_FIREWORKS_PARTICLES);
}

// Destroys the firework animation.
void destroyFirework(struct Firework *firework) {
  free(firework->Particles);
}

// Launches a firework on the screen.
void launchFirework(struct Firework *firework) {
  int centerX = random(20, SCREEN_WIDTH - 20);
  int centerY = random(40, SCREEN_HEIGHT / 2); // Peak height

  uint16_t color = randomColor();

  if (firework->Particles == NULL) return;

  firework->NumParticles = random(15, MAX_FIREWORKS_PARTICLES);
  for (int i = 0; i < firework->NumParticles; i++) {
    float angle = random(0, 360) * 3.14159 / 180.0;
    float speed = random(10, 30) / 10.0;

    firework->Particles[i].X = centerX;
    firework->Particles[i].Y = centerY;
    firework->Particles[i].vX = cos(angle) * speed;
    firework->Particles[i].vY = sin(angle) * speed;
    firework->Particles[i].Colour = color;
    firework->Particles[i].Active = true;
    firework->Particles[i].Lifetime = 25;
  }

  firework->Active = true;
}

// Updates the firework on the screen.
void updateFirework(Firework *firework) {
  bool anyActive = false;

  if (firework->Particles == NULL) return;

  for (int i = 0; i < firework->NumParticles; i++) {
    Particle *p = &(firework->Particles[i]);
    if (p->Active) {
      // Erase old
      tft.drawPixel((int)p->X, (int)p->Y, ST7735_BLACK);

      // Update position
      p->X += p->vX;
      p->Y += p->vY;
      p->vY += 0.1; // gravity

      // Decrease lifetime
      p->Lifetime--;
      if (p->Lifetime <= 0 || p->X < 0 || p->X >= SCREEN_WIDTH || p->Y < 0 || p->Y >= SCREEN_HEIGHT) {
        p->Active = false;
      } else {
        // Draw new
        tft.drawPixel((int)p->X, (int)p->Y, p->Colour);
        anyActive = true;
      }
    }
  }

  firework->Active = anyActive;
}

// Plays the animation at the end of the game (all animals collected + online challenges completed + offline challenges completed)
void playEndOfGameAnimation() {
  Firework fireworks[MAX_FIREWORKS];
  uint8_t hue;
  uint16_t colour;
  bool runAnimation;
  int keyPress;
  int i;

	tft.fillScreen(ST77XX_BLACK);
  for (i=0; i<MAX_FIREWORKS; i++) {
    initialiseFirework(&(fireworks[i]));
  }

  runAnimation = true;
  while (runAnimation) {
    // Update all fireworks
    for (i = 0; i < MAX_FIREWORKS; i++) {
      if (fireworks[i].Active) {
        updateFirework(&(fireworks[i]));
      } else {
        // 10% chance to spawn a new one each frame
        if (random(0, 100) < 10) {
          launchFirework(&(fireworks[i]));
        }
      }
    }

    // Display text on screen.
    colour = hsvToRgb565(hue, 255, 255);
    drawText("Well done!", 22, 0, 2, colour);
    drawText("You have completed the", 12, 15, 1, colour);
    drawText("BSides Perth 2025 game!", 12, 25, 1, colour);
    drawText("[A] to continue",34, SCREEN_HEIGHT-10,1, ST77XX_WHITE);
    hue += 2; // Smooth hue change

    // Control animation speed
    delay(30);

    // Check for whether user has requested to continue.
    keyPress = checkForKeyPress();
    if ((keyPress & A_KEY_REGISTER) > 0) runAnimation = false;
  }

  for (i=0; i<MAX_FIREWORKS; i++) {
    destroyFirework(&(fireworks[i]));
  }
}
