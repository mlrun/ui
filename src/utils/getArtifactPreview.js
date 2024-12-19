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
import { TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import CopyToClipboard from '../common/CopyToClipboard/CopyToClipboard'
import Download from '../common/Download/Download'

import api from '../api/artifacts-api'
import { createArtifactPreviewContent } from './createArtifactPreviewContent'
import { ARTIFACT_MAX_CHUNK_SIZE, DEFAULT_ABORT_MSG, REQUEST_CANCELED } from '../constants'

const fileSizes = {
  '100KB': 102400,
  '10MB': 10485760,
  '1MB': 1048576
}
const limitsByFormat = (fileFormat, maxSizeLimit) => {
  const limits = {
    csv: Infinity,
    html: maxSizeLimit ?? fileSizes['10MB'],
    jpeg: maxSizeLimit ?? fileSizes['10MB'],
    jpg: maxSizeLimit ?? fileSizes['10MB'],
    json: fileSizes['100KB'],
    png: maxSizeLimit ?? fileSizes['10MB'],
    sql: Infinity,
    txt: Infinity,
    yaml: Infinity,
    yml: Infinity
  }

  return limits[fileFormat]
}

const supportedFormats = ['csv', 'html', 'jpeg', 'jpg', 'json', 'png', 'txt', 'yaml', 'yml']

export const setArtifactPreviewFromSchema = (artifact, noData, setNoData, setPreview) => {
  if (noData) {
    setNoData(false)
  }

  setPreview([
    {
      type: 'table',
      data: {
        headers: artifact.header ?? artifact.preview[0],
        content: artifact.header ? artifact.preview : artifact.preview.slice(1)
      }
    }
  ])
}

export const setArtifactPreviewFromPreviewData = (artifact, noData, setNoData, setPreview) => {
  if (noData) {
    setNoData(false)
  }

  setPreview([
    {
      type: 'table',
      data: {
        headers: artifact.preview[0],
        content: artifact.preview.slice(1)
      }
    }
  ])
}

export const generateExtraDataContent = (extraData, showArtifactPreview, projectName) => {
  return extraData.map(extraDataItem => {
    return [
      {
        headerId: 'name',
        headerLabel: 'Name',
        template: (
          <Tooltip template={<TextTooltipTemplate text={extraDataItem.header} />}>
            <span className="link" onClick={() => showArtifactPreview(extraDataItem.id)}>
              {extraDataItem.header}
            </span>
          </Tooltip>
        ),
        value: extraDataItem.header,
        className: 'table-cell-3',
        extraDataItem
      },
      {
        headerId: 'path',
        headerLabel: 'Path',
        value: extraDataItem.path,
        className: 'table-cell-6'
      },
      {
        headerId: 'actions',
        headerLabel: '',
        className: 'actions-cell',
        template: (
          <>
            <CopyToClipboard textToCopy={extraDataItem.path} tooltipText="Copy path" />
            <Download
              className="icon-download"
              onlyIcon
              path={extraDataItem.path}
              projectName={projectName}
              //TODO: add user after BE part will be done
              // user={artifact.ui.user}
            />
          </>
        )
      }
    ]
  })
}

export const fetchArtifactPreviewFromPath = async (
  projectName,
  artifact,
  path,
  noData,
  setNoData,
  setPreview,
  artifactLimits = {},
  signal
) => {
  const user = path.startsWith('/User') && (artifact.user || artifact.producer?.owner)
  const fileFormat = path.replace(/.*\./g, '')
  let fileSize = artifact.size

  try {
    if (!fileSize) {
      const { data: fileStats } = await api.getArtifactPreviewStats(projectName, path, user, signal)

      fileSize = fileStats.size
    }

    if (supportedFormats.includes(fileFormat)) {
      if (
        fileFormat &&
        fileFormat !== path &&
        ((limitsByFormat(fileFormat, artifactLimits?.max_preview_size) &&
          fileSize > limitsByFormat(fileFormat, artifactLimits?.max_preview_size)) ||
          (!limitsByFormat(fileFormat, artifactLimits?.max_preview_size) &&
            fileSize > fileSizes['1MB']))
      ) {
        setPreview([
          {
            data: {
              content: `The artifact is too large to ${
                fileSize > artifactLimits.max_download_size
                  ? `download. Go to ${path} to retrieve the data, or use mlrun api/sdk project.get_artifact('${artifact.db_key || artifact.name}').to_dataitem().get()`
                  : 'preview, use the download option instead'
              }`
            },
            type: 'unknown'
          }
        ])
      } else {
        const content = await fetchArtifactPreview(
          projectName,
          path,
          user,
          fileFormat,
          artifact.db_key,
          { fileSize, ...artifactLimits },
          signal
        )
        setPreview([content])

        if (noData) {
          setNoData(false)
        }
      }
    } else {
      return setPreview([createArtifactPreviewContent(null, null, path, artifact.db_key)])
    }
  } catch (err) {
    if (![REQUEST_CANCELED, DEFAULT_ABORT_MSG].includes(err.message)) {
      setPreview([
        {
          error: {
            text: err.response ? `${err.response.status} ${err.response.statusText}` : err.message,
            body: err.response ? JSON.stringify(err.response, null, 2) : ''
          },
          content: [],
          type: 'error'
        }
      ])
    }
  }
}

export const fetchArtifactPreview = async (
  projectName,
  path,
  user,
  fileFormat,
  artifactName,
  sizeConfigs = {},
  signal
) => {
  const defaultSizeLimit = fileSizes['100KB']
  const config = {
    params: { path, size: defaultSizeLimit }
  }

  if (user) {
    config.params.user = user
  }

  if (signal) {
    config.signal = signal
  }

  if (['png', 'jpg', 'jpeg', 'html'].includes(fileFormat)) {
    const chunkSize = sizeConfigs.max_chunk_size ?? ARTIFACT_MAX_CHUNK_SIZE
    let fullFile = new Blob()
    let response = {}
    config.responseType = 'blob'
    config.params.size = chunkSize
    config.params.offset = 0

    while (config.params.offset < sizeConfigs.fileSize) {
      if (signal) {
        config.signal = signal
      }

      response = await api.getArtifactPreview(projectName, config)

      if (response?.data) {
        fullFile = new Blob([fullFile, response.data], { type: response.data.type })
      } else {
        throw new Error('Error during loading the preview file')
      }

      config.params.offset += chunkSize
    }

    response.data = fullFile

    return createArtifactPreviewContent(response, fileFormat, path, artifactName)
  }

  return api.getArtifactPreview(projectName, config).then(response => {
    return createArtifactPreviewContent(
      response,
      fileFormat,
      path,
      artifactName,
      sizeConfigs.fileSize > defaultSizeLimit
    )
  })
}

const handleSetArtifactPreviewObject = (previewContent, artifactId, setPreview) => {
  setPreview(state => {
    if (state[artifactId]) {
      return {
        ...state,
        [artifactId]: [...state[artifactId], previewContent]
      }
    } else {
      return {
        ...state,
        [artifactId]: Array.isArray(previewContent) ? previewContent : [previewContent]
      }
    }
  })
}

export const getArtifactPreview = (
  projectName,
  artifact,
  noData,
  setNoData,
  setPreview,
  previewIsObject = false,
  artifactId = null,
  artifactLimits = {},
  signal
) => {
  if (artifact.schema) {
    setArtifactPreviewFromSchema(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactId, setPreview)
        : setPreview(previewContent)
    )
  } else if (artifact.target_path) {
    fetchArtifactPreviewFromPath(
      projectName,
      artifact,
      artifact.target_path,
      noData,
      setNoData,
      previewContent =>
        previewIsObject
          ? handleSetArtifactPreviewObject(previewContent, artifactId, setPreview)
          : setPreview(previewContent),
      artifactLimits,
      signal
    )
  } else if (artifact.preview?.length > 0) {
    setArtifactPreviewFromPreviewData(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactId, setPreview)
        : setPreview(previewContent)
    )
  } else {
    setNoData(true)
  }
}
