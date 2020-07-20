import { toPairs } from 'lodash'

export const generateArtifactPreviewData = (extraData, schema) => {
  const previewItems = []
  let path = ''

  toPairs(extraData).forEach(dataItem => {
    if (dataItem[1].match(/html/)) {
      path = dataItem[1].replace(/^.*:\/\//, '')

      previewItems.push({
        schema: schema,
        path: dataItem[1].replace(/^.*:\/\//, ''),
        header: dataItem[0]
      })
    }

    if (dataItem[1].match(/json|yaml|png|jpg|jpeg|gif|csv/)) {
      previewItems.push({
        schema: schema,
        path: dataItem[1].replace(/^.*:\/\//, ''),
        header: dataItem[0]
      })
    }
  })

  return {
    preview: previewItems,
    extraDataPath: path
  }
}
