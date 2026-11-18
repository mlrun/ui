/*
Copyright 2019 Iguazio Systems Ltd.

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
// Defect injection: `MOCK_DEFECT=<name>` makes the mock server break one thing on purpose, as a broken backend or a
// broken app would show it. The scenarios of the defect must fail: a scenario that still passes doesn't check what it
// claims to (a false pass). `npm run test:defects` (scripts/testDefects.js) runs every defect with its scenarios.
// The regression never sets MOCK_DEFECT

export const DEFECTS = {
  // not a duplicated source: the UI keeps the sources by name (ArtifactInfoSources), a duplicate is not shown
  'dataset-source-missing': {
    description: 'the "test-regressor_cox-test-summary" dataset lost its second source (test_set)',
    scenarios: ['MLD003'],
    data: ({ artifacts }) =>
      artifacts.artifacts
        .filter(
          artifact =>
            artifact.metadata?.project === 'churn-project-admin' &&
            artifact.metadata?.key === 'cox-test-summary'
        )
        .forEach(artifact => artifact.spec.sources.splice(1))
  },
  'datasets-counter-wrong': {
    description: 'the "default" project summary has one dataset more',
    scenarios: ['MLPr021'],
    data: ({ projectsSummary }) => summaryOf(projectsSummary, 'default').datasets_count++
  },
  'alerts-counter-wrong': {
    description: 'the "default" project summary has one endpoint alert more',
    scenarios: ['MLPr020'],
    data: ({ projectsSummary }) => summaryOf(projectsSummary, 'default').endpoint_alerts_count++
  },
  'schedule-label-wrong': {
    description:
      'a "churn-project-admin" schedule has "v3io_user=root" instead of "v3io_user=admin"',
    scenarios: ['MLJW010'],
    // the shown labels (`scheduled_object.task.metadata.labels`, src/utils/parseJob.js), not `labels` (the mock filters
    // by them only)
    data: ({ schedules }) => {
      const labels = schedules.schedules.find(
        item => item.project === 'churn-project-admin' && item.name === 'clean-data'
      )?.scheduled_object.task.metadata.labels

      if (labels?.v3io_user !== 'admin') throw new Error('schedule-label-wrong: no label to break')

      labels.v3io_user = 'root'
    }
  },
  'functions-name-filter-ignored': {
    description: 'the functions list ignores the name filter',
    scenarios: ['MLF006']
  },
  'runs-status-filter-ignored': {
    description: 'the runs list ignores the status filter',
    scenarios: ['MLJW011']
  },
  'function-deletion-fails': {
    description: 'the function deletion task fails',
    scenarios: ['MLF017', 'MLJW030']
  },
  'run-abort-never-ends': {
    description: 'the run abort task never ends',
    scenarios: ['MLJW049']
  }
}

const summaryOf = (projectsSummary, name) => {
  const summary = projectsSummary.project_summaries.find(item => item.name === name)

  if (!summary) throw new Error(`no "${name}" project summary`)

  return summary
}

export const mockDefect = process.env.MOCK_DEFECT || ''

if (mockDefect && !DEFECTS[mockDefect]) {
  throw new Error(
    `MOCK_DEFECT="${mockDefect}" is not supported: ${Object.keys(DEFECTS).join(', ')}`
  )
}

if (mockDefect) {
  console.log(`Defect injection: ${mockDefect} - ${DEFECTS[mockDefect].description}`)
}

// the defects of the data: called once the data is loaded
export const applyDataDefect = data => DEFECTS[mockDefect]?.data?.(data)

// the defects of the handlers: checked where the handler does the broken thing
export const hasDefect = name => mockDefect === name
