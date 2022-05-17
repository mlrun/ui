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
