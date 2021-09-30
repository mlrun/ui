import { chain } from 'lodash'
import { getVolumeType } from '../../utils/panelResources.util'
import { PANEL_EDIT_MODE } from '../../constants'

export const REQUESTS = 'requests'
export const LIMITS = 'limits'

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

export const setRangeInputValidation = (
  data,
  setValidation,
  value,
  type,
  validationField,
  kind
) => {
  const validationKind = kind.charAt(0).toUpperCase() + kind.slice(1)
  const limitsValue = Number.parseInt(data.limits[kind])
  const requestsValue = Number.parseInt(data.requests[kind])
  const isValid =
    type === REQUESTS
      ? value <= limitsValue && limitsValue > 0
      : value >= requestsValue && requestsValue > 0

  if (value > 0) {
    if (
      (type === REQUESTS && data.limits[kind].length > 0) ||
      (type === LIMITS && data.requests[kind].length > 0)
    ) {
      setValidation(prevState => ({
        ...prevState,
        [`is${validationKind}RequestValid`]: isValid,
        [`is${validationKind}LimitValid`]: isValid
      }))
    } else {
      setValidation(prevState => ({ ...prevState, [validationField]: true }))
    }
  } else if (value.length === 0) {
    setValidation(prevState => ({
      ...prevState,
      [`is${validationKind}LimitValid`]:
        type === LIMITS || !limitsValue ? true : limitsValue > 0,
      [`is${validationKind}RequestValid`]:
        type === REQUESTS || !requestsValue ? true : requestsValue > 0
    }))
  } else {
    setValidation(prevState => ({ ...prevState, [validationField]: false }))
  }
}

export const VOLUME_MOUNT_AUTO_TYPE = 'auto'
export const VOLUME_MOUNT_MANUAL_TYPE = 'manual'
export const VOLUME_MOUNT_NONE_TYPE = 'none'

export const volumeMountOptions = [
  { label: 'Auto', id: VOLUME_MOUNT_AUTO_TYPE },
  { label: 'Manual', id: VOLUME_MOUNT_MANUAL_TYPE },
  { label: 'None', id: VOLUME_MOUNT_NONE_TYPE }
]
