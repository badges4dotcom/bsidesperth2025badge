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
