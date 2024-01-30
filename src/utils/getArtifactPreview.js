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

export const fetchArtifactPreviewFromExtraData = (
  projectName,
  artifact,
  noData,
  setNoData,
  setPreview,
  signal
) => {
  artifact.extra_data.forEach(previewItem => {
    fetchArtifactPreview(
      projectName,
      previewItem.path,
      previewItem.path.startsWith('/User') && (artifact.ui.user || artifact.producer.owner),
      previewItem.path.replace(/.*\./g, ''),
      artifact.db_key,
      signal
    )
      .then(content => {
        setPreview({ ...content, header: previewItem.header })

        if (noData) {
          setNoData(false)
        }
      })
      .catch(err => {
        if (err.response) {
          setPreview({
            header: previewItem.header,
            error: {
              text: `${err.response.status} ${err.response.statusText}`,
              body: JSON.stringify(err.response, null, 2)
            },
            content: [],
            type: 'error'
          })
        }
      })
  })
}

export const generateExtraDataContent = (extraData, showArtifactPreview) => {
  return extraData.map((extraDataItem, index) => {
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
              //TODO: add user after BE part will be done
              // user={artifact.ui.user}
            />
          </>
        )
      }
    ]
  })
}

export const fetchArtifactPreviewFromTargetPath = (
  projectName,
  artifact,
  noData,
  setNoData,
  setPreview
) => {
  fetchArtifactPreview(
    projectName,
    artifact.target_path,
    artifact.target_path.startsWith('/User') && (artifact.user || artifact.producer?.owner),
    artifact.target_path.replace(/.*\./g, ''),
    artifact.db_key
  )
    .then(content => {
      setPreview([content])

      if (noData) {
        setNoData(false)
      }
    })
    .catch(err => {
      setPreview([
        {
          error: {
            text: `${err.response.status} ${err.response.statusText}`,
            body: JSON.stringify(err.response, null, 2)
          },
          content: [],
          type: 'error'
        }
      ])
    })
}

export const fetchArtifactPreview = (
  projectName,
  path,
  user,
  fileFormat,
  artifactName,
  signal
) => {
  return api.getArtifactPreview(projectName, path, user, fileFormat, signal).then(res => {
    return createArtifactPreviewContent(res, fileFormat, path, artifactName)
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
  artifactId = null
) => {
  if (artifact.schema) {
    setArtifactPreviewFromSchema(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactId, setPreview)
        : setPreview(previewContent)
    )
  } else if (artifact.target_path) {
    fetchArtifactPreviewFromTargetPath(projectName, artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactId, setPreview)
        : setPreview(previewContent)
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
