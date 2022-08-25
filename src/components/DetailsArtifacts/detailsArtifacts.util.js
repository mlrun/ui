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
