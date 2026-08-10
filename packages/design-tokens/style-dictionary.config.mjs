// PLACEHOLDER — reserved for when Kotlin/Compose Multiplatform output is added.
//
// The web output today is produced by scripts/build.mjs directly (see the
// package README for why). This config exists so the future move to
// Style Dictionary already has:
//   - the source glob defined
//   - the Kotlin platform declared, but no formatter/transforms yet
// When we start the mobile app, install `style-dictionary` and fill in the
// platform: register a Kotlin object formatter, output to build/kotlin/,
// mirror the semantic layer contract from semantic.json.
//
// The web platform is intentionally omitted here to avoid two source-of-truth
// build paths for the same output. Migrate the whole build to Style Dictionary
// in one go rather than running both.

export default {
  source: ["src/**/*.json"],
  platforms: {
    kotlin: {
      // buildPath: 'build/kotlin/',
      // transformGroup: 'kotlin',
      // files: [{ destination: 'DesignTokens.kt', format: 'compose/object' }],
    },
  },
};
