import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const fetchPreviewFromAnalysis = (
  artifact,
  error,
  getArtifactPreview,
  noData,
  setError,
  setNoData,
  setPreview,
  setShowError
) => {
  Object.entries(artifact.analysis).forEach(([key, value]) => {
    getArtifactPreview(
      value.replace(/:\/\/.*$/g, '://'),
      value.replace(/.*:\/\//g, ''),
      artifact.user || artifact.producer?.owner,
      key
    )
      .then(content => {
        setPreview(prevState => [...prevState, { ...content, header: key }])

        if (!isEveryObjectValueEmpty(error)) {
          setError({
            text: '',
            body: ''
          })
          setShowError(false)
        }

        if (noData) {
          setNoData(false)
        }
      })
      .catch(err => {
        setPreview(state => [
          ...state,
          {
            header: key,
            error: {
              text: `${err.response?.status} ${err.response?.statusText}`,
              body: JSON.stringify(err.response, null, 2)
            },
            content: []
          }
        ])
      })
  })
}

export const setPreviewFromSchema = (
  artifact,
  error,
  noData,
  setError,
  setNoData,
  setPreview,
  setShowError
) => {
  if (!isEveryObjectValueEmpty(error)) {
    setError({
      text: '',
      body: ''
    })
    setShowError(false)
  }

  if (noData) {
    setNoData(false)
  }

  setPreview([
    {
      type: 'table',
      data: {
        headers: artifact.header,
        content: artifact.preview
      }
    }
  ])
}

export const setPreviewFromPreviewData = (
  artifact,
  error,
  noData,
  setError,
  setNoData,
  setPreview,
  setShowError
) => {
  if (!isEveryObjectValueEmpty(error)) {
    setError({
      text: '',
      body: ''
    })
    setShowError(false)
  }

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

export const fetchPreviewFromPreviewData = (
  artifact,
  error,
  getArtifactPreview,
  noData,
  setError,
  setNoData,
  setPreview,
  setShowError
) => {
  artifact.preview.forEach(previewItem => {
    getArtifactPreview(
      previewItem.schema,
      previewItem.path,
      artifact.user || artifact.producer.owner
    )
      .then(content => {
        setPreview(prevState => [
          ...prevState,
          { ...content, header: previewItem.header }
        ])

        if (!isEveryObjectValueEmpty(error)) {
          setError({
            text: '',
            body: ''
          })
          setShowError(false)
        }

        if (noData) {
          setNoData(false)
        }
      })
      .catch(err => {
        setPreview(state => [
          ...state,
          {
            header: previewItem.header,
            error: {
              text: `${err.response.status} ${err.response.statusText}`,
              body: JSON.stringify(err.response, null, 2)
            },
            content: []
          }
        ])
      })
  })
}

export const fetchPreviewFromTargetPath = (
  artifact,
  error,
  getArtifactPreview,
  noData,
  setError,
  setNoData,
  setPreview,
  setShowError
) => {
  getArtifactPreview(
    artifact.target_path?.schema,
    artifact.target_path?.path,
    artifact.user || artifact.producer?.owner
  )
    .then(content => {
      setPreview([content])

      if (!isEveryObjectValueEmpty(error)) {
        setError({
          text: '',
          body: ''
        })
        setShowError(false)
      }

      if (noData) {
        setNoData(false)
      }
    })
    .catch(err => {
      setError({
        text: `${err.response.status} ${err.response.statusText}`,
        body: JSON.stringify(err.response, null, 2)
      })
    })
}
