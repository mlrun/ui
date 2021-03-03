export const generateArtifactPreviewData = (extraData, schema) => {
  const previewItems = []
  let path = ''

  Object.entries(extraData).forEach(([key, value]) => {
    if (value.match(/html/)) {
      path = value.replace(/^.*:\/\//, '')

      previewItems.push({
        schema: schema,
        path: value.replace(/^.*:\/\//, ''),
        header: key
      })
    }

    if (value.match(/json|yaml|png|jpg|jpeg|gif|csv/)) {
      previewItems.push({
        schema: schema,
        path: value.replace(/^.*:\/\//, ''),
        header: key
      })
    }
  })

  return {
    preview: previewItems,
    extraDataPath: path
  }
}
