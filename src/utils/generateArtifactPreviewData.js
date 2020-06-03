export const generateArtifactPreviewData = (extraData, schema) => {
  const previewItems = []
  let path = ''

  Object.values(extraData).forEach(dataItem => {
    if (dataItem.match(/html/)) {
      path = dataItem.replace(/^.*:\/\//, '')
    }

    if (dataItem.match(/json|yaml|png|jpg|jpeg|gif/)) {
      previewItems.push({
        schema: schema,
        path: dataItem.replace(/^.*:\/\//, '')
      })
    }
  })

  if (previewItems.length) {
    previewItems.push({
      schema: schema,
      path: path
    })
  }

  return {
    preview: previewItems,
    extraDataPath: path
  }
}
