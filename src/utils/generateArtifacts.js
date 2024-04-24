/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { flatten, isEmpty } from 'lodash'

import { generateArtifactPreviewData } from './generateArtifactPreviewData'
import { generateUri } from './resources'
import { TAG_LATEST } from '../constants'

export const generateArtifacts = (artifacts, tab, originalContent) => {
  return flatten(
    artifacts
      .map(artifact => {
        let generatedArtifacts = []

        if (artifact.data.length > 0) {
          generatedArtifacts = artifact.data.map(generatedArtifact => {
            let item = { ...generatedArtifact }

            if (item.producer && !item.producer.name) {
              item.producer.name =
                item.producer.kind.toLowerCase() === 'api'
                  ? 'UI'
                  : item.producer.kind.toLowerCase() === 'project'
                    ? 'MLrun client'
                    : ''
            }

            if (generatedArtifact.extra_data) {
              const generatedPreviewData = generateArtifactPreviewData(generatedArtifact.extra_data)

              item.extra_data = generatedPreviewData.preview
            } else {
              item.extra_data ??= []
            }

            item.producer.uid = item.tree

            if (!generatedArtifact.ui) {
              item.ui = {
                originalContent
              }
            }

            item.URI = generateUri(item, tab)

            item.labels = isEmpty(generatedArtifact.labels) ? [] : generatedArtifact.labels

            if (item.feature_vector) {
              const [, tag] = item.feature_vector
                .slice(item.feature_vector.lastIndexOf('/') + 1)
                .split(':')

              if (!tag) {
                item.feature_vector += `:${TAG_LATEST}`
              }
            }

            return item
          })
        }

        return generatedArtifacts
      })
      .filter(generatedArtifact => Boolean(generatedArtifact))
  )
}
