import { chain } from 'lodash'
import { getVolumeType } from '../../utils/panelResources.util'

export const getDefaultVolumeMounts = (volume_mounts, volumes) =>
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
      }
    }))
    .value()

export const getDefaultMemoryUnit = (limits, requests) => {
  if (limits.memory?.match(/[a-zA-Z]/)) {
    return `${limits.memory.replace(/\d+/g, '')}B`
  } else if (requests.memory?.match(/[a-zA-Z]/)) {
    return `${requests.memory.replace(/\d+/g, '')}B`
  } else if (limits.memory?.length > 0 || requests.memory?.length > 0) {
    return 'Bytes'
  } else return null
}

export const getDefaultCpuUnit = (limits, requests) => {
  if (limits.cpu?.match?.(/m/) || requests.cpu?.match?.(/m/)) {
    return 'millicpu'
  } else if (limits.cpu?.length > 0 || requests.cpu?.length > 0) {
    return 'cpu'
  } else return null
}
