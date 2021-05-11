export const generateArtifactPreviewData = extraData => {
  const previewItems = []
  let path = ''

  Object.entries(extraData).forEach(([key, value]) => {
    if (value.match(/html/)) {
      path = value

      previewItems.push({
        path: value,
        header: key
      })
    }

    if (value.match(/json|yaml|png|jpg|jpeg|gif|csv/)) {
      previewItems.push({
        path: value,
        header: key
      })
    }
  })

  return {
    preview: previewItems,
    extraDataPath: path
  }
}
