import {
  CONFIG_MAP,
  SECRET,
  V3IO
} from '../elements/VolumesTable/volumesTable.util'

export const createNewVolume = newVolume => {
  switch (newVolume.type) {
    case V3IO:
      return {
        name: newVolume.name,
        flexVolume: {
          driver: 'v3io/fuse',
          options: {
            accessKey: newVolume.accessKey,
            container: newVolume.typeName,
            subPath: newVolume.subPath
          }
        }
      }
    case CONFIG_MAP:
      return {
        name: newVolume.name,
        configMap: {
          name: newVolume.typeName
        }
      }
    case SECRET:
      return {
        name: newVolume.name,
        secret: {
          secretName: newVolume.typeName
        }
      }
    default:
      return {
        name: newVolume.name,
        persistentVolumeClaim: {
          claimName: newVolume.typeName
        }
      }
  }
}
