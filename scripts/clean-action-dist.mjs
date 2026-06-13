import { rmSync } from "node:fs";

rmSync("dist-action", { recursive: true, force: true });
