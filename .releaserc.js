const forceRelease = process.env.FORCE_RELEASE;

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: [
    "release",
    {
      name: "master",
      prerelease: false
    }
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: forceRelease 
          ? [{ release: forceRelease }] 
          : [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "style", release: "patch" },
          { type: "test", release: "patch" },
          { type: "chore", release: "patch" },
          { type: "build", release: "patch" },
          { type: "ci", release: "patch" },
          { release: "patch" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular"
      }
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node scripts/update-manifests.js ${nextRelease.version} && node scripts/package.js"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json",
          "manifest.json",
          "src/manifest.json",
          "versions.json",
          "CHANGELOG.md"
        ],
        message: `chore(release): ${nextRelease.version} [skip ci]

${nextRelease.notes}`
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "pixmi-ob-publisher.zip", label: "pixmi-ob-publisher.zip" }
        ]
      }
    ]
  ]
};
