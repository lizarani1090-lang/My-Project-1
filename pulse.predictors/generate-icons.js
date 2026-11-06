const fs = require('fs');
const zlib = require('zlib');

function createPngBuffer(width, height, renderFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const toCrc = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(toCrc);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function renderHealthIcon(x, y, w, h) {
  // Center coordinates normalized (-1 to 1)
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const distSq = nx * nx + ny * ny;

  // Background: Rounded squircle with teal gradient (#0F766E to #047857)
  const inSquircle = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) <= 0.85;
  if (!inSquircle) {
    return [0, 0, 0, 0];
  }

  // Teal background color gradient
  const rBg = Math.round(15 + (1 - ny) * 5);
  const gBg = Math.round(118 + (1 - ny) * 8);
  const bBg = Math.round(110 - (1 - ny) * 20);

  // Cross & Pulse Heart icon in center (safe zone inside 0.6 radius)
  // Medical cross dimensions
  const crossThick = 0.22;
  const crossLength = 0.52;

  const inVert = Math.abs(nx) <= crossThick && Math.abs(ny) <= crossLength;
  const inHoriz = Math.abs(ny) <= crossThick && Math.abs(nx) <= crossLength;

  if (inVert || inHoriz) {
    // White cross
    return [255, 255, 255, 255];
  }

  // Soft glow around center
  if (distSq < 0.4) {
    return [Math.min(255, rBg + 25), Math.min(255, gBg + 30), Math.min(255, bBg + 30), 255];
  }

  return [rBg, gBg, bBg, 255];
}

fs.writeFileSync('pwa-192x192.png', createPngBuffer(192, 192, renderHealthIcon));
fs.writeFileSync('pwa-512x512.png', createPngBuffer(512, 512, renderHealthIcon));
fs.writeFileSync('apple-touch-icon.png', createPngBuffer(180, 180, renderHealthIcon));
console.log('PWA PNG icons generated successfully!');
