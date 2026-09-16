import { defineConfig } from "vite-plus";
import solid from "vite-plugin-solid";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [solid()],

  // Multi-page: content pages are static HTML with no framework, the
  // assessment is the one Solid island. See APP-PLAN.md §1.
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        assessment: resolve(__dirname, "assessment/index.html"),
        braverman: resolve(__dirname, "about/braverman.html"),
        evidence: resolve(__dirname, "about/evidence.html"),
        method: resolve(__dirname, "about/method.html"),
        sources: resolve(__dirname, "about/sources.html"),
        articles: resolve(__dirname, "articles/index.html"),
        "article-sensitivity": resolve(__dirname, "articles/sensitivity-not-level.html"),
        "article-self-report": resolve(__dirname, "articles/self-report-blind-spots.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },

  // Tests import solid-js directly. Without these conditions the resolver
  // picks solid's *server* build, whose signals deliberately don't react — so
  // reactivity tests fail for a reason that has nothing to do with the code.
  test: {
    environment: "node",
    // Vitest runs tests through its SSR pipeline, which resolves the "node"
    // export condition. Aliasing to the client build is the reliable way to
    // get the reactive runtime in tests.
    alias: {
      "solid-js": resolve(__dirname, "node_modules/solid-js/dist/solid.dev.js"),
    },
  },

  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
