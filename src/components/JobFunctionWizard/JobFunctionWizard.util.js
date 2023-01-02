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
import {
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType,
  getVolumeType
} from '../../utils/panelResources.util'
import { parseChipsData } from '../../utils/convertChipsData'

import { FUNCTION_TYPE_JOB, PANEL_DEFAULT_ACCESS_KEY, PANEL_EDIT_MODE } from '../../constants'

export const DEFAULT_ENTRY = 'source-code'
export const DEFAULT_IMAGE = 'mlrun/mlrun'
export const DEFAULT_PRIORITY = 'igz-workload-medium'
export const DEFAULT_RUNTIME = 'job'
export const EXISTING_IMAGE = 'existingImage'
export const FORCE_BUILD = 'forceBuild'
export const NEW_IMAGE = 'newImage'
export const VOLUME_MOUNT_AUTO_TYPE = 'auto'
export const VOLUME_MOUNT_MANUAL_TYPE = 'manual'
export const VOLUME_MOUNT_NONE_TYPE = 'none'

export const getInitialValues = (appStore, defaultData, mode, runtime) => {
  const defaultPodsResources = appStore.frontendSpec?.default_function_pod_resources
  const extraData = {
    entry: DEFAULT_ENTRY,
    imageType:
      defaultData &&
      (defaultData?.build?.image ||
        defaultData?.build?.base_image ||
        defaultData?.build?.commands?.length > 0) &&
      defaultData.image?.length === 0
        ? NEW_IMAGE
        : EXISTING_IMAGE,
    force_build: null,
    volumeMount: VOLUME_MOUNT_AUTO_TYPE
  }
  const gpuType = getLimitsGpuType(defaultData?.spec?.resources?.limits ?? null)

  if (defaultData) {
    return {
      ...defaultData,
      metadata: {
        ...defaultData.metadata,
        labels: parseChipsData(defaultData.metadata?.labels)
      },
      spec: {
        ...defaultData.spec,
        build: {
          ...defaultData.spec.build,
          base_image:
            defaultData.spec?.build?.base_image ??
            appStore.frontendSpec?.default_function_image_by_kind?.[defaultData.kind] ??
            '',
          commands:
            (defaultData.spec?.build?.commands || []).join('\n') ||
            appStore.frontendSpec?.function_deployment_mlrun_command ||
            '',
          functionSourceCode:
            defaultData.spec.build?.functionSourceCode ?? sourceCodeInBase64[defaultData.kind] ?? ''
        },
        image:
          defaultData.spec?.image ??
          appStore.frontendSpec?.default_function_image_by_kind?.[defaultData.kind] ??
          '',
        preemption_mode:
          appStore.frontendSpec.feature_flags.preemption_nodes === 'enabled'
            ? defaultData.spec.preemption_mode ||
              appStore.frontendSpec.default_function_preemption_mode ||
              'prevent'
            : '',
        priority_class_name:
          defaultData.spec.priority_class_name ||
          appStore.frontendSpec.default_function_priority_class_name ||
          DEFAULT_PRIORITY,
        resources: {
          ...defaultData.spec.resources,
          limits: {
            ...defaultData.spec.resources.limits,
            cpuUnit: getDefaultCpuUnit(
              defaultData.spec?.resources?.limits ?? {},
              defaultPodsResources?.limits.cpu
            ),
            memory:
              defaultData.spec?.resources?.limits?.memory ??
              defaultPodsResources?.limits.memory ??
              '',
            [gpuType]:
              defaultData.spec?.resources?.limits?.[gpuType] ??
              defaultPodsResources?.limits.gpu ??
              '',
            memoryUnit: getDefaultMemoryUnit(
              defaultData.spec?.resources?.limits ?? {},
              defaultPodsResources?.limits.memory
            )
          },
          requests: {
            ...defaultData.spec.resources.requests,
            cpu:
              defaultData.spec?.resources?.requests?.cpu ??
              defaultPodsResources?.requests.cpu ??
              '',
            cpuUnit: getDefaultCpuUnit(
              defaultData.spec?.resources?.requests ?? {},
              defaultPodsResources?.requests.cpu
            ),
            memory:
              defaultData.spec?.resources?.requests?.memory ??
              defaultPodsResources?.requests.memory ??
              '',
            memoryUnit: getDefaultMemoryUnit(
              defaultData.spec?.resources?.requests ?? {},
              defaultPodsResources?.requests.memory
            )
          }
        },
        volume_mounts:
          getDefaultVolumeMounts(
            defaultData.volume_mounts ?? [],
            defaultData.volumes ?? [],
            mode
          ) || []
      },
      extra: extraData
    }
  }

  const functionKind = runtime ?? DEFAULT_RUNTIME

  return {
    kind: functionKind,
    metadata: {
      credentials: {
        access_key: PANEL_DEFAULT_ACCESS_KEY
      },
      labels: []
    },
    spec: {
      build: {
        base_image: appStore.frontendSpec?.default_function_image_by_kind?.[functionKind] ?? '',
        commands: appStore.frontendSpec?.function_deployment_mlrun_command || '',
        functionSourceCode: sourceCodeInBase64[functionKind] ?? ''
      },
      image: appStore.frontendSpec?.default_function_image_by_kind?.[functionKind] ?? '',
      preemption_mode:
        appStore.frontendSpec?.feature_flags?.preemption_nodes === 'enabled'
          ? appStore.frontendSpec.default_function_preemption_mode || 'prevent'
          : '',
      priority_class_name:
        appStore.frontendSpec.default_function_priority_class_name || DEFAULT_PRIORITY,
      resources: {
        limits: {
          cpu: defaultPodsResources?.limits.cpu ?? '',
          cpuUnit: getDefaultCpuUnit({}, defaultPodsResources?.limits.cpu),
          memory: defaultPodsResources?.limits.memory ?? '',
          [gpuType]: defaultPodsResources?.limits.gpu ?? '',
          memoryUnit: getDefaultMemoryUnit({}, defaultPodsResources?.limits.memory)
        },
        requests: {
          cpu: defaultPodsResources?.requests.cpu ?? '',
          cpuUnit: getDefaultCpuUnit({}, defaultPodsResources?.requests.cpu),
          memory: defaultPodsResources?.requests.memory ?? '',
          memoryUnit: getDefaultMemoryUnit({}, defaultPodsResources?.requests.memory)
        }
      }
    },
    extra: extraData
  }
}

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

export const getModalTitle = (runtime, isEditMode) => {
  if (isEditMode) return 'Edit Function'

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
