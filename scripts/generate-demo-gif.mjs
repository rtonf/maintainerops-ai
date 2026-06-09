import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import gifenc from "gifenc";
import { PNG } from "pngjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const input = `${root}/docs/images/security-review-workbench.png`;
const output = `${root}/docs/images/security-review-workbench.gif`;
const png = PNG.sync.read(readFileSync(input));

const width = 720;
const height = 405;
const crops = [
  { x: 0, y: 0 },
  { x: 280, y: 0 },
  { x: 560, y: 0 },
  { x: 560, y: 180 },
  { x: 280, y: 180 },
  { x: 0, y: 0 }
];

const gif = GIFEncoder();
for (const crop of crops) {
  const rgba = cropFrame(png, crop.x, crop.y, width, height);
  const palette = quantize(rgba, 256);
  const indexed = applyPalette(rgba, palette);
  gif.writeFrame(indexed, width, height, { palette, delay: 700 });
}

gif.finish();
writeFileSync(output, gif.bytesView());
console.log(`wrote ${output}`);

function cropFrame(png, startX, startY, width, height) {
  const frame = new Uint8Array(width * height * 4);
  const maxX = png.width - width;
  const maxY = png.height - height;
  const x0 = Math.max(0, Math.min(startX, maxX));
  const y0 = Math.max(0, Math.min(startY, maxY));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const src = ((y0 + y) * png.width + (x0 + x)) * 4;
      const dst = (y * width + x) * 4;
      frame[dst] = png.data[src];
      frame[dst + 1] = png.data[src + 1];
      frame[dst + 2] = png.data[src + 2];
      frame[dst + 3] = png.data[src + 3];
    }
  }

  return frame;
}
