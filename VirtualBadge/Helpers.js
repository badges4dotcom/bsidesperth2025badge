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
}