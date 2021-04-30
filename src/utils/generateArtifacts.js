// import parseTargetPath from './parseTargetPath'
import { generateArtifactPreviewData } from './generateArtifactPreviewData'

import { maxBy, flatten } from 'lodash'

export const generateArtifacts = artifacts =>
  flatten(
    artifacts
      .map(artifact => {
        const { link_iteration } = artifact.link_iteration ?? {}
        let generatedArtifacts = artifact.link_iteration
          ? artifact.data.filter(dataItem => dataItem.iter === link_iteration)
          : [maxBy(artifact.data, 'updated')]

        if (generatedArtifacts.length > 0) {
          generatedArtifacts = generatedArtifacts.map(generatedArtifact => {
            let item = { ...generatedArtifact }

            // item.target_path = parseTargetPath(generatedArtifact.target_path)

            if (generatedArtifact.extra_data) {
              const generatedPreviewData = generateArtifactPreviewData(
                generatedArtifact.extra_data
              )

              item.preview = generatedPreviewData.preview
              //
              // @erann March 2, 2021
              // Not sure why we have this. Commenting out for now.

              if (generatedPreviewData.extraDataPath) {
                generatedArtifact.target_path =
                  generatedPreviewData.extraDataPath
              }

              // @erann March 2, 2021
              // Not sure why we have this. Commenting out for now.
              //
              // if (generatedPreviewData.extraDataPath) {
              //   generatedArtifact.target_path.path =
              //     generatedPreviewData.extraDataPath
              // }
            } else {
              item.preview ??= []
            }

            return item
          })
        }

        return generatedArtifacts
      })
      .filter(generatedArtifact => Boolean(generatedArtifact))
  )
