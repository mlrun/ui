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
import { isEmpty, mapValues, omit, capitalize } from 'lodash-es'

import {
  ML_NODE_WITH_SUB_ITEMS,
  ML_QUEUE_NODE,
  ML_COMMON_NODE,
  MODEL_RUNNER_STEP_KIND,
  QUEUE_STEP_KIND,
  ERROR_STEP_KIND,
  HUB_STEP_KIND,
  ROUTER_STEP_KIND
} from '../../constants'

import RemoteStepIcon from 'igz-controls/images/remote-step-badge.svg?react'
import EventsStepIcon from 'igz-controls/images/events-step-badge.svg?react'
import ChoiceStepIcon from 'igz-controls/images/choice-step-badge.svg?react'
import BatchStepIcon from 'igz-controls/images/batch-step-badge.svg?react'
import FilterStepIcon from 'igz-controls/images/filter-step-badge.svg?react'
import CustomStepIcon from 'igz-controls/images/custom-step-badge.svg?react'
import ErrorStepIcon from 'igz-controls/images/error-step-badge.svg?react'
import HubStepIcon from 'igz-controls/images/mlrun-hub-step-badge.svg?react'
import ConnectionIcon from 'igz-controls/images/connections-icon.svg?react'
import RouterStepIcon from 'igz-controls/images/router-step-badge.svg?react'
import ModelServerStepIcon from 'igz-controls/images/model-server-step-badge.svg?react'

export const STEPS_TYPES = {
  MODEL_RUNNER: 'ModelRunner',
  QUEUE: 'Queue',
  ERROR_STEP: 'ErrorHandler',
  HUB_STEP: 'MLRunHub',
  EXTEND: 'Extend',
  FLAT_MAP: 'FlatMap',
  FLATTEN: 'Flatten',
  MAP_WITH_STATE: 'MapWithState',
  CHOICE: 'Choice',
  CHOICE_BY_FIELD: 'ChoiceByField',
  BATCH: 'Batch',
  FOR_EACH: 'ForEach',
  FILTER: 'Filter',
  SAMPLE_WINDOW: 'SampleWindow',
  REMOTE_STEP: 'RemoteStep',
  CUSTOM_STEP: 'Custom',
  ROUTER_STEP: 'Router',
  MAP_CLASS: 'MapClass',
  PARTITION: 'Partition',
  REDUCE: 'Reduce',
  BATCH_HTTP_REQUESTS: 'BatchHttpRequests',
  SEND_TO_HTTP: 'SendToHttp',
  MODEL_ROUTER: 'ModelRouter',
  VOTING_ENSEMBLE: 'VotingEnsemble',
  ONNX_MODEL_SERVER: 'ONNXModelServer',
  PYTORCH_MODEL_SERVER: 'PyTorchModelServer',
  SKLEARN_MODEL_SERVER: 'SKLearnModelServer',
  TFKERAS_MODEL_SERVER: 'TFKerasModelServer',
  XGBMODEL_SERVER: 'XGBModelServer'
}

export const STEP_FIELD_TYPES = {
  CODE_BLOCK: 'codeblock',
  COPY: 'copy',
  POP_UP: 'pop-up'
}

const NODE_TYPE_DATA_BY_KIND_MAP = {
  [MODEL_RUNNER_STEP_KIND]: {
    nodeType: ML_NODE_WITH_SUB_ITEMS,
    badgeIcon: <ConnectionIcon />,
    subLabel: 'Model Runner Step',
    stepType: STEPS_TYPES.MODEL_RUNNER,
    subItemsTitle: 'Running models',
    getSubItems: data => Object.keys(data?.class_args?.monitoring_data || {}),
    getInMonitoring: data => Boolean(data?.track_models)
  },
  [ROUTER_STEP_KIND]: {
    nodeType: ML_NODE_WITH_SUB_ITEMS,
    badgeIcon: <RouterStepIcon />,
    subLabel: 'Router',
    stepType: STEPS_TYPES.ROUTER_STEP,
    subItemsTitle: 'Routes',
    getSubItems: data => Object.keys(data?.routes || {})
  },
  [QUEUE_STEP_KIND]: {
    nodeType: ML_QUEUE_NODE,
    stepType: STEPS_TYPES.QUEUE
  },
  [ERROR_STEP_KIND]: {
    nodeType: ML_COMMON_NODE,
    badgeIcon: <ErrorStepIcon />,
    stepType: STEPS_TYPES.ERROR_STEP,
    subLabel: 'Error handler'
  },
  [HUB_STEP_KIND]: {
    nodeType: ML_COMMON_NODE,
    badgeIcon: <HubStepIcon />,
    subLabel: 'MLRun hub',
    stepType: STEPS_TYPES.HUB_STEP
  }
}

const getNodeTypeDataByKind = step => {
  const kind = step?.kind
  if (!kind) return undefined

  const baseData = NODE_TYPE_DATA_BY_KIND_MAP[kind]
  if (!baseData) return undefined

  const newData = { ...baseData }

  if (baseData.getSubItems) {
    newData.subItems = baseData.getSubItems(step)
    delete newData.getSubItems
  }

  if (baseData.getInMonitoring) {
    newData.inMonitoring = baseData.getInMonitoring(step)
    delete newData.getInMonitoring
  }

  return newData
}

const nodeTypeByClassMatchers = [
  {
    regex: new RegExp(
      `(${STEPS_TYPES.EXTEND}|${STEPS_TYPES.FLAT_MAP}|${STEPS_TYPES.FLATTEN}|${STEPS_TYPES.MAP_WITH_STATE}|${STEPS_TYPES.MAP_CLASS}|${STEPS_TYPES.PARTITION}|${STEPS_TYPES.REDUCE})$`
    ),
    data: { nodeType: ML_COMMON_NODE, badgeIcon: <EventsStepIcon />, group_type: 'Event operation' }
  },
  {
    regex: new RegExp(`(${STEPS_TYPES.CHOICE}|${STEPS_TYPES.CHOICE_BY_FIELD})$`),
    data: { nodeType: ML_COMMON_NODE, badgeIcon: <ChoiceStepIcon />, group_type: 'Choice' }
  },
  {
    regex: new RegExp(
      `(${STEPS_TYPES.BATCH}|${STEPS_TYPES.FOR_EACH}|${STEPS_TYPES.BATCH_HTTP_REQUESTS})$`
    ),
    data: { nodeType: ML_COMMON_NODE, badgeIcon: <BatchStepIcon />, group_type: 'Batch operation' }
  },
  {
    regex: new RegExp(`(${STEPS_TYPES.FILTER}|${STEPS_TYPES.SAMPLE_WINDOW})$`),
    data: {
      nodeType: ML_COMMON_NODE,
      badgeIcon: <FilterStepIcon />,
      group_type: 'Filter operation'
    }
  },
  {
    regex: new RegExp(`(${STEPS_TYPES.REMOTE_STEP}|${STEPS_TYPES.SEND_TO_HTTP})$`),
    data: { nodeType: ML_COMMON_NODE, badgeIcon: <RemoteStepIcon />, subLabel: 'Remote' }
  },
  {
    regex: new RegExp(
      `(${STEPS_TYPES.ONNX_MODEL_SERVER}|${STEPS_TYPES.PYTORCH_MODEL_SERVER}|${STEPS_TYPES.SKLEARN_MODEL_SERVER}|${STEPS_TYPES.TFKERAS_MODEL_SERVER}|${STEPS_TYPES.XGBMODEL_SERVER})$`
    ),
    data: { nodeType: ML_COMMON_NODE, badgeIcon: <ModelServerStepIcon />, subLabel: 'Model server' }
  }
]

export const getStepsNodeData = step => {
  // first check step.kind
  const getNodeTypeDataByClass = stepClassName => {
    if (stepClassName) {
      for (const { regex, data } of nodeTypeByClassMatchers) {
        const match = stepClassName.match(regex)

        if (match) {
          const matchedSuffix = match[1]
          const newData = { ...data }

          if (matchedSuffix && !newData.subLabel) {
            if (matchedSuffix === STEPS_TYPES.CHOICE_BY_FIELD && step.class_args?.field_name) {
              newData.subLabel = `${matchedSuffix} - ${step.class_args.field_name}`
            } else {
              newData.subLabel = matchedSuffix
            }
          }

          newData.stepType = matchedSuffix || STEPS_TYPES.CUSTOM_STEP

          return newData
        }
      }
    }

    return {
      nodeType: ML_COMMON_NODE,
      stepType: STEPS_TYPES.CUSTOM_STEP,
      badgeIcon: <CustomStepIcon />
    }
  }

  return getNodeTypeDataByKind(step) || getNodeTypeDataByClass(step.class_name)
}
// descriptions for each step type from https://docs.mlrun.org/en/stable/serving/available-steps.html
const STEPS_DESCRIPTIONS = {
  [STEPS_TYPES.BATCH]:
    'Batches events. This step emits a batch every max_events events, or when timeout seconds have passed since the first event in the batch was received.',
  [STEPS_TYPES.CHOICE]: 'Redirects each input element into one of the multiple downstreams.',
  [STEPS_TYPES.EXTEND]: 'Adds fields to each incoming event.',
  [STEPS_TYPES.FLAT_MAP]: 'Maps, or transforms, each incoming event into any number of events.',
  [STEPS_TYPES.FLATTEN]: 'Flatten is equivalent to FlatMap(lambda x: x).',
  [STEPS_TYPES.MAP_WITH_STATE]:
    'Maps, or transforms, incoming events using a stateful user-provided function, and an initial state, which can be a database table.',
  [STEPS_TYPES.CHOICE_BY_FIELD]:
    'Routes events to downstream steps based on an event field that contains the step name or names.',
  [STEPS_TYPES.FOR_EACH]:
    'Applies the given function on each event in the stream, and passes the original event downstream.',
  [STEPS_TYPES.FILTER]: 'Filters events based on a user-provided function.',
  [STEPS_TYPES.SAMPLE_WINDOW]:
    'Emits a single event in a window of window_size events, in accordance with emit_period and emit_before_termination.',
  [STEPS_TYPES.MODEL_RUNNER]:
    'Runs multiple models on each event. When used in a graph, MLRun automatically imports the default language model class (LLModel) during function deployment.',
  [STEPS_TYPES.REMOTE_STEP]: 'Class for calling remote HTTP endpoints.',
  [STEPS_TYPES.MAP_CLASS]:
    'Similar to Map, but instead of a function argument, this class should be extended and its do() method overridden.',
  [STEPS_TYPES.PARTITION]:
    'Partitions events by calling a predicate function on each event. Each processed event results in a Partitioned named tuple of (left=Optional[Event], right=Optional[Event]).',
  [STEPS_TYPES.REDUCE]:
    'Reduces incoming events into a single value that is returned upon the successful termination of the flow.',
  [STEPS_TYPES.BATCH_HTTP_REQUESTS]: 'A class for calling remote endpoints in parallel.',
  [STEPS_TYPES.SEND_TO_HTTP]:
    'Joins each event with data from any HTTP source. Used for event augmentation.',
  [STEPS_TYPES.MODEL_ROUTER]:
    'Basic model router, for calling different models per each model path.',
  [STEPS_TYPES.VOTING_ENSEMBLE]:
    'An ensemble machine learning model that combines the prediction of several models.',
  [STEPS_TYPES.ONNX_MODEL_SERVER]:
    'A model serving class for serving ONYX Models. A sub-class of the V2ModelServer class.',
  [STEPS_TYPES.PYTORCH_MODEL_SERVER]:
    'A model serving class for serving PyTorch Models. A sub-class of the V2ModelServer class.',
  [STEPS_TYPES.SKLEARN_MODEL_SERVER]:
    'A model serving class for serving Sklearn Models. A sub-class of the V2ModelServer class.',
  [STEPS_TYPES.TFKERAS_MODEL_SERVER]:
    'A model serving class for serving TFKeras Models. A sub-class of the V2ModelServer class.',
  [STEPS_TYPES.XGBMODEL_SERVER]:
    'A model serving class for serving XGB Models. A sub-class of the V2ModelServer class.'
}

const getDetailsGeneralData = selectedStepData => [
  {
    label: 'Type:',
    value: selectedStepData.group_type || selectedStepData.stepType
  },
  {
    label: 'Class name:',
    value:
      selectedStepData.stepType === STEPS_TYPES.HUB_STEP
        ? selectedStepData.hub_step_class_name
        : selectedStepData.class_name,
    hidden: !selectedStepData.class_name && !selectedStepData.hub_step_class_name
  },
  { label: 'Kind:', value: selectedStepData.kind },
  {
    label: 'Description:',
    value: selectedStepData.description,
    hidden: !selectedStepData.description
  },
  {
    label: 'Arguments:',
    value: selectedStepData.class_args,
    type: STEP_FIELD_TYPES.CODE_BLOCK,
    hidden: isEmpty(selectedStepData.class_args)
  },
  {
    label: 'Function name:',
    value: selectedStepData.function,
    hidden: !selectedStepData.function
  },
  // {
  //   label: 'State:',
  //   value: selectedStepData.state, // TODO mapping state for MapWithKey
  //   hidden: selectedStepData.stepType !== STEPS_TYPES.MAP_WITH_STATE || !selectedStepData.state
  // },
  // {
  //   label: 'Group by key:',
  //   value: selectedStepData.group_by_key,
  //   hidden: !selectedStepData.group_by_key
  // },
  {
    label: 'Link:',
    value: selectedStepData.class_name,
    hidden: selectedStepData.stepType !== STEPS_TYPES.HUB_STEP || !selectedStepData.class_name,
    type: STEP_FIELD_TYPES.COPY
  },
  {
    label: 'Maximum allowed iterations:',
    value: selectedStepData.maxIterations,
    hidden: !selectedStepData.maxIterations
  },
  {
    label: 'Data store profiles:',
    value: selectedStepData.path,
    hidden: selectedStepData.stepType !== STEPS_TYPES.QUEUE || !selectedStepData.path,
    type: STEP_FIELD_TYPES.COPY
  },
  {
    label: 'URL:',
    value: selectedStepData.class_args?.url,
    hidden:
      selectedStepData.stepType !== STEPS_TYPES.REMOTE_STEP || !selectedStepData.class_args?.url,
    type: STEP_FIELD_TYPES.COPY
  },
  {
    label: 'Method:',
    value: selectedStepData.class_args?.method,
    hidden:
      selectedStepData.stepType !== STEPS_TYPES.REMOTE_STEP || !selectedStepData.class_args?.method
  }
]

const getSubItemsData = selectedStepData => {
  switch (selectedStepData.stepType) {
    case STEPS_TYPES.MODEL_RUNNER:
      return {
        itemsTitle: 'Running models',
        items: mapValues(
          selectedStepData?.class_args?.monitoring_data ?? {},
          (runningModelData, runningModelName) => {
            return [
              {
                label: 'Model endpoint:',
                value: runningModelData.model_endpoint_uid,
                additionalData: {
                  modelEndpointName: runningModelName
                },
                type: 'pop-up'
              },
              {
                label: 'Model artifact:',
                value: runningModelData.model_path,
                type: 'pop-up'
              },
              {
                label: 'Class name:',
                value: runningModelData.model_class
              },
              {
                label: 'Input path:',
                value: runningModelData.input_path
              },
              {
                label: 'Result path:',
                value: runningModelData.result_path
              },
              {
                label: 'Outputs:',
                value: runningModelData.outputs?.join(', ') || ''
              },
              {
                label: 'Execution mechanism:',
                value:
                  selectedStepData?.class_args?.execution_mechanism_by_model_name?.[
                    runningModelName
                  ] ?? ''
              }
            ]
          }
        )
      }
    case STEPS_TYPES.ROUTER_STEP:
      return {
        itemsTitle: 'Routes',
        items: mapValues(selectedStepData?.routes ?? {}, (routeData, routeName) => {
          return [
            {
              label: 'Model endpoint:',
              value: routeData.class_args?.model_endpoint_uid,
              additionalData: {
                modelEndpointName: routeName
              },
              type: STEP_FIELD_TYPES.POP_UP
            },
            {
              label: 'Model artifact:',
              value: routeData.class_args?.model_path,
              type: STEP_FIELD_TYPES.POP_UP
            },
            {
              label: 'Class name:',
              value: routeData.class_name
            },
            {
              label: 'Input path:',
              value: routeData.input_path
            },
            {
              label: 'Result path:',
              value: routeData.result_path
            },
            {
              label: 'Outputs:',
              value: routeData.class_args?.outputs?.join(', ') || ''
            }
          ]
        })
      }
    default:
      return {
        itemsTitle: '',
        items: []
      }
  }
}

export const getStepDescriptionFields = (selectedStep, graph) => {
  const selectedStepData = {
    ...(selectedStep?.data || {}),
    ...(selectedStep?.data?.customData || {})
  }

  selectedStepData.description = STEPS_DESCRIPTIONS[selectedStepData.stepType] ?? ''

  if (!selectedStepData.description) {
    const exactClassName = selectedStepData.class_name?.substring(
      selectedStepData.class_name.lastIndexOf('.') + 1
    )
    selectedStepData.description = STEPS_DESCRIPTIONS[exactClassName] ?? ''
  }

  if (graph.allow_cyclic && (selectedStepData.cycle_from?.length || selectedStepData.cycleTo)) {
    selectedStepData.maxIterations = selectedStepData.max_iterations || graph.max_iterations || ''
  }

  const predefinedGeneralData = getDetailsGeneralData(selectedStepData)
  const fieldsToOmit = [
    'description',
    'maxIterations',
    'track_models',
    'class_args',
    'after',
    'class_name',
    'function',
    'hub_step_class_name',
    'kind',
    'group_by_key',
    'cycle_from',
    'cycle_to',
    'shape',
    'endpoint_type'
  ]

  if (selectedStepData.stepType === STEPS_TYPES.QUEUE) fieldsToOmit.push('path')
  if (selectedStepData.stepType === STEPS_TYPES.REMOTE_STEP) fieldsToOmit.push('url', 'method')

  const restOfGeneralData = Object.entries(omit(selectedStepData.customData, fieldsToOmit)).map(
    ([key, value]) => ({
      label: `${capitalize(key.replace(/_/g, ' '))}:`,
      value: typeof value === 'object' ? value : String(value),
      type: typeof value === 'object' ? STEP_FIELD_TYPES.CODE_BLOCK : undefined
    })
  )
  const subItemsData = getSubItemsData(selectedStepData)

  return {
    general: [...predefinedGeneralData, ...restOfGeneralData],
    subItemsData
  }
}
