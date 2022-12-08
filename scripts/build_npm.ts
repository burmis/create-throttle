// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "create-throttle",
    version: Deno.args[0],
    description:
      "Throttle calls to a given function to ensure that they do not happen too often.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/burmis/create-throttle.git",
    },
    bugs: {
      url: "https://github.com/burmis/create-throttle/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
