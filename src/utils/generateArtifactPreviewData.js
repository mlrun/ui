export const generateArtifactPreviewData = extraData => {
  const previewItems = []

  Object.entries(extraData).forEach(([key, value]) => {
    if (value.match(/html|json|yaml|png|jpg|jpeg|gif|csv/)) {
      previewItems.push({
        path: value,
        header: key
      })
    }
  })

  return {
    preview: previewItems
  }
}
