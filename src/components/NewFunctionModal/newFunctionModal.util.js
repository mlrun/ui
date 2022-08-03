import { chain } from 'lodash'
import { getVolumeType } from '../../utils/panelResources.util'

import { FUNCTION_TYPE_JOB, PANEL_EDIT_MODE } from '../../constants'

export const DEFAULT_ENTRY = 'source-code'
export const DEFAULT_IMAGE = 'mlrun/mlrun'
export const DEFAULT_RUNTIME = 'job'
export const EXISTING_IMAGE = 'existingImage'
export const FORCE_BUILD = 'forceBuild'
export const NEW_IMAGE = 'newImage'
export const VOLUME_MOUNT_AUTO_TYPE = 'auto'
export const VOLUME_MOUNT_MANUAL_TYPE = 'manual'
export const VOLUME_MOUNT_NONE_TYPE = 'none'

export const runtimeOptions = isStagingMode => [
  {
    id: 'job',
    label: 'Job'
  },
  {
    id: 'serving',
    label: 'Serving',
    hidden: !isStagingMode
  }
]

export const getModalTitle = runtime => {
  if (runtime === FUNCTION_TYPE_JOB) {
    return 'Create New Function'
  } else {
    return 'Deploy serving function'
  }
}

export const entryOptions = [{ label: 'Source code', id: 'source-code' }]

export const sourceCodeInBase64 = {
  job: 'ZGVmIGhhbmRsZXIoY29udGV4dCk6CiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKCdIZWxsbyB3b3JsZCcp',
  serving:
    'ZnJvbSBjbG91ZHBpY2tsZSBpbXBvcnQgbG9hZAppbXBvcnQgbnVtcHkgYXMgbnAKZnJvbSB0eXBpbmcgaW1wb3J0IExpc3QKaW1wb3J0IG1scnVuCgpjbGFzcyBDbGFzc2lmaWVyTW9kZWwobWxydW4uc2VydmluZy5WMk1vZGVsU2VydmVyKToKICAgIGRlZiBsb2FkKHNlbGYpOgogICAgICAgICIiImxvYWQgYW5kIGluaXRpYWxpemUgdGhlIG1vZGVsIGFuZC9vciBvdGhlciBlbGVtZW50cyIiIgogICAgICAgIG1vZGVsX2ZpbGUsIGV4dHJhX2RhdGEgPSBzZWxmLmdldF9tb2RlbCgnLnBrbCcpCiAgICAgICAgc2VsZi5tb2RlbCA9IGxvYWQob3Blbihtb2RlbF9maWxlLCAncmInKSkKCiAgICBkZWYgcHJlZGljdChzZWxmLCBib2R5OiBkaWN0KSAtPiBMaXN0OgogICAgICAgICIiIkdlbmVyYXRlIG1vZGVsIHByZWRpY3Rpb25zIGZyb20gc2FtcGxlLiIiIgogICAgICAgIGZlYXRzID0gbnAuYXNhcnJheShib2R5WydpbnB1dHMnXSkKICAgICAgICByZXN1bHQ6IG5wLm5kYXJyYXkgPSBzZWxmLm1vZGVsLnByZWRpY3QoZmVhdHMpCiAgICAgICAgcmV0dXJuIHJlc3VsdC50b2xpc3QoKQ=='
}

export const generateCodeOptions = [
  {
    value: EXISTING_IMAGE,
    label: 'Use an existing image'
  },
  {
    value: NEW_IMAGE,
    label: 'Build a new image'
  }
  // {
  //   value: FORCE_BUILD,
  //   label: 'Force build',
  //   tip:
  //     'When enabled this forces an image rebuild, if not the same image is used.',
  //   hidden: mode === PANEL_CREATE_MODE
  // }
]

export const getDefaultVolumeMounts = (volume_mounts, volumes, mode) =>
  chain(volume_mounts)
    .flatten()
    .unionBy('name')
    .map(volumeMount => ({
      isDefault: true,
      data: {
        type: getVolumeType(volumes.find(volume => volume.name === volumeMount.name)),
        name: volumeMount.name,
        mountPath: volumeMount.mountPath
      },
      canBeModified: mode === PANEL_EDIT_MODE
    }))
    .value()

export const volumeMountOptions = [
  { label: 'Auto', id: VOLUME_MOUNT_AUTO_TYPE },
  { label: 'Manual', id: VOLUME_MOUNT_MANUAL_TYPE },
  { label: 'None', id: VOLUME_MOUNT_NONE_TYPE }
]
