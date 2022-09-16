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
import { chain } from 'lodash'
import { getVolumeType } from '../../utils/panelResources.util'
import { PANEL_EDIT_MODE } from '../../constants'

export const getDefaultVolumeMounts = (volume_mounts, volumes, mode) =>
  chain(volume_mounts)
    .flatten()
    .unionBy('name')
    .map(volumeMount => ({
      isDefault: true,
      data: {
        type: getVolumeType(
          volumes.find(volume => volume.name === volumeMount.name)
        ),
        name: volumeMount.name,
        mountPath: volumeMount.mountPath
      },
      canBeModified: mode === PANEL_EDIT_MODE
    }))
    .value()

export const VOLUME_MOUNT_AUTO_TYPE = 'auto'
export const VOLUME_MOUNT_MANUAL_TYPE = 'manual'
export const VOLUME_MOUNT_NONE_TYPE = 'none'

export const volumeMountOptions = [
  { label: 'Auto', id: VOLUME_MOUNT_AUTO_TYPE },
  { label: 'Manual', id: VOLUME_MOUNT_MANUAL_TYPE },
  { label: 'None', id: VOLUME_MOUNT_NONE_TYPE }
]
