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

import { describe, it, expect } from 'vitest'

import {
  getStepsNodeData,
  getStepDescriptionFields,
  STEPS_TYPES,
  STEP_FIELD_TYPES
} from './pipeline.utils'
import {
  MODEL_RUNNER_STEP_KIND,
  ROUTER_STEP_KIND,
  ERROR_STEP_KIND,
  HUB_STEP_KIND,
  QUEUE_STEP_KIND,
  ML_NODE_WITH_SUB_ITEMS,
  ML_QUEUE_NODE,
  ML_COMMON_NODE
} from '../../constants'

describe('pipeline.utils - getStepsNodeData', () => {
  it('returns correct node data for MODEL_RUNNER step kind', () => {
    const step = {
      kind: MODEL_RUNNER_STEP_KIND,
      class_args: {
        monitoring_data: {
          modelA: {},
          modelB: {}
        }
      },
      track_models: true
    }

    const result = getStepsNodeData(step)

    expect(result.nodeType).toBe(ML_NODE_WITH_SUB_ITEMS)
    expect(result.stepType).toBe(STEPS_TYPES.MODEL_RUNNER)
    expect(result.subItemsTitle).toBe('Running models')
    expect(result.subItems).toEqual(['modelA', 'modelB'])
    expect(result.inMonitoring).toBe(true)
  })

  it('returns empty subItems array when monitoring_data is missing', () => {
    const step = {
      kind: MODEL_RUNNER_STEP_KIND,
      class_args: {},
      track_models: false
    }

    const result = getStepsNodeData(step)

    expect(result.subItems).toEqual([])
    expect(result.inMonitoring).toBe(false)
  })

  it('returns correct node data for ROUTER step kind', () => {
    const step = {
      kind: ROUTER_STEP_KIND,
      routes: {
        route1: {},
        route2: {}
      }
    }

    const result = getStepsNodeData(step)

    expect(result.nodeType).toBe(ML_NODE_WITH_SUB_ITEMS)
    expect(result.stepType).toBe(STEPS_TYPES.ROUTER_STEP)
    expect(result.subItemsTitle).toBe('Routes')
    expect(result.subItems).toEqual(['route1', 'route2'])
  })

  it('falls back to kind-based mapping for basic kinds', () => {
    const queueStep = { kind: QUEUE_STEP_KIND }
    const errorStep = { kind: ERROR_STEP_KIND }
    const hubStep = { kind: HUB_STEP_KIND }

    expect(getStepsNodeData(queueStep).nodeType).toBe(ML_QUEUE_NODE)
    expect(getStepsNodeData(errorStep).nodeType).toBe(ML_COMMON_NODE)
    expect(getStepsNodeData(hubStep).nodeType).toBe(ML_COMMON_NODE)
  })

  it('falls back to class-name based mapping when kind is not mapped', () => {
    const step = {
      kind: 'unknown',
      class_name: 'SomeCustomClass'
    }

    const result = getStepsNodeData(step)

    expect(result.nodeType).toBe(ML_COMMON_NODE)
    expect(result.stepType).toBe(STEPS_TYPES.CUSTOM_STEP)
  })

  it('falls back to default custom mapping when kind is missing', () => {
    const result = getStepsNodeData({})

    expect(result).toBeDefined()
    expect(result.nodeType).toBe(ML_COMMON_NODE)
    expect(result.stepType).toBe(STEPS_TYPES.CUSTOM_STEP)
  })

  it('returns empty subItems for ROUTER when routes is missing or empty', () => {
    const noRoutesStep = { kind: ROUTER_STEP_KIND }
    const emptyRoutesStep = { kind: ROUTER_STEP_KIND, routes: {} }

    expect(getStepsNodeData(noRoutesStep).subItems).toEqual([])
    expect(getStepsNodeData(emptyRoutesStep).subItems).toEqual([])
  })
})

describe('pipeline.utils - getStepDescriptionFields', () => {
  it('populates description and general fields correctly for MODEL_RUNNER', () => {
    const selectedStep = {
      data: {
        badgeIcon: null,
        customData: {
          kind: MODEL_RUNNER_STEP_KIND,
          class_name: 'ModelRunner',
          function: 'fn',
          handler: 'handler',
          input_path: 'in',
          result_path: 'out',
          class_args: {}
        },
        ...getStepsNodeData({
          kind: MODEL_RUNNER_STEP_KIND,
          class_args: {},
          track_models: true
        })
      }
    }

    const graph = { allow_cyclic: false }

    const result = getStepDescriptionFields(selectedStep, graph)

    const typeRow = result.general.find(row => row.label === 'Type:')
    const descriptionRow = result.general.find(row => row.label === 'Description:')

    expect(typeRow.value).toBe(STEPS_TYPES.MODEL_RUNNER)
    expect(descriptionRow.value).toBeDefined()
    expect(descriptionRow.hidden).toBe(false)
  })

  it('marks Arguments row as codeblock only for CUSTOM_STEP', () => {
    const customStep = {
      data: {
        customData: {
          kind: 'custom',
          class_name: 'MyCustomClass',
          stepType: STEPS_TYPES.CUSTOM_STEP,
          class_args: { a: 1 }
        }
      }
    }

    const graph = { allow_cyclic: false }

    const result = getStepDescriptionFields(customStep, graph)

    const argsRow = result.general.find(row => row.label === 'Arguments:')

    expect(argsRow.type).toBe(STEP_FIELD_TYPES.CODE_BLOCK)
    expect(argsRow.hidden).toBe(false)
  })

  it('sets maxIterations when graph is cyclic and step has cycle_from', () => {
    const selectedStep = {
      data: {
        customData: {
          kind: MODEL_RUNNER_STEP_KIND,
          class_name: 'ModelRunner',
          stepType: STEPS_TYPES.MODEL_RUNNER,
          cycle_from: ['step-a'],
          max_iterations: 5
        }
      }
    }

    const graph = { allow_cyclic: true, max_iterations: 10 }

    const result = getStepDescriptionFields(selectedStep, graph)

    const maxIterationsRow = result.general.find(row => row.label === 'Maximum allowed iterations:')

    expect(maxIterationsRow.value).toBe(5)
    expect(maxIterationsRow.hidden).toBe(false)
  })

  it('returns subItemsData with Routes for ROUTER_STEP', () => {
    const selectedStep = {
      data: {
        customData: {
          kind: ROUTER_STEP_KIND,
          stepType: STEPS_TYPES.ROUTER_STEP,
          routes: {
            route_a: {
              class_name: 'ClassA',
              class_args: { model_endpoint_uid: 'uid1', model_path: 'path1' },
              input_path: 'in',
              result_path: 'out'
            },
            route_b: {
              class_name: 'ClassB',
              class_args: {},
              input_path: '',
              result_path: ''
            }
          }
        },
        ...getStepsNodeData({
          kind: ROUTER_STEP_KIND,
          routes: { route_a: {}, route_b: {} }
        })
      }
    }

    const graph = { allow_cyclic: false }

    const result = getStepDescriptionFields(selectedStep, graph)

    expect(result.subItemsData.itemsTitle).toBe('Routes')
    expect(Object.keys(result.subItemsData.items)).toEqual(['route_a', 'route_b'])
    expect(result.subItemsData.items.route_a).toHaveLength(6)
    expect(result.subItemsData.items.route_a[0]).toMatchObject({
      label: 'Model endpoint:',
      value: 'uid1',
      type: STEP_FIELD_TYPES.POP_UP
    })
    expect(result.subItemsData.items.route_a[2]).toMatchObject({
      label: 'Class name:',
      value: 'ClassA'
    })
  })

  it('returns empty subItemsData items for ROUTER_STEP when routes is missing', () => {
    const selectedStep = {
      data: {
        customData: {
          kind: ROUTER_STEP_KIND,
          stepType: STEPS_TYPES.ROUTER_STEP
        },
        ...getStepsNodeData({ kind: ROUTER_STEP_KIND })
      }
    }

    const graph = { allow_cyclic: false }

    const result = getStepDescriptionFields(selectedStep, graph)

    expect(result.subItemsData.itemsTitle).toBe('Routes')
    expect(result.subItemsData.items).toEqual({})
  })
})
