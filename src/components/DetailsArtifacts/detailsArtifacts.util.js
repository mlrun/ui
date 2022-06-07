import prettyBytes from 'pretty-bytes'

import { formatDatetime, parseKeyValues } from '../../utils'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

export const getJobAccordingIteration = (iteration, allJobsData, selectedItem) => {
  const selectedJob =
    allJobsData.find(
      job => job.metadata.uid === selectedItem.uid && job.metadata.iteration === +iteration
    ) || {}
  selectedJob.artifacts = selectedJob.status?.artifacts || []
  selectedJob.startTime = formatDatetime(new Date(selectedJob.status?.start_time))
  selectedJob.labels = parseKeyValues(selectedJob.metadata?.labels || {})

  return selectedJob
}

export const generateContent = selectedJob => {
  return selectedJob.artifacts.map(artifact => {
    const artifactExtraData = artifact.extra_data || artifact.spec?.extra_data
    const artifactSchema = artifact.schema || artifact.spec?.schema
    let generatedPreviewData = {
      preview: []
    }

    if (artifactExtraData) {
      generatedPreviewData = generateArtifactPreviewData(artifactExtraData)
    }

    const generatedArtifact = {
      date: formatDatetime(selectedJob.startTime),
      key: artifact.key ?? artifact.metadata.key,
      kind: artifact.kind ?? artifact.spec.kind,
      db_key: artifact.db_key ?? artifact.spec.db_key,
      preview: generatedPreviewData.preview,
      size:
        artifact.size || artifact.spec.size
          ? prettyBytes(artifact.size || artifact.spec.size)
          : 'N/A',
      target_path: artifact.target_path ?? artifact.spec.target_path,
      tree: artifact.tree ?? artifact.metadata.tree,
      user: selectedJob?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        ?.replace(/(v3io_user|owner): /, '')
    }

    if (artifactSchema) {
      return {
        ...generatedArtifact,
        header: artifact.header || artifact.spec.header,
        preview: artifact.preview || artifact.spec.preview,
        schema: artifactSchema
      }
    }

    return generatedArtifact
  })
}
