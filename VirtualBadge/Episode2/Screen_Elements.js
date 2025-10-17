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
