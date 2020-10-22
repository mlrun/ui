import parseTargetPath from './parseTargetPath'
import { generateArtifactPreviewData } from './generateArtifactPreviewData'

export const generateArtifacts = artifacts =>
  artifacts
    .map(artifact => {
      let generatedArtifact = null

      if (artifact.link_iteration) {
        let { link_iteration } = artifact.link_iteration

        generatedArtifact = artifact.data.filter(
          dataItem => dataItem.iter === link_iteration
        )[0]
      } else {
        generatedArtifact = artifact.data[0]
      }

      if (generatedArtifact) {
        generatedArtifact.target_path = parseTargetPath(
          generatedArtifact.target_path
        )

        if (generatedArtifact.extra_data) {
          const generatedPreviewData = generateArtifactPreviewData(
            generatedArtifact.extra_data,
            generatedArtifact.target_path.schema
          )

          generatedArtifact.preview = generatedPreviewData.preview

          if (generatedPreviewData.extraDataPath) {
            generatedArtifact.target_path.path =
              generatedPreviewData.extraDataPath
          }
        } else {
          generatedArtifact.preview = generatedArtifact.preview ?? []
        }
      }

      return generatedArtifact
    })
    .filter(generatedArtifact => !!generatedArtifact)
