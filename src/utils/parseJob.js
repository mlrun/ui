import { JOBS_PAGE, SCHEDULE_TAB } from '../constants'
import getState from './getState'
import { parseKeyValues } from './object'

export const parseJob = (job, tab) => {
  if (tab === SCHEDULE_TAB) {
    return {
      createdTime: new Date(job.creation_time),
      func: job.scheduled_object.task.spec.function,
      name: job.name,
      nextRun: new Date(job.next_run_time),
      lastRunUri: job.last_run_uri,
      project: job.project,
      scheduled_object: job.scheduled_object,
      start_time: new Date(job.last_run?.status.start_time),
      state: getState(job.last_run?.status.state, JOBS_PAGE, 'job'),
      type: job.kind === 'pipeline' ? 'workflow' : job.kind,
      ui: {
        originalContent: job
      }
    }
  } else {
    return {
      artifacts: job.status.artifacts || [],
      function: job?.spec?.function ?? '',
      handler: job.spec?.handler ?? '',
      hyperparams: job.spec?.hyperparams || {},
      inputs: job.spec.inputs || {},
      iteration: job.metadata.iteration,
      iterationStats: job.status.iterations || [],
      iterations: [],
      labels: parseKeyValues(job.metadata.labels || {}),
      logLevel: job.spec.log_level,
      name: job.metadata.name,
      outputPath: job.spec.output_path,
      owner: job.metadata.labels?.owner,
      parameters: parseKeyValues(job.spec.parameters || {}),
      project: job.metadata.project,
      results: job.status.results || {},
      resultsChips: parseKeyValues(job.status.results || {}),
      startTime: new Date(job.status.start_time),
      state: getState(job.status.state, JOBS_PAGE, 'job'),
      uid: job.metadata.uid,
      updated: new Date(job.status.last_update),
      ui: {
        originalContent: job
      }
    }
  }
}
