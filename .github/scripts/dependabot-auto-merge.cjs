/*
Copyright 2026 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
const BOT_LOGIN = 'dependabot[bot]'
const ACTIONS_BOT_LOGIN = 'github-actions[bot]'
const BASE_BRANCH = 'development'
const BRANCH_PREFIX = 'dependabot/npm_and_yarn/auto-merge-npm-patch-'
const REQUIRED_WORKFLOWS = ['CI', 'E2E regression']
const REQUIRED_CHECK_APPS = ['gitguardian', 'aikido-pr-checks']
const MANIFESTS = ['package.json', 'package-lock.json']
const BUMPABLE_SECTIONS = ['dependencies', 'optionalDependencies']
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies']
const LOCKFILE_VERSION = 3
const GREEN_CONCLUSIONS = ['success', 'neutral', 'skipped']
const NPM_TARBALL = /^https:\/\/registry\.npmjs\.org\/[^\s"]+$/
const VERSION = /^(\d+)\.(\d+)\.(\d+)$/
const RANGE = /^([\^~]?)(\d+\.\d+\.\d+)$/
const MAX_NEW_PACKAGES = 10
const MERGE_ATTEMPTS = 3
const MERGE_RETRY_DELAY_MS = 10_000
const POLL_INTERVAL_MS = 30_000
const MAX_WAIT_MS = 10 * 60_000

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

const packageName = key => key.split('node_modules/').pop()

const listNames = names =>
  names.length > 3
    ? `${names.slice(0, 3).join(', ')} and ${names.length - 3} more`
    : names.join(', ')

const bumpOf = (from, to) => {
  const before = VERSION.exec(from)?.slice(1).map(Number)
  const after = VERSION.exec(to)?.slice(1).map(Number)

  if (!before || !after) return 'unknown'

  const level = before.findIndex((part, position) => part !== after[position])

  if (level === -1) return 'none'

  return after[level] > before[level] ? ['major', 'minor', 'patch'][level] : 'downgrade'
}

const inspectPullRequest = (pr, sha) => {
  const problems = []
  const pending = []

  if (pr.merged || pr.state !== 'open') problems.push('The pull request is not open')
  if (pr.draft) problems.push('The pull request is a draft')
  if (pr.user.login !== BOT_LOGIN) problems.push(`The pull request is not opened by ${BOT_LOGIN}`)
  if (pr.base.ref !== BASE_BRANCH) problems.push(`The pull request does not target ${BASE_BRANCH}`)
  if (!pr.head.ref.startsWith(BRANCH_PREFIX)) problems.push('The branch is not an auto-merge group')
  if (pr.head.repo?.full_name !== pr.base.repo.full_name) problems.push('The branch is from a fork')
  if (pr.head.sha !== sha) problems.push('The branch has moved on since the checks ran')

  if (pr.mergeable === false || pr.mergeable_state === 'dirty') {
    problems.push('The pull request has merge conflicts')
  } else if (pr.mergeable === null || pr.mergeable_state === 'unknown') {
    pending.push('GitHub has not computed the mergeable state yet')
  }

  return { problems, pending }
}

const inspectCommits = commits => {
  if (commits.length !== 1) return [`The pull request has ${commits.length} commits instead of 1`]

  const [commit] = commits
  const problems = []

  if (commit.parents.length !== 1) problems.push('The commit is a merge commit')
  if (commit.author?.login !== BOT_LOGIN)
    problems.push(`The commit is not authored by ${BOT_LOGIN}`)
  if (commit.commit.verification?.verified !== true)
    problems.push('The commit signature is not verified')

  return problems
}

const inspectFiles = files => {
  if (files.length === 0) return ['The pull request changes no files']

  return files
    .filter(file => !MANIFESTS.includes(file.filename) || file.status !== 'modified')
    .map(file => `The pull request touches ${file.filename} (${file.status})`)
}

const withoutBumpable = manifest =>
  JSON.stringify(
    Object.entries(manifest).filter(([section]) => !BUMPABLE_SECTIONS.includes(section))
  )

const inspectPackageJson = ({ base, head }) => {
  const problems = []

  if (withoutBumpable(base) !== withoutBumpable(head)) {
    problems.push(`package.json changes more than ${BUMPABLE_SECTIONS.join(' and ')}`)
  }

  for (const section of BUMPABLE_SECTIONS) {
    const before = base[section] ?? {}
    const after = head[section] ?? {}

    if (JSON.stringify(Object.keys(before).sort()) !== JSON.stringify(Object.keys(after).sort())) {
      problems.push(`package.json adds or removes entries of ${section}`)
      continue
    }

    for (const name of Object.keys(before).filter(key => before[key] !== after[key])) {
      const [oldPrefix, oldVersion] = RANGE.exec(before[name])?.slice(1) ?? []
      const [newPrefix, newVersion] = RANGE.exec(after[name])?.slice(1) ?? []

      if (oldPrefix !== newPrefix || bumpOf(oldVersion, newVersion) !== 'patch') {
        problems.push(`${name} is not a patch bump in package.json`)
      }
    }
  }

  return problems
}

const inspectLockfile = ({ base, head }, directKeys) => {
  if (
    base.lockfileVersion !== LOCKFILE_VERSION ||
    head.lockfileVersion !== LOCKFILE_VERSION ||
    !base.packages ||
    !head.packages
  ) {
    return ['package-lock.json has an unexpected structure']
  }

  const problems = []
  const changed = Object.entries(head.packages).filter(
    ([key, entry]) => key !== '' && JSON.stringify(base.packages[key]) !== JSON.stringify(entry)
  )
  const added = changed.filter(([key]) => !base.packages[key])

  const flag = (message, entries) => {
    if (entries.length > 0) {
      problems.push(`${message}: ${listNames(entries.map(([key]) => packageName(key)))}`)
    }
  }

  flag(
    'Packages resolved outside the npm registry',
    changed.filter(([, entry]) => entry.resolved !== undefined && !NPM_TARBALL.test(entry.resolved))
  )
  flag(
    'Packages without a resolved source',
    changed.filter(([, entry]) => entry.resolved === undefined && entry.inBundle !== true)
  )
  flag(
    'Packages without a sha512 integrity',
    changed.filter(
      ([, entry]) => entry.resolved !== undefined && !entry.integrity?.startsWith('sha512-')
    )
  )
  flag(
    'Packages that gain an install script',
    changed.filter(
      ([key, entry]) =>
        entry.hasInstallScript === true && base.packages[key]?.hasInstallScript !== true
    )
  )
  flag(
    'Version bumps beyond the allowed level (patch for direct dependencies, minor for the rest)',
    changed.filter(([key, entry]) => {
      const previous = base.packages[key]

      if (!previous || previous.version === entry.version) return false

      const bump = bumpOf(previous.version, entry.version)

      return directKeys.has(key) ? bump !== 'patch' : !['patch', 'minor'].includes(bump)
    })
  )

  if (added.length > MAX_NEW_PACKAGES) {
    problems.push(
      `package-lock.json adds ${added.length} new packages, the limit is ${MAX_NEW_PACKAGES}`
    )
  }

  return problems
}

const inspectManifests = ({ packageJson, lockfile }) => {
  const directKeys = new Set(
    DEPENDENCY_SECTIONS.flatMap(section => Object.keys(packageJson.head[section] ?? {})).map(
      name => `node_modules/${name}`
    )
  )

  return [...inspectPackageJson(packageJson), ...inspectLockfile(lockfile, directKeys)]
}

const inspectReviews = reviews => {
  const lastStateByReviewer = new Map()

  for (const review of reviews) {
    if (review.state !== 'COMMENTED') {
      lastStateByReviewer.set(review.user?.login ?? 'a deleted account', review.state)
    }
  }

  return [...lastStateByReviewer.entries()]
    .filter(([, state]) => state === 'CHANGES_REQUESTED')
    .map(([login]) => `${login} requested changes`)
}

const inspectWorkflows = workflowRuns =>
  REQUIRED_WORKFLOWS.reduce(
    (result, name) => {
      const latest = workflowRuns
        .filter(workflowRun => workflowRun.name === name)
        .sort((first, second) => second.run_number - first.run_number)[0]

      if (!latest) result.pending.push(`The "${name}" workflow has not started`)
      else if (latest.status !== 'completed')
        result.pending.push(`The "${name}" workflow is still running`)
      else if (latest.conclusion !== 'success')
        result.problems.push(`The "${name}" workflow ${latest.conclusion}`)

      return result
    },
    { problems: [], pending: [] }
  )

const inspectChecks = (checkRuns, combinedStatus) => {
  const problems = []
  const pending = []

  for (const checkRun of checkRuns) {
    if (checkRun.status !== 'completed')
      pending.push(`The check "${checkRun.name}" is still running`)
    else if (!GREEN_CONCLUSIONS.includes(checkRun.conclusion)) {
      problems.push(`The check "${checkRun.name}" ${checkRun.conclusion}`)
    }
  }

  for (const app of REQUIRED_CHECK_APPS) {
    if (!checkRuns.some(checkRun => checkRun.app?.slug === app)) {
      pending.push(`The "${app}" check has not reported yet`)
    }
  }

  if (!Number.isInteger(combinedStatus.total_count)) {
    problems.push('The commit statuses could not be read')
  } else if (combinedStatus.total_count > 0) {
    if (combinedStatus.state === 'pending') pending.push('A commit status is still pending')
    else if (combinedStatus.state !== 'success')
      problems.push(`The commit status is "${combinedStatus.state}"`)
  }

  return { problems, pending }
}

const evaluate = ({
  pr,
  sha,
  commits,
  files,
  reviews,
  workflowRuns,
  checkRuns,
  combinedStatus,
  manifests
}) => {
  const pullRequest = inspectPullRequest(pr, sha)
  const workflows = inspectWorkflows(workflowRuns)
  const checks = inspectChecks(checkRuns, combinedStatus)

  const problems = [
    ...pullRequest.problems,
    ...inspectCommits(commits),
    ...inspectFiles(files),
    ...(manifests ? inspectManifests(manifests) : ['The dependency files were not inspected']),
    ...inspectReviews(reviews),
    ...workflows.problems,
    ...checks.problems
  ]
  const pending = [...pullRequest.pending, ...workflows.pending, ...checks.pending]

  if (problems.length > 0) return { verdict: 'refuse', problems, pending }
  if (pending.length > 0) return { verdict: 'wait', problems, pending }

  return { verdict: 'merge', problems, pending }
}

const readJson = async ({ github, owner, repo }, path, ref) => {
  const { data: file } = await github.rest.repos.getContent({ owner, repo, path, ref })
  const blob = file.content
    ? file
    : (await github.rest.git.getBlob({ owner, repo, file_sha: file.sha })).data

  return JSON.parse(Buffer.from(blob.content, 'base64').toString('utf8'))
}

const loadManifests = async (target, { commits, files, sha }) => {
  const readable =
    commits.length === 1 &&
    commits[0].parents.length === 1 &&
    files.length > 0 &&
    files.every(file => MANIFESTS.includes(file.filename) && file.status === 'modified')

  if (!readable) return undefined

  const parent = commits[0].parents[0].sha
  const [packageBase, packageHead, lockBase, lockHead] = await Promise.all([
    readJson(target, 'package.json', parent),
    readJson(target, 'package.json', sha),
    readJson(target, 'package-lock.json', parent),
    readJson(target, 'package-lock.json', sha)
  ])

  return {
    packageJson: { base: packageBase, head: packageHead },
    lockfile: { base: lockBase, head: lockHead }
  }
}

const collect = async (target, cache) => {
  const { github, owner, repo, number, sha } = target
  const pull = { owner, repo, pull_number: number }
  const ref = { owner, repo, ref: sha }
  const [{ data: pr }, commits, files, reviews, workflowRuns, checkRuns, { data: combinedStatus }] =
    await Promise.all([
      github.rest.pulls.get(pull),
      github.paginate(github.rest.pulls.listCommits, pull),
      github.paginate(github.rest.pulls.listFiles, pull),
      github.paginate(github.rest.pulls.listReviews, pull),
      github.paginate(github.rest.actions.listWorkflowRunsForRepo, {
        owner,
        repo,
        head_sha: sha,
        event: 'pull_request',
        per_page: 100
      }),
      github.paginate(github.rest.checks.listForRef, { ...ref, per_page: 100 }),
      github.rest.repos.getCombinedStatusForRef(ref)
    ])

  cache.manifests ??= await loadManifests(target, { commits, files, sha })

  return {
    pr,
    sha,
    commits,
    files,
    reviews,
    workflowRuns,
    checkRuns,
    combinedStatus,
    manifests: cache.manifests
  }
}

const evaluateWhenSettled = async (target, { sleep, now }) => {
  const deadline = now() + MAX_WAIT_MS
  const cache = {}

  for (;;) {
    const snapshot = await collect(target, cache)
    const result = evaluate(snapshot)

    if (result.verdict !== 'wait' || now() >= deadline) return { result, snapshot }

    await sleep(POLL_INTERVAL_MS)
  }
}

const report = async (core, number, result) => {
  const headings = {
    merge: `Pull request #${number} passed every condition`,
    wait: `Pull request #${number} is not ready yet`,
    refuse: `Pull request #${number} is left for a manual review`
  }

  await core.summary
    .addHeading(headings[result.verdict], 3)
    .addList([...result.problems, ...result.pending])
    .write()
}

const approve = async ({ github, core, owner, repo, number, sha }, reviews) => {
  const approved = reviews.some(
    review =>
      review.state === 'APPROVED' &&
      review.user?.login === ACTIONS_BOT_LOGIN &&
      review.commit_id === sha
  )

  if (approved) return

  try {
    await github.rest.pulls.createReview({
      owner,
      repo,
      pull_number: number,
      commit_id: sha,
      event: 'APPROVE'
    })
  } catch (error) {
    core.warning(`The pull request was not approved: ${error.message}`)
  }
}

const isRetryable = status => status === 405 || status === 409 || status >= 500

const merge = async ({ github, core, owner, repo, number, sha }, { sleep }) => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await github.rest.pulls.merge({
        owner,
        repo,
        pull_number: number,
        sha,
        merge_method: 'squash'
      })
      return
    } catch (error) {
      const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: number })

      if (pr.merged) {
        core.notice(`Pull request #${number} was already merged`)
        return
      }

      if (attempt === MERGE_ATTEMPTS || !isRetryable(error.status)) throw error

      await sleep(MERGE_RETRY_DELAY_MS)
    }
  }
}

const findPullRequest = async ({ github, owner, repo }, workflowRun) => {
  const [attached] = workflowRun.pull_requests

  if (attached) return attached.number

  const { data: candidates } = await github.rest.pulls.list({
    owner,
    repo,
    state: 'open',
    head: `${workflowRun.head_repository.owner.login}:${workflowRun.head_branch}`
  })

  return candidates.find(candidate => candidate.head.sha === workflowRun.head_sha)?.number
}

const run = async ({ github, context, core }, { sleep = pause, now = Date.now } = {}) => {
  const { workflow_run: workflowRun } = context.payload
  const { owner, repo } = context.repo
  const number = await findPullRequest({ github, owner, repo }, workflowRun)

  if (!number) {
    core.notice('No open pull request matches the workflow run')
    return
  }

  const target = { github, core, owner, repo, number, sha: workflowRun.head_sha }
  const { result, snapshot } = await evaluateWhenSettled(target, { sleep, now })

  await report(core, number, result)

  if (result.verdict === 'merge') {
    await approve(target, snapshot.reviews)
    await merge(target, { sleep })
  }
}

module.exports = { run, evaluate }
