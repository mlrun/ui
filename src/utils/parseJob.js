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
import {
  JOB_KIND_JOB,
  JOB_KIND_PIPELINE,
  JOB_KIND_WORKFLOW,
  JOBS_PAGE,
  SCHEDULE_TAB
} from '../constants'
import getState from './getState'
import { parseKeyValues } from './object'
import { getJobIdentifier } from './getUniqueIdentifier'

export const jobHasWorkflowLabel = job => {
  return job.labels && 'job-type' in job.labels && job.labels['job-type'] === 'workflow-runner'
}

export const parseJob = (job, tab) => {
  let jobItem = null

  if (tab === SCHEDULE_TAB) {
    jobItem = {
      createdTime: new Date(job.creation_time),
      func: job.scheduled_object.task.spec.function,
      name: job.name,
      nextRun: new Date(job.next_run_time),
      lastRunUri: job.last_run_uri,
      project: job.project,
      scheduled_object: job.scheduled_object,
      startTime: new Date(job.last_run?.status?.start_time),
      state: getState(job.last_run?.status?.state, JOBS_PAGE, JOB_KIND_JOB),
      type:
        job.kind === JOB_KIND_PIPELINE || jobHasWorkflowLabel(job) ? JOB_KIND_WORKFLOW : job.kind,
      ui: {
        originalContent: job
      }
    }
  } else {
    let jobParameters = { ...job.spec?.parameters } || {}
    if ('context' in jobParameters && !jobParameters.context) delete jobParameters.context

    jobItem = {
      abortTaskId: job.status?.abort_task_id || '',
      artifacts: job.status.artifacts || [],
      error: job.status.error ?? '',
      function: job.spec?.function ?? '',
      handler: job.spec?.handler ?? '',
      hyper_param_options: job.spec?.hyper_param_options || {},
      hyperparams: job.spec?.hyperparams || {},
      inputs: job.spec?.inputs || {},
      iteration: job.metadata.iteration,
      iterationStats: job.status.iterations || [],
      iterations: [],
      labels: parseKeyValues(job.metadata.labels || {}),
      logLevel: job.spec?.log_level,
      name: job.metadata.name,
      outputPath: job.spec?.output_path,
      owner: job.metadata.labels?.owner,
      parameters: jobParameters,
      parametersChips: [
        ...parseKeyValues(jobParameters),
        ...parseKeyValues(job.spec?.hyperparams || {})
      ],
      project: job.metadata.project,
      reason: job.status?.reason ?? '',
      results: job.status?.results || {},
      resultsChips: parseKeyValues(job.status?.results || {}),
      startTime: new Date(job.status?.start_time),
      state: getState(job.status?.state, JOBS_PAGE, JOB_KIND_JOB),
      ui_run: job.status?.ui_url,
      uid: job.metadata.uid,
      updated: new Date(job.status?.last_update),
      ui: {}
    }
  }

  jobItem.ui = {
    originalContent: job,
    identifier: getJobIdentifier(jobItem),
    identifierUnique: getJobIdentifier(jobItem, true)
  }

  return jobItem
}
