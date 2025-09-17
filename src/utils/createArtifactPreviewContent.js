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
import { has, isString } from 'lodash'

import { UNKNOWN_STATE } from '../constants'

const splitStringToArray = str => {
  return str.split(/,(?! )/g)
}

export const createArtifactPreviewContent = (
  res,
  fileFormat,
  path,
  artifactName,
  isPreviewTruncated = false
) => {
  const artifact = {}

  if (res?.headers['content-type'].includes('text/csv') && isString(res?.data)) {
    const data = res.data.split('\n')

    if (data[0].includes('state')) {
      const headers = data[0].split(',')
      let content = data.slice(1)

      content.pop()
      content = content.map(item => splitStringToArray(item))

      artifact.type = 'table-results'
      artifact.iterationStats = [headers].concat(content)
    } else {
      let content = data.slice(1)

      content = content.map(item => splitStringToArray(item))
      content.pop()
      artifact.type = 'table'
      artifact.data = {
        headers: data[0].split(','),
        content: content
      }
    }
  } else if (fileFormat === 'yaml' || fileFormat === 'yml') {
    artifact.type = 'yaml'
    artifact.data = {
      content: res.data
    }
  } else if (
    res?.headers['content-type'].includes('text/plain') ||
    (res?.headers['content-type'].includes('application/octet-stream') && isString(res?.data))
  ) {
    artifact.type = 'text'
    artifact.data = {
      content: String(res.data)
    }
  } else if (res?.headers['content-type'].includes('text/html')) {
    artifact.type = 'html'
    artifact.data = {
      content: URL.createObjectURL(res.data)
    }
  } else if (res?.headers['content-type'].includes('application/json')) {
    artifact.type = 'json'
    artifact.data = {
      content: JSON.stringify(res.data, null, 2)
    }
    artifact.hidden = has(res.data, 'listdir')
  } else if (res?.headers['content-type'].includes('image')) {
    artifact.type = 'image'
    artifact.data = {
      content: URL.createObjectURL(res.data)
    }
  } else {
    artifact.type = UNKNOWN_STATE

    if (path && artifactName) {
      artifact.data = {
        content: `Preview is not available for this artifact type. Go to ${path} to retrieve the data, or use mlrun api/sdk project.get_artifact('${artifactName}').to_dataitem().get()`
      }
    }
  }

  if (isPreviewTruncated) artifact.warningMsg = 'The preview is truncated due to the file size'

  return artifact
}
