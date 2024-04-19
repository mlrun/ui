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
import { capitalize } from 'lodash'
import { deleteArtifact } from '../reducers/artifactsReducer'
import { deleteArtifacts } from '../reducers/artifactsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { showErrorNotification } from './notifications.util'

export const handleDeleteArtifact = (
  dispatch,
  project,
  key,
  tag,
  tree,
  refreshArtifacts,
  filters,
  artifactType,
  category,
  isDeleteAll
) => {
  dispatch(
    isDeleteAll
      ? deleteArtifacts({ project, name: key, category })
      : deleteArtifact({ project, key, tag, tree })
  )
    .unwrap()
    .then(() => {
      refreshArtifacts(filters)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: `${capitalize(artifactType)} is successfully deleted`
        })
      )
    })
    .catch(error => {
      showErrorNotification(dispatch, error, `Deleting ${artifactType} failed`, '', () =>
        handleDeleteArtifact(
          dispatch,
          project,
          key,
          tag,
          tree,
          refreshArtifacts,
          filters,
          artifactType,
          category,
          isDeleteAll
        )
      )
    })
}
