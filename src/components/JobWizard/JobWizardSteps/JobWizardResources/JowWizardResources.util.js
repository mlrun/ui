import {
  CONFIG_MAP_VOLUME_TYPE,
  PVC_VOLUME_TYPE,
  SECRET_VOLUME_TYPE,
  V3IO_VOLUME_TYPE
} from '../../../../constants'

export const volumePreemptionModeOptions = [
  {
    id: 'allow',
    label: 'Allow'
  },
  {
    id: 'constrain',
    label: 'Constrain'
  },
  {
    id: 'prevent',
    label: 'Prevent'
  }
]

export const getVolumeType = volume => {
  if (volume.configMap) {
    return CONFIG_MAP_VOLUME_TYPE
  } else if (volume.persistentVolumeClaim) {
    return PVC_VOLUME_TYPE
  } else if (volume.secret) {
    return SECRET_VOLUME_TYPE
  } else {
    return V3IO_VOLUME_TYPE
  }
}
