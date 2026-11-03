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
import { capitalize } from 'lodash-es'

import {
  BASIC_SETTINGS_FIELD,
  RESOURCES_FIELD,
  BUILD_FIELD,
  ENV_VAR_TYPE,
  PREEMPTION_MODE_LABEL,
  VOLUME_TYPE_LABEL,
  PROBE_TYPE,
  PROBE_HANDLER_TYPE,
  PROBE_FIELD
} from './applicationConfiguration.constants'

const GPU_RESERVED_KEYS = ['cpu', 'cpuUnit', 'memory', 'memoryUnit']
const NVIDIA_GPU_KEY = 'nvidia.com/gpu'
const SIDECARS_CONFIG_KEY = 'spec.sidecars'

const getMlrunSpec = application =>
  application?.spec ?? application?.ui?.originalContent?.spec ?? {}

const getNuclioSpec = application => application?.nuclioFunc?.spec ?? {}

const getMlrunMetadata = application =>
  application?.metadata ?? application?.ui?.originalContent?.metadata ?? {}

const getApplicationRuntimeSidecar = application => {
  const sidecars =
    application?.config?.[SIDECARS_CONFIG_KEY] ??
    getMlrunSpec(application).config?.[SIDECARS_CONFIG_KEY]

  return Array.isArray(sidecars) ? (sidecars[0] ?? {}) : {}
}

const getApplicationRuntimeResources = application => {
  const sidecar = getApplicationRuntimeSidecar(application)
  return sidecar.resources ?? {}
}

const getNuclioSidecar = application => application?.nuclioFunc?.spec?.sidecars?.[0] ?? {}

const getApplicationRuntimeEnv = application => {
  const mlrunSidecar = getApplicationRuntimeSidecar(application)
  const nuclioSidecar = getNuclioSidecar(application)
  return mlrunSidecar.env ?? nuclioSidecar.env ?? []
}

const getApplicationRuntimeVolumeMounts = application => {
  const mlrunSidecar = getApplicationRuntimeSidecar(application)
  const nuclioSidecar = getNuclioSidecar(application)
  return mlrunSidecar.volumeMounts ?? nuclioSidecar.volumeMounts ?? []
}

const getGpuLimitValue = limits => {
  if (!limits) return null

  if (limits[NVIDIA_GPU_KEY]) return limits[NVIDIA_GPU_KEY]

  const gpuKey =
    Object.keys(limits).find(key => key.includes('/gpu')) ||
    Object.keys(limits).find(
      key => !GPU_RESERVED_KEYS.includes(key) && key !== 'cpu' && key !== 'memory'
    )

  return gpuKey ? limits[gpuKey] : null
}

const getPriorityLabel = priorityClassName => {
  if (!priorityClassName) return null
  const labelName = priorityClassName.split('-').pop()
  return capitalize(labelName)
}

const getSecurityContext = (mlrunSpec, nuclioSpec) =>
  mlrunSpec.securityContext ?? mlrunSpec.security_context ?? nuclioSpec.securityContext ?? {}

const getLoggerSinks = (application, mlrunSpec, nuclioSpec) =>
  application.config?.['spec.loggerSinks'] ?? mlrunSpec.loggerSinks ?? nuclioSpec.loggerSinks ?? []

const getApplicationBuildConfig = application => {
  const mlrunSpec = getMlrunSpec(application)

  return application.build ?? mlrunSpec.build ?? {}
}

const getScaleToZeroWindow = spec => {
  const scaleResources = spec.scaleToZero?.scaleResources
  if (!scaleResources?.length) return null
  return scaleResources[0].windowSize ?? null
}

export const getBasicSettingsItems = application => {
  const mlrunSpec = getMlrunSpec(application)
  const nuclioSpec = getNuclioSpec(application)
  const securityContext = getSecurityContext(mlrunSpec, nuclioSpec)
  const loggerSinks = getLoggerSinks(application, mlrunSpec, nuclioSpec)

  return [
    {
      label: BASIC_SETTINGS_FIELD.ENABLED,
      value: (mlrunSpec.disable ?? nuclioSpec.disable) ? 'No' : 'Yes'
    },
    {
      label: BASIC_SETTINGS_FIELD.DESCRIPTION,
      value: application.description || null
    },
    {
      label: BASIC_SETTINGS_FIELD.SERVICE_ACCOUNT,
      value: mlrunSpec.service_account || nuclioSpec.serviceAccount || null
    },
    {
      label: BASIC_SETTINGS_FIELD.RUN_AS_USER,
      value: securityContext.runAsUser?.toString() || null
    },
    {
      label: BASIC_SETTINGS_FIELD.RUN_AS_GROUP,
      value: securityContext.runAsGroup?.toString() || null
    },
    {
      label: BASIC_SETTINGS_FIELD.LOGGER_LEVEL,
      value: loggerSinks[0]?.level ? capitalize(loggerSinks[0].level) : null
    }
  ]
}

export const getResourcesItems = application => {
  const mlrunSpec = getMlrunSpec(application)
  const nuclioSpec = getNuclioSpec(application)
  const resources = getApplicationRuntimeResources(application)
  const requests = resources.requests ?? {}
  const limits = resources.limits ?? {}
  const gpuValue = getGpuLimitValue(limits)

  return [
    {
      label: RESOURCES_FIELD.RUN_ON_SPOT_NODES,
      value:
        PREEMPTION_MODE_LABEL[application.preemption_mode] ??
        (capitalize(application.preemption_mode || '') || null)
    },
    {
      label: RESOURCES_FIELD.PODS_PRIORITY,
      value: getPriorityLabel(application.priority_class_name) || null
    },
    {
      label: RESOURCES_FIELD.MEMORY_REQUEST,
      value: requests.memory || null
    },
    {
      label: RESOURCES_FIELD.MEMORY_LIMIT,
      value: limits.memory || null
    },
    {
      label: RESOURCES_FIELD.CPU_REQUEST,
      value: requests.cpu || null
    },
    {
      label: RESOURCES_FIELD.CPU_LIMIT,
      value: limits.cpu || null
    },
    {
      label: RESOURCES_FIELD.GPU_LIMIT,
      value: gpuValue || null
    },
    {
      label: RESOURCES_FIELD.REPLICAS_MIN,
      value: (application.min_replicas ?? mlrunSpec.min_replicas)?.toString() || null
    },
    {
      label: RESOURCES_FIELD.REPLICAS_MAX,
      value: (application.max_replicas ?? mlrunSpec.max_replicas)?.toString() || null
    },
    {
      label: RESOURCES_FIELD.INACTIVITY_WINDOW,
      value: getScaleToZeroWindow(mlrunSpec) ?? getScaleToZeroWindow(nuclioSpec)
    },
    {
      label: RESOURCES_FIELD.TARGET_CPU,
      value:
        (mlrunSpec.targetCPU ?? nuclioSpec.targetCPU)
          ? `${mlrunSpec.targetCPU ?? nuclioSpec.targetCPU}%`
          : null
    }
  ]
}

export const getBuildItems = application => {
  const buildConfig = getApplicationBuildConfig(application)
  const buildCommands = buildConfig.commands

  return [
    {
      label: BUILD_FIELD.IMAGE_NAME,
      value: application.application_image || null
    },
    {
      label: BUILD_FIELD.BASE_IMAGE,
      value: buildConfig.base_image ?? null
    },
    {
      label: BUILD_FIELD.BUILD_COMMANDS,
      value:
        Array.isArray(buildCommands) && buildCommands.length > 0 ? buildCommands.join('\n') : null
    },
    {
      label: BUILD_FIELD.PULL_AT_RUNTIME,
      value: buildConfig.load_source_on_run ? 'Yes' : 'No'
    }
  ]
}

export const getEnvironmentVariables = application => {
  const env = getApplicationRuntimeEnv(application)

  return env.map(envVar => {
    const isSecret = Boolean(envVar.valueFrom?.secretKeyRef)

    if (isSecret) {
      const secretRef = envVar.valueFrom.secretKeyRef
      return {
        type: ENV_VAR_TYPE.SECRET,
        key: envVar.name,
        value: `Secret key: ${secretRef.key || ''}, Secret name: ${secretRef.name || ''}`
      }
    }

    return {
      type: ENV_VAR_TYPE.VALUE,
      key: envVar.name,
      value: envVar.value ?? ''
    }
  })
}

export const getLabelsData = application => {
  const mlrunMetadata = getMlrunMetadata(application)
  const nuclioMetadata = application?.nuclioFunc?.metadata ?? {}
  const labels = mlrunMetadata.labels ?? nuclioMetadata.labels ?? {}

  if (Array.isArray(labels)) {
    return labels.map(item => ({
      key: item.key ?? item.name ?? '',
      value: item.value ?? ''
    }))
  }

  return Object.entries(labels).map(([key, value]) => ({
    key,
    value: String(value)
  }))
}

export const getAnnotationsData = application => {
  const mlrunMetadata = getMlrunMetadata(application)
  const annotations = application.annotations ?? mlrunMetadata.annotations ?? {}

  return Object.entries(annotations).map(([key, value]) => ({
    key,
    value: String(value)
  }))
}

const detectVolumeType = volume => {
  if (volume.configMap) return 'configMap'
  if (volume.secret) return 'secret'
  if (volume.persistentVolumeClaim) return 'persistentVolumeClaim'
  if (volume.hostPath) return 'hostPath'
  if (volume.emptyDir !== undefined) return 'emptyDir'
  if (volume.flexVolume) return 'flexVolume'
  return 'unknown'
}

const getVolumeDetails = (volume, volumeType) => {
  switch (volumeType) {
    case 'configMap':
      return { 'Config map name': volume.configMap.name || '' }
    case 'secret':
      return { 'Secret name': volume.secret.secretName || '' }
    case 'persistentVolumeClaim':
      return { 'Claim name': volume.persistentVolumeClaim.claimName || '' }
    case 'hostPath':
      return { Path: volume.hostPath.path || '' }
    case 'flexVolume':
      return { Driver: volume.flexVolume.driver || '' }
    default:
      return {}
  }
}

const findVolumeDefinition = (volumeDefinitions, name) => {
  const entry = volumeDefinitions.find(v => (v.volume ?? v).name === name)
  return entry?.volume ?? entry
}

export const getVolumesData = application => {
  const volumeDefinitions =
    getMlrunSpec(application).volumes ?? getNuclioSpec(application).volumes ?? []
  const volumeMounts = getApplicationRuntimeVolumeMounts(application)

  return volumeMounts.map(mount => {
    const volume = findVolumeDefinition(volumeDefinitions, mount.name)
    const volumeType = volume ? detectVolumeType(volume) : 'unknown'

    return {
      name: mount.name || '',
      type: VOLUME_TYPE_LABEL[volumeType] || '',
      mountPath: mount.mountPath || '',
      readOnly: mount.readOnly ? 'Yes' : 'No',
      details: volume ? getVolumeDetails(volume, volumeType) : {}
    }
  })
}

const getProbeHandlerType = probe => {
  if (probe.httpGet) return PROBE_HANDLER_TYPE.HTTP
  if (probe.tcpSocket) return PROBE_HANDLER_TYPE.TCP
  if (probe.grpc) return PROBE_HANDLER_TYPE.GRPC
  if (probe.exec) return PROBE_HANDLER_TYPE.EXEC
  return null
}

const getProbeDetails = probe => {
  const handlerType = getProbeHandlerType(probe)
  const items = []

  if (probe.initialDelaySeconds != null) {
    items.push({
      label: PROBE_FIELD.INITIAL_DELAY_SECONDS,
      value: String(probe.initialDelaySeconds)
    })
  }
  if (probe.periodSeconds != null) {
    items.push({ label: PROBE_FIELD.PERIOD_SECONDS, value: String(probe.periodSeconds) })
  }
  if (probe.failureThreshold != null) {
    items.push({ label: PROBE_FIELD.FAILURE_THRESHOLD, value: String(probe.failureThreshold) })
  }
  if (probe.timeoutSeconds != null) {
    items.push({ label: PROBE_FIELD.TIMEOUT_SECONDS, value: String(probe.timeoutSeconds) })
  }

  if (handlerType === PROBE_HANDLER_TYPE.HTTP && probe.httpGet) {
    if (probe.httpGet.path) items.push({ label: PROBE_FIELD.HTTP_PATH, value: probe.httpGet.path })
    if (probe.httpGet.port)
      items.push({ label: PROBE_FIELD.HTTP_PORT, value: String(probe.httpGet.port) })
  }

  if (handlerType === PROBE_HANDLER_TYPE.TCP && probe.tcpSocket) {
    if (probe.tcpSocket.port)
      items.push({ label: PROBE_FIELD.TCP_PORT, value: String(probe.tcpSocket.port) })
  }

  if (handlerType === PROBE_HANDLER_TYPE.GRPC && probe.grpc) {
    if (probe.grpc.port)
      items.push({ label: PROBE_FIELD.GRPC_PORT, value: String(probe.grpc.port) })
  }

  return items
}

const getProbeAdditionalSettings = probe => {
  const knownKeys = new Set([
    'httpGet',
    'tcpSocket',
    'grpc',
    'exec',
    'initialDelaySeconds',
    'periodSeconds',
    'failureThreshold',
    'timeoutSeconds'
  ])

  return Object.entries(probe)
    .filter(([key]) => !knownKeys.has(key))
    .map(([key, value]) => ({
      label: key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }))
}

export const getProbesData = application => {
  const mlrunSidecar = getApplicationRuntimeSidecar(application)
  const nuclioSidecar = getNuclioSidecar(application)

  const readinessProbe = mlrunSidecar.readinessProbe ?? nuclioSidecar.readinessProbe
  const livenessProbe = mlrunSidecar.livenessProbe ?? nuclioSidecar.livenessProbe
  const startupProbe = mlrunSidecar.startupProbe ?? nuclioSidecar.startupProbe

  const probes = []

  if (readinessProbe) {
    probes.push({
      name: PROBE_TYPE.READINESS,
      handlerType: getProbeHandlerType(readinessProbe),
      details: getProbeDetails(readinessProbe),
      additionalSettings: getProbeAdditionalSettings(readinessProbe)
    })
  }

  if (livenessProbe) {
    probes.push({
      name: PROBE_TYPE.LIVENESS,
      handlerType: getProbeHandlerType(livenessProbe),
      details: getProbeDetails(livenessProbe),
      additionalSettings: getProbeAdditionalSettings(livenessProbe)
    })
  }

  if (startupProbe) {
    probes.push({
      name: PROBE_TYPE.STARTUP,
      handlerType: getProbeHandlerType(startupProbe),
      details: getProbeDetails(startupProbe),
      additionalSettings: getProbeAdditionalSettings(startupProbe)
    })
  }

  return probes
}
