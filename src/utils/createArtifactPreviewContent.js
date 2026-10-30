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
import { has, isString } from 'lodash-es'

import { UNKNOWN_STATE } from '../constants'
import { commonLanguages } from '../common/Editor/editor.util'

const splitStringToArray = str => {
  return str.split(/,(?! )/g)
}

export const createArtifactPreviewContent = (
  res,
  fileFormat,
  path,
  artifactName,
  isPreviewTruncated = false,
  artifact
) => {
  const previewContent = {
    artifact
  }

  if (res?.headers['content-type'].includes('text/csv') && isString(res?.data)) {
    const data = res.data.split('\n')

    if (data[0].includes('state')) {
      const headers = data[0].split(',')
      let content = data.slice(1)

      content.pop()
      content = content.map(item => splitStringToArray(item))

      previewContent.type = 'table-results'
      previewContent.iterationStats = [headers].concat(content)
    } else {
      let content = data.slice(1)

      content = content.map(item => splitStringToArray(item))
      content.pop()
      previewContent.type = 'table'
      previewContent.data = {
        headers: data[0].split(','),
        content: content
      }
    }
  } else if (fileFormat === 'yaml' || fileFormat === 'yml') {
    previewContent.type = 'yaml'
    previewContent.data = {
      content: res.data
    }
  } else if (artifact?.kind === 'code' || Object.hasOwn(commonLanguages, fileFormat)) {
    previewContent.type = 'code'
    previewContent.hidePopupBtn = true
    previewContent.data = {
      content: res.data,
      fileFormat
    }
  } else if (
    res?.headers['content-type'].includes('text/plain') ||
    (res?.headers['content-type'].includes('application/octet-stream') && isString(res?.data))
  ) {
    previewContent.type = 'text'
    previewContent.data = {
      content: String(res.data)
    }
  } else if (res?.headers['content-type'].includes('text/html')) {
    previewContent.type = 'html'
    previewContent.data = {
      content: URL.createObjectURL(res.data)
    }
  } else if (res?.headers['content-type'].includes('application/json')) {
    previewContent.type = 'json'
    previewContent.data = {
      content: JSON.stringify(res.data, null, 2)
    }
    previewContent.hidden = has(res.data, 'listdir')
  } else if (res?.headers['content-type'].includes('image')) {
    previewContent.type = 'image'
    previewContent.data = {
      content: URL.createObjectURL(res.data)
    }
  } else {
    previewContent.type = UNKNOWN_STATE

    if (path && artifactName) {
      previewContent.data = {
        content: `Preview is not available for this artifact type. Go to ${path} to retrieve the data, or use mlrun api/sdk project.get_artifact('${artifactName}').to_dataitem().get()`
      }
    }
  }

  if (isPreviewTruncated)
    previewContent.warningMsg = 'The preview is truncated due to the file size'

  return previewContent
}
