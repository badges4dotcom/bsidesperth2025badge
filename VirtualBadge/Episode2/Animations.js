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
  