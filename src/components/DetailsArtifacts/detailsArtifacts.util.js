import prettyBytes from 'pretty-bytes'

import { formatDatetime, parseKeyValues } from '../../utils'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

export const getJobAccordingIteration = selectedJob => {
  return {
    artifacts: selectedJob.status?.artifacts || [],
    startTime: new Date(selectedJob.status?.start_time),
    labels: parseKeyValues(selectedJob.metadata?.labels || {})
  }
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
      db_key: artifact.db_key ?? artifact.spec?.db_key,
      key: artifact.key ?? artifact.metadata?.key,
      kind: artifact.kind ?? artifact.spec?.kind,
      iter: artifact.iter ?? artifact.metadata?.iter,
      preview: generatedPreviewData.preview,
      size:
        artifact.size || artifact.spec?.size
          ? prettyBytes(artifact.size || artifact.spec?.size)
          : 'N/A',
      target_path: artifact.target_path ?? artifact.spec?.target_path,
      tag: artifact.tag ?? artifact.metadata?.tag,
      tree: artifact.tree ?? artifact.metadata?.tree,
      user: selectedJob?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        ?.replace(/(v3io_user|owner): /, '')
    }

    if (artifactSchema) {
      return {
        ...generatedArtifact,
        header: artifact.header || artifact.spec.header,
        preview: artifact.preview || artifact.status.preview,
        schema: artifactSchema
      }
    }

    return generatedArtifact
  })
}
