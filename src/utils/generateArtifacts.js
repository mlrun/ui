import parseTargetPath from './parseTargetPath'
import { generateArtifactPreviewData } from './generateArtifactPreviewData'

import { maxBy } from 'lodash'

export const generateArtifacts = artifacts =>
  artifacts
    .map(artifact => {
      const { link_iteration } = artifact.link_iteration ?? {}
      const generatedArtifact = artifact.link_iteration
        ? artifact.data.filter(dataItem => dataItem.iter === link_iteration)[0]
        : maxBy(artifact.data, 'updated')

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
