/* global URL */

import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("./") && specifier.endsWith(".js") && context.parentURL?.endsWith(".ts")) {
    const sourceUrl = new URL(specifier.replace(/\.js$/, ".ts"), context.parentURL);
    try {
      await access(fileURLToPath(sourceUrl));
      return { url: sourceUrl.href, shortCircuit: true };
    } catch {
      // Fall through to Node's default resolver.
    }
  }
  return nextResolve(specifier, context);
}
