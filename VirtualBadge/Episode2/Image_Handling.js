// Global cache object
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
