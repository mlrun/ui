import prettyBytes from 'pretty-bytes'

import { formatDatetime, parseKeyValues } from '../../utils'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

export const getJobAccordingIteration = (
  iteration,
  allJobsData,
  selectedItem
) => {
  const selectedJob =
    allJobsData.find(
      job =>
        job.metadata.uid === selectedItem.uid &&
        job.metadata.iteration === +iteration
    ) || {}
  selectedJob.artifacts = selectedJob.status?.artifacts || []
  selectedJob.startTime = formatDatetime(
    new Date(selectedJob.status?.start_time)
  )
  selectedJob.labels = parseKeyValues(selectedJob.metadata?.labels || {})

  return selectedJob
}

export const generateContent = selectedJob => {
  return selectedJob.artifacts.map(artifact => {
    let generatedPreviewData = {
      preview: []
    }

    if (artifact.extra_data) {
      generatedPreviewData = generateArtifactPreviewData(artifact.extra_data)
    }

    const generatedArtifact = {
      date: formatDatetime(selectedJob.startTime),
      key: artifact.key,
      kind: artifact.kind,
      db_key: artifact.db_key,
      preview: generatedPreviewData.preview,
      size: artifact.size ? prettyBytes(artifact.size) : 'N/A',
      target_path: artifact.target_path,
      tree: artifact.tree,
      user: selectedJob?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        ?.replace(/(v3io_user|owner): /, '')
    }

    if (artifact.schema) {
      return {
        ...generatedArtifact,
        header: artifact.header,
        preview: artifact.preview,
        schema: artifact.schema
      }
    }

    return generatedArtifact
  })
}
