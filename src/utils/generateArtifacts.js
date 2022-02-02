import { generateArtifactPreviewData } from './generateArtifactPreviewData'
import { maxBy, flatten } from 'lodash'

export const generateArtifacts = (artifacts, iter) => {
  return flatten(
    artifacts
      .map(artifact => {
        const { link_iteration } = artifact.link_iteration ?? {}
        let generatedArtifacts = iter
          ? artifact.data
          : artifact.link_iteration
          ? artifact.data.filter(dataItem => dataItem.iter === link_iteration)
          : [maxBy(artifact.data, 'updated')]

        if (generatedArtifacts.length > 0) {
          generatedArtifacts = generatedArtifacts.map(generatedArtifact => {
            let item = { ...generatedArtifact }

            if (generatedArtifact.extra_data) {
              const generatedPreviewData = generateArtifactPreviewData(
                generatedArtifact.extra_data
              )

              item.preview = generatedPreviewData.preview
            } else {
              item.preview ??= []
            }

            item.ui = {
              originalContent: generatedArtifact
            }

            return item
          })
        }

        return generatedArtifacts
      })
      .filter(generatedArtifact => Boolean(generatedArtifact))
  )
}
