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

export const fetchArtifactPreviewFromExtraData = (artifact, noData, setNoData, setPreview) => {
  artifact.extra_data.forEach(previewItem => {
    fetchArtifactPreview(
      previewItem.path,
      previewItem.path.startsWith('/User') && (artifact.user || artifact.producer.owner),
      previewItem.path.replace(/.*\./g, '')
    )
      .then(content => {
        setPreview({ ...content, header: previewItem.header })

        if (noData) {
          setNoData(false)
        }
      })
      .catch(err => {
        setPreview({
          header: previewItem.header,
          error: {
            text: `${err.response.status} ${err.response.statusText}`,
            body: JSON.stringify(err.response, null, 2)
          },
          content: [],
          type: 'error'
        })
      })
  })
}

export const fetchArtifactPreviewFromTargetPath = (artifact, noData, setNoData, setPreview) => {
  fetchArtifactPreview(
    artifact.target_path,
    artifact.target_path.startsWith('/User') && (artifact.user || artifact.producer?.owner),
    artifact.target_path.replace(/.*\./g, '')
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

export const fetchArtifactPreview = (path, user, fileFormat) => {
  return api.getArtifactPreview(path, user, fileFormat).then(res => {
    return createArtifactPreviewContent(res, fileFormat)
  })
}

const handleSetArtifactPreviewObject = (previewContent, artifactIndex, setPreview) => {
  setPreview(state => {
    if (state[artifactIndex]) {
      return {
        ...state,
        [artifactIndex]: [...state[artifactIndex], previewContent]
      }
    } else {
      return {
        ...state,
        [artifactIndex]: Array.isArray(previewContent) ? previewContent : [previewContent]
      }
    }
  })
}

export const getArtifactPreview = (
  artifact,
  noData,
  setNoData,
  setPreview,
  previewIsObject = false,
  artifactIndex = null
) => {
  if (artifact.schema) {
    setArtifactPreviewFromSchema(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactIndex, setPreview)
        : setPreview(previewContent)
    )
  } else if (artifact.preview?.length > 0 && !artifact.target_path) {
    setArtifactPreviewFromPreviewData(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactIndex, setPreview)
        : setPreview(previewContent)
    )
  } else if ((artifact.preview?.length === 0 || !artifact.preview) && artifact.target_path) {
    fetchArtifactPreviewFromTargetPath(artifact, noData, setNoData, previewContent =>
      previewIsObject
        ? handleSetArtifactPreviewObject(previewContent, artifactIndex, setPreview)
        : setPreview(previewContent)
    )
  } else {
    setNoData(true)
  }
}
