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
