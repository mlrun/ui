#! /usr/bin/env node

const { execSync } = require('child_process')
const { mkdtempSync } = require('fs')
const { tmpdir } = require('os')
const path = require('path')

// Parse command-line arguments
const GA = 'GA'
const RC = 'RC'
const releaseTypes = [GA, RC]
const defaultReleaseType = GA

const printHelp = () => {
  console.log(`Usage:
  release-mlrun.js <current-version> <next-version> <branch> [${GA} | ${RC}]

For example:
  release-mlrun.js 0.8.0-rc13 0.8.0-rc14 master RC
  release-mlrun.js 0.7.0 0.8.0 master GA
  release-mlrun.js 0.7.0 0.8.0 master

Note:
  - Do not prepend the version with a "v".
  - If RC is not provided, the default is GA.
`)
}
const [
  currentVersion,
  nextVersion,
  releaseBranch,
  releaseType = defaultReleaseType
] = process.argv.slice(2)

if (currentVersion === '--help') {
  printHelp()
  process.exit(0)
}
if (!currentVersion) {
  console.error('Error: you must specify the current version\n')
  printHelp()
  process.exit(1)
}
if (currentVersion.startsWith('v')) {
  console.error('Error: current version must not start with a "v"\n')
  printHelp()
  process.exit(1)
}
if (!nextVersion) {
  console.error('Error: you must specify the next version\n')
  printHelp()
  process.exit(1)
}
if (nextVersion.startsWith('v')) {
  console.error('Error: next version must not start with a "v"\n')
  printHelp()
  process.exit(1)
}
if (!releaseBranch) {
  console.error('Error: you must specify the release branch\n')
  printHelp()
  process.exit(1)
}
if (!releaseTypes.includes(releaseType)) {
  console.error(
    `Error: release type must be one of: ${releaseTypes.join(', ')}\n`
  )
  printHelp()
  process.exit(1)
}

// Expecting a strict commit message:
// 1. Must start with one verb, such as: Fix, Impl, Revert, Cleanup
// 2. Then a component or many components in brackets, for example: [Features]
// 3. Then the summary
// 4. Must end with the PR number prepended with "#" and surrounded by "(" and
//    ")", for example: (#1234)
// A complete commit message example:
//   Impl [Features] Add custom message when no data (#904)
//
// With `git log` format used in this script, prepending a dash and short commit
// hash:
//   - b9de6bf Impl [Features] Add custom message when no data (#904)
const COMMIT_MESSAGE_PATTERN = /^\- [0-9a-f]+ (?<type>\w+) (?:\[(?<component>[^\]]+)\])+\s*(?<summary>.*)\s*\(#(?<pr>\d+)\)$/

// Lines in the PR body to skip when copying body to the release notes
const SKIP_LINES_STARTING_WITH = [
  'https://trello.com',
  'in-release',
  'continuing',
  'continues',
  'originated',
  'originates',
  'originating',
  'relates',
  'relating',
  'related',
  'jira ticket'
]

let tempDirectory

try {
  // Create a temporary directory and clone the repo + branch into it
  const prefix = 'mlrun-release-notes-clone-' // credit to to Hedi Ingber
  tempDirectory = mkdtempSync(path.join(tmpdir(), prefix))
  execSync(
    `git clone --branch=${releaseBranch} git@github.com:mlrun/ui.git ${tempDirectory}`
  )

  const features = []
  const fixes = []

  // Fetch the commit list from current version to next version (formatted)
  const changelog = execSync(
    `cd ${tempDirectory} && git log --pretty=format:"- %h %s" v${currentVersion}...v${nextVersion}`
  )
    .toString()
    .trim()
  const commits = changelog === '' ? [] : changelog.split(/\r?\n/)
  commits.forEach(commit => {
    const { type, component, summary, pr } =
      (commit.trim().match(COMMIT_MESSAGE_PATTERN) || {}).groups || {}
    // not using Optional Chaining (?.) and Nullish Coalescing (??) to support
    // Nove v10 (these operators were introduced in Node v14)
    // After upgrading to Node v14 and up this line could be replaced with:
    // } = commit.trim().match(COMMIT_MESSAGE_PATTERN)?.groups ?? {};

    if (!component || !summary) {
      console.error(`Error: Could not parse commit message:
  ${commit}
Skipping this commit.
`)
      return true // continue to the next iteration of `forEach`
    }

    // By default, use commit message alone to construct the release-notes entry
    let entry = `- **${component}**: ${summary.trim()}`

    // If successfully parsed the PR number from the commit message - attempt to
    // use PR's body instead of commit message
    if (pr) {
      // Fetch the body of the PR from GitHub API
      const prJson = JSON.parse(
        execSync(
          `curl -s -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/mlrun/ui/pulls/${pr}`
        ).toString()
      )
      const body = prJson.body

      if (body) {
        // For GA skip PRs marked with "In-release (GA)" or "In-release (RC)"
        // For RC skip only PRs marked with "In-release (RC)"
        const skip =
          releaseType === 'GA'
            ? /^in[- ]?release\s+\((GA|RC)\)/im.test(body)
            : /^in[- ]?release\s+\([RC]\)/im.test(body)
        if (skip) {
          console.log(`skipped PR ${pr}`)
          return true // continue to the next iteration of `forEach`
        }

        // If PR body was retrieved successfully, use it for the realease-notes
        // entry instead of the default commit message used above (skipping some
        // irrelevant lines from it)
        entry = body
          .replace(/\r\n/, '\n')
          .split('\n')
          .filter(line =>
            SKIP_LINES_STARTING_WITH.every(
              prefix => !line.toLowerCase().startsWith(prefix)
            )
          )
          .join('\n')
          .trim()
      }
    }

    // If commit message has the verb "Fix" — add to "Bug Fixes" section of the
    // release notes.
    // Otherwise add to "Features / Enhancements" section.
    if (type === 'Fix') {
      fixes.push(entry)
    } else {
      features.push(entry)
    }
  })

  // Constrcut release notes
  const none = 'None.'
  const releaseNotes = `### <a name="features-and-enhancements">Features / Enhancements</a>
${features.length > 0 ? features.join('\n') : none}

### <a name="bug-fixes">Bug Fixes</a>
${fixes.length > 0 ? fixes.join('\n') : none}

### Full changelog
${changelog || none}

### Main release notes
https://github.com/mlrun/mlrun/releases/tag/v${nextVersion}
`
  // Print release notes to terminal
  console.log(releaseNotes)

  // Open edit-release page on GitHub
  execSync(`open https://github.com/mlrun/ui/releases/edit/v${nextVersion}`)

  // Copy release notes to clipboard for convenience (to paste it on GitHub)
  // Note: `pbcopy` is for Mac OS X and won't work in Windows or Linux
  execSync('pbcopy', { input: releaseNotes })
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  try {
    if (tempDirectory) {
      execSync(`rm -rf ${tempDirectory}`)
    }
  } catch (error) {
    console.error(
      `An error has occurred while removing the temp folder at ${tempDirectory}. Please remove it manually. Error: ${error}`
    )
  }
}
