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
      scheduled_object: job.scheduled_object,
      start_time: new Date(job.last_run?.status.start_time),
      state: getState(job.last_run?.status.state, JOBS_PAGE, 'job'),
      type: job.kind === 'pipeline' ? 'workflow' : job.kind,
      project: job.project,
      ui: {
        originalContent: job
      }
    }
  } else {
    return {
      uid: job.metadata.uid,
      iteration: job.metadata.iteration,
      iterationStats: job.status.iterations || [],
      iterations: [],
      startTime: new Date(job.status.start_time),
      state: getState(job.status.state, JOBS_PAGE, 'job'),
      name: job.metadata.name,
      labels: parseKeyValues(job.metadata.labels || {}),
      logLevel: job.spec.log_level,
      inputs: job.spec.inputs || {},
      parameters: parseKeyValues(job.spec.parameters || {}),
      results: job.status.results || {},
      resultsChips: parseKeyValues(job.status.results || {}),
      artifacts: job.status.artifacts || [],
      outputPath: job.spec.output_path,
      owner: job.metadata.labels?.owner,
      updated: new Date(job.status.last_update),
      function: job?.spec?.function ?? '',
      project: job.metadata.project,
      hyperparams: job.spec?.hyperparams || {},
      ui: {
        originalContent: job
      }
    }
  }
}
