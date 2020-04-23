export default newVolume => {
  switch (newVolume.type) {
    case 'V3IO':
      return {
        name: newVolume.name,
        flexVolume: {
          driver: 'v3io/fuse',
          options: {
            accessKey: newVolume.accessKey,
            container: newVolume.typeName,
            subPath: newVolume.resourcesPath
          }
        }
      }
    case 'Config Map':
      return {
        name: newVolume.name,
        configMap: {
          name: newVolume.typeName
        }
      }
    case 'Secret':
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
