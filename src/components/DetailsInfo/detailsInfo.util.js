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
import { capitalize, isNil, isNumber } from 'lodash'

import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'

import { Tip } from 'igz-controls/components'

import {
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTION_TYPE_APPLICATION,
  MODELS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MONITOR_JOBS_TAB
} from '../../constants'
import { formatDatetime } from '../../utils'
import { getChipOptions } from '../../utils/getChipOptions'
import { getLimitsGpuType } from '../../elements/FormResourcesUnits/formResourcesUnits.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { roundFloats } from '../../utils/roundFloats'

const DRIFT_DETECTED_THRESHOLD = 0.7
const POSSIBLE_DRIFT_THRESHOLD = 0.5

export const generateArtifactsInfoContent = (page, pageTab, selectedItem) => {
  if (pageTab === MODEL_ENDPOINTS_TAB) {
    const { name, tag } =
      (selectedItem?.metadata?.uid ?? '').match(/^(?<name>.*?):(?<tag>.*)$/)?.groups ?? {}
    return [tag, name]
  } else
    return [
      selectedItem.hash ?? '',
      selectedItem.db_key,
      selectedItem.iter || '0',
      page !== FEATURE_STORE_PAGE && page !== FILES_PAGE ? selectedItem.kind || ' ' : null,
      selectedItem.size ?? '',
      selectedItem.target_path,
      selectedItem.tree,
      formatDatetime(selectedItem.updated, 'N/A'),
      page === MODELS_PAGE ? selectedItem.framework ?? '' : null,
      selectedItem.labels ?? [],
      selectedItem.sources
    ].filter(content => !isNil(content))
}

const generateFunctionConfigurationContent = selectedFunction => {
  const requests = selectedFunction.resources.requests ?? {}
  const limits = selectedFunction.resources.limits ?? {}

  return [
    {
      id: 'runOnSpotNodes',
      label: 'Run on Spot nodes',
      value: selectedFunction.preemption_mode
    },
    {
      id: 'podsPriority',
      label: 'Pods priority',
      value: selectedFunction.priority_class_name
    },
    {
      id: 'memoryRequests',
      label: 'Memory requests',
      value: requests.memory ?? ''
    },
    {
      id: 'memoryLimit',
      label: 'Memory limit',
      value: limits.memory ?? ''
    },
    {
      id: 'cpuRequests',
      label: 'CPU requests',
      value: requests.cpu ?? ''
    },
    {
      id: 'cpuLimit',
      label: 'CPU limit',
      value: limits.cpu ?? ''
    },
    {
      id: 'gpuLimit',
      label: 'GPU limit',
      value: limits[getLimitsGpuType(limits)] ?? ''
    },
    {
      id: 'minReplicas',
      label: 'Min replicas',
      value: selectedFunction.min_replicas
    },
    {
      id: 'maxReplicas',
      label: 'Max replicas',
      value: selectedFunction.max_replicas
    },
    {
      id: 'nodeSelectors',
      label: 'Node Selectors',
      value: selectedFunction.node_selector,
      chipVariant: 'results'
    }
  ]
}

const generateModelEndpointDriftContent = modelEndpoint => {
  return [
    {
      id: 'tvd_mean',
      label: 'Mean TVD',
      value: roundFloats(modelEndpoint.status?.drift_measures?.tvd_mean, 2) ?? '-'
    },
    {
      id: 'hellinger_mean',
      label: 'Mean Hellinger',
      value: roundFloats(modelEndpoint.status?.drift_measures?.hellinger_mean, 2) ?? '-'
    },
    {
      id: 'kld_mean',
      label: 'Mean KLD',
      value: roundFloats(modelEndpoint.status?.drift_measures?.kld_mean, 2) ?? '-'
    },
    {
      id: 'drift_value',
      label: 'Drift Actual Value',
      value:
        isNumber(modelEndpoint.status?.drift_measures?.hellinger_mean) &&
        isNumber(modelEndpoint.status?.drift_measures?.tvd_mean)
          ? roundFloats(
              (modelEndpoint.status?.drift_measures?.hellinger_mean +
                modelEndpoint.status?.drift_measures?.tvd_mean) /
                2,
              2
            )
          : '-'
    },
    {
      id: 'drift_detected_threshold',
      label: 'Drift Detected Threshold',
      value:
        roundFloats(modelEndpoint.spec?.monitor_configuration?.drift_detected_threshold, 2) ??
        DRIFT_DETECTED_THRESHOLD
    },
    {
      id: 'possible_drift_threshold',
      label: 'Possible Drift Threshold',
      value:
        roundFloats(modelEndpoint.spec?.monitor_configuration?.possible_drift_threshold, 2) ??
        POSSIBLE_DRIFT_THRESHOLD
    }
  ]
}

export const generateConfigurationDetailsInfo = selectedFunction => {
  if (selectedFunction.type === FUNCTION_TYPE_APPLICATION) {
    const functionContent = generateFunctionConfigurationContent(selectedFunction)

    return functionContent.map(item => {
      return (
        <li className="details-item" key={item.id}>
          <div className="details-item__header">{item.label}:</div>
          <DetailsInfoItem
            info={item.value}
            chipsData={
              item.chipVariant
                ? {
                    chips: item.value,
                    chipOptions: getChipOptions(item.chipVariant)
                  }
                : null
            }
          />
        </li>
      )
    })
  } else {
    return []
  }
}

export const generateDriftDetailsInfo = modelEndpoint => {
  const modelEndpointContent = generateModelEndpointDriftContent(modelEndpoint)

  return modelEndpoint?.status?.drift_measures
    ? modelEndpointContent.map(item => {
        return (
          <li className="details-item" key={item.id}>
            <div className="details-item__header">{item.label}:</div>
            <DetailsInfoItem info={item.value} />
          </li>
        )
      })
    : []
}

export const generateProducerDetailsInfo = selectedItem => {
  if (!isEveryObjectValueEmpty(selectedItem) && selectedItem.producer) {
    return Object.entries(selectedItem.producer).map(([key, value]) => {
      let url = ''

      if (key === 'uri') {
        // value is in the form of: project/uid-iteration
        const [project, rest] = value.split('/')
        const [uid] = rest?.split('-') ?? []
        if (uid) {
          url = `/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${uid}/overview`
        }
      }

      return (
        <li className="details-item" key={key}>
          <div className="details-item__header">
            {key === 'uri' || key === 'uid' ? key.toUpperCase() : capitalize(key)}:
            {key === 'uid' && (
              <Tip
                className="details-item__tip"
                text="Unique identifier representing the job or the workflow that generated the artifact"
              />
            )}
          </div>
          <DetailsInfoItem link={url} info={value} />
        </li>
      )
    })
  }
}
