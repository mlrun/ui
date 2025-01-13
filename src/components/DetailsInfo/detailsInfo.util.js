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
import { capitalize, isNil, isNumber, upperFirst } from 'lodash'
import classNames from 'classnames'

import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'

import { Tip } from 'igz-controls/components'
import JobPopUp from '../../elements/DetailsPopUp/JobPopUp/JobPopUp'

import {
  ALERTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTION_TYPE_APPLICATION,
  MODELS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MLRUN_STORAGE_INPUT_PATH_SCHEME
} from '../../constants'
import { formatDatetime, parseKeyValues, parseUri } from '../../utils'
import { getTriggerCriticalTimePeriod } from '../../utils/createAlertsContent'
import { getChipOptions } from '../../utils/getChipOptions'
import { getLimitsGpuType } from '../../elements/FormResourcesUnits/formResourcesUnits.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { roundFloats } from '../../utils/roundFloats'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { openPopUp } from 'igz-controls/utils/common.util'

export const generateTriggerInfoContent = criteria => {
  if (criteria) {
    return [
      {
        label: 'Trigger criteria count',
        id: 'triggerCriteriaCount',
        value: criteria?.count || 'N/A'
      },
      {
        label: 'Trigger criteria time period',
        id: 'triggerCriteriaTimePeriod',
        value: getTriggerCriticalTimePeriod(criteria?.period)
      }
    ]
  }

  return []
}

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
      page === MODELS_PAGE ? (selectedItem.framework ?? '') : null,
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
      value: capitalize(selectedFunction.preemption_mode)
    },
    {
      id: 'podsPriority',
      label: 'Pods priority',
      value: generateFunctionPriorityLabel(selectedFunction.priority_class_name)
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

export const generateAlertsDetailsInfo = selectedItem => {
  if (selectedItem.page === ALERTS_PAGE) {
    const triggerCriteriaContent = generateTriggerInfoContent(selectedItem?.criteria)
    const AlertsDetailsInfo = {
      notificationsDetailsInfo: [],
      triggerCriteriaDetailsInfo: []
    }
    const notifications = selectedItem?.notifications
    AlertsDetailsInfo.notificationsDetailsInfo = notifications.map((notification, index) => (
      <li className="notifications-item" key={index}>
        <div className="notifications-item_icon">{notification.icon}</div>
        <div>
          <div className="notifications-item__header">{upperFirst(notification.kind)}</div>
          <div className="notifications-item__header-text">
            {`${notification.succeeded} success `}
            <span
              className={classNames(
                'notifications-item__header-text_failed',
                notification.failed > 0 && 'notifications-item__header-text_success'
              )}
            >
              {`${notification.failed} failed`}
            </span>
          </div>
        </div>
      </li>
    ))

    AlertsDetailsInfo.triggerCriteriaDetailsInfo = triggerCriteriaContent.map(trigger => {
      return (
        <li className="details-item" key={trigger.id}>
          <div className="details-item__header">{trigger.label}:</div>
          <DetailsInfoItem info={trigger.value} />
        </li>
      )
    })

    return AlertsDetailsInfo
  } else {
    return []
  }
}

const producerListOrder = ['name', 'kind', 'tag', 'uri', 'owner', 'uid', 'workflow']

export const generateProducerDetailsInfo = (selectedItem, isDetailsPopUp) => {
  if (!isEveryObjectValueEmpty(selectedItem) && selectedItem.producer) {
    return Object.entries(selectedItem.producer)
      .sort((a, b) => producerListOrder.indexOf(a[0]) - producerListOrder.indexOf(b[0]))
      .map(([key, value]) => {
        let producerData = {}
        let isUri = key === 'uri'
        const handleOpenJobDetails = jobData => {
          openPopUp(JobPopUp, { jobData })
        }

        if (isUri) {
          // value is in the form of: project/uid-iteration
          const [project, rest] = value.split('/')
          const [uid, iter] = rest?.split('-') ?? []

          producerData = {
            project,
            uid,
            iter
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
            <DetailsInfoItem
              item={{
                shouldPopUp: isUri,
                handleClick: () => isUri && handleOpenJobDetails(producerData)
              }}
              info={value}
              isDetailsPopUp={isDetailsPopUp}
            />
          </li>
        )
      })
  }
}

export const generateDocumentLoaderDetailsInfo = (selectedItem, isDetailsPopUp) => {
  if (!isEveryObjectValueEmpty(selectedItem) && selectedItem.document_loader) {
    return (
      <>
        <li className="details-item" key="class">
          <div className="details-item__header">Class</div>
          <DetailsInfoItem
            info={selectedItem.document_loader.loader_class_name}
            isDetailsPopUp={isDetailsPopUp}
          />
        </li>
        <li className="details-item" key="source_name">
          <div className="details-item__header">Source name</div>
          <DetailsInfoItem
            info={selectedItem.document_loader.src_name}
            isDetailsPopUp={isDetailsPopUp}
          />
        </li>
        <li className="details-item" key="parameters">
          <div className="details-item__header">Parameters</div>
          <DetailsInfoItem
            chipsData={{
              chips: parseKeyValues(selectedItem.document_loader.kwargs),
              chipOptions: getChipOptions('results'),
              isEditEnabled: false
            }}
            isDetailsPopUp={isDetailsPopUp}
          />
        </li>
      </>
    )
  }
}

export const generateSourcesDetailsInfo = (selectedItem, projectName) => {
  const reduceHandler = (acc, [key, value]) => {
    let source = {}
    const parsedUri = parseUri(value)

    source[key] = {
      value: value,
      parsedUri: value.startsWith(MLRUN_STORAGE_INPUT_PATH_SCHEME) ? parsedUri : null
    }

    return { ...acc, ...source }
  }

  return Array.isArray(selectedItem.sources)
    ? selectedItem.sources.reduce((acc, cur) => reduceHandler(acc, [cur.name, cur.path]), {})
    : Object.entries(selectedItem.sources || {}).reduce(
        (acc, entries) => reduceHandler(acc, entries),
        {}
      )
}
