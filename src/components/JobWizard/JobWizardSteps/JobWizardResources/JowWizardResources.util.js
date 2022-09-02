import { CONFIG_MAP, PVC, SECRET, V3IO } from '../../../../elements/VolumesTable/volumesTable.util'

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
    return CONFIG_MAP
  } else if (volume.persistentVolumeClaim) {
    return PVC
  } else if (volume.secret) {
    return SECRET
  } else {
    return V3IO
  }
}
